
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Register the manual 'changeset.add' command
    let manualCommand = vscode.commands.registerCommand('changeset.add', async function () {
        await runChangesetWorkflow(false);
    });

    // Register the AI-powered 'changeset.addWithAI' command
    let aiCommand = vscode.commands.registerCommand('changeset.addWithAI', async function () {
        await runChangesetWorkflow(true);
    });

    context.subscriptions.push(manualCommand, aiCommand);
}

/**
 * Main logic for the changeset workflow.
 * @param {boolean} useAI - Whether to use the AI-powered workflow.
 */
async function runChangesetWorkflow(useAI = false) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('Changesets: No workspace folder found. Please open a project.');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    try {
        const packages = await findPackages(rootPath);
        if (packages.length === 0) {
            vscode.window.showErrorMessage('Changesets: No packages found. Make sure your project has package.json files.');
            return;
        }

        let packagesWithBumps;
        let summary;

        if (useAI) {
            // AI-powered workflow
            const aiSuggestion = await getAIChangesetSuggestion(rootPath, packages);
            if (!aiSuggestion) {
                // Error or cancellation is handled inside the function
                return;
            }
            packagesWithBumps = aiSuggestion.bumps;
            summary = aiSuggestion.summary;

            // Confirm with the user
            const confirmation = await vscode.window.showInformationMessage(
                `AI Suggestion: Bumps - ${JSON.stringify(packagesWithBumps)}. Summary - "${summary}". Create changeset?`,
                { modal: true },
                'Accept'
            );

            if (confirmation !== 'Accept') {
                vscode.window.showInformationMessage('Changeset creation cancelled.');
                return;
            }

        } else {
            // Manual workflow
            const selectedPackages = await promptForPackages(packages);
            if (!selectedPackages || selectedPackages.length === 0) {
                vscode.window.showInformationMessage('Changeset creation cancelled.');
                return;
            }

            packagesWithBumps = await promptForBumpTypes(selectedPackages);
            if (!packagesWithBumps) {
                vscode.window.showInformationMessage('Changeset creation cancelled.');
                return;
            }

            summary = await promptForSummary();
            if (!summary) {
                vscode.window.showInformationMessage('Changeset creation cancelled.');
                return;
            }
        }

        await createChangesetFile(rootPath, packagesWithBumps, summary);
        vscode.window.showInformationMessage('Changeset created successfully!');

    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
    }
}


/**
 * Uses Gemini to suggest changeset details based on staged git changes.
 * @param {string} rootPath The root path of the workspace.
 * @param {Array<{name: string, path: string}>} packages The list of available packages.
 * @returns {Promise<{bumps: Object, summary: string} | null>}
 */
async function getAIChangesetSuggestion(rootPath, packages) {
    const gitDiff = await getStagedGitDiff(rootPath);
    if (!gitDiff) {
        vscode.window.showErrorMessage('Changesets AI: No staged changes found. Please `git add` your changes first.');
        return null;
    }

    const packageNames = packages.map(p => p.name);

    // Show a progress indicator
    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Changesets AI is analyzing your changes...",
        cancellable: true
    }, async (progress, token) => {
        if (token.isCancellationRequested) {
            return null;
        }

        const prompt = `
You are an expert in semantic versioning and writing conventional commit messages.
Analyze the following git diff for a project with these packages: ${packageNames.join(', ')}.
Based on the changes, determine the appropriate semantic version bump (major, minor, or patch) for ONLY the packages that were actually changed.
Also, write a single, concise changelog summary for all the changes combined.

The git diff is:
\`\`\`diff
${gitDiff}
\`\`\`

Respond with a JSON object that strictly follows this schema. Do not include any other text or explanation.

{
  "type": "object",
  "properties": {
    "bumps": {
      "type": "object",
      "description": "An object where keys are the package names that have changed and values are 'major', 'minor', or 'patch'."
    },
    "summary": {
      "type": "string",
      "description": "A concise summary of the changes, suitable for a changelog."
    }
  },
  "required": ["bumps", "summary"]
}
`;

        try {
            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // Gemini API key would be required here in a real scenario
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
                 const text = result.candidates[0].content.parts[0].text;
                 // Clean the response to get valid JSON
                 const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
                 return JSON.parse(jsonString);
            } else {
                 throw new Error('Invalid response structure from AI.');
            }

        } catch (error) {
            console.error("Error calling AI model:", error);
            vscode.window.showErrorMessage(`Changesets AI Error: ${error.message}`);
            return null;
        }
    });
}

/**
 * Executes `git diff --staged` to get the current changes.
 * @param {string} cwd The directory to run the command in.
 * @returns {Promise<string>} The git diff output.
 */
function getStagedGitDiff(cwd) {
    return new Promise((resolve, reject) => {
        exec('git diff --staged', { cwd, maxBuffer: 1024 * 10000 }, (error, stdout, stderr) => {
            if (error) {
                // If there's an error but stdout has content, it might just be a warning.
                // If stdout is empty, it's a real error.
                if (!stdout) {
                    console.error(`git diff stderr: ${stderr}`);
                    return reject(error);
                }
            }
            resolve(stdout);
        });
    });
}


// --- Functions from previous version (unchanged) ---

/**
 * Finds all packages within the workspace by looking for package.json files.
 * @param {string} rootPath The root path of the workspace.
 * @returns {Promise<Array<{name: string, path: string}>>} A promise that resolves to an array of package objects.
 */
async function findPackages(rootPath) {
    const packageJsonPaths = await vscode.workspace.findFiles('**/package.json', '**/node_modules/**');
    const packages = [];
    for (const file of packageJsonPaths) {
        try {
            const content = await vscode.workspace.fs.readFile(file);
            const json = JSON.parse(content.toString());
            if (json.name && !json.private) {
                packages.push({ name: json.name, path: path.dirname(file.fsPath) });
            }
        } catch (e) {
            console.error(`Could not read or parse ${file.fsPath}`, e);
        }
    }
    const rootPackageJsonPath = path.join(rootPath, 'package.json');
    if (fs.existsSync(rootPackageJsonPath)) {
        try {
            const content = fs.readFileSync(rootPackageJsonPath, 'utf-8');
            const json = JSON.parse(content);
             if (json.name && !json.private && !packages.some(p => p.name === json.name)) {
                packages.unshift({ name: json.name, path: rootPath });
            }
        } catch(e) {
            console.error(`Could not read or parse root package.json`, e);
        }
    }
    return packages;
}

/**
 * Shows a quick pick menu for the user to select packages.
 * @param {Array<{name: string, path: string}>} packages The list of available packages.
 * @returns {Promise<Array<{name: string, path: string}> | undefined>} A promise that resolves to the selected packages.
 */
async function promptForPackages(packages) {
    if (packages.length === 1) {
        return packages;
    }
    const packageItems = packages.map(p => ({ label: p.name, description: p.path, detail: p.name }));
    const selectedItems = await vscode.window.showQuickPick(packageItems, {
        canPickMany: true,
        placeHolder: 'Select packages to include in this changeset',
    });
    if (!selectedItems) {
        return undefined;
    }
    return selectedItems.map(item => packages.find(p => p.name === item.label));
}

/**
 * Prompts the user to select a semver bump type for each selected package.
 * @param {Array<{name: string, path: string}>} selectedPackages The packages selected by the user.
 * @returns {Promise<Object | undefined>} An object mapping package names to bump types.
 */
async function promptForBumpTypes(selectedPackages) {
    const bumpTypes = ['major', 'minor', 'patch'];
    const packagesWithBumps = {};
    for (const pkg of selectedPackages) {
        const bumpType = await vscode.window.showQuickPick(bumpTypes, {
            placeHolder: `Select semver bump type for ${pkg.name}`,
        });
        if (!bumpType) {
            return undefined;
        }
        packagesWithBumps[pkg.name] = bumpType;
    }
    return packagesWithBumps;
}

/**
 * Prompts the user for a summary of the changes.
 * @returns {Promise<string | undefined>} The summary text.
 */
async function promptForSummary() {
    return await vscode.window.showInputBox({
        prompt: 'Enter a summary for this changeset (this will be in the changelog)',
        placeHolder: 'A brief description of the changes...',
    });
}

/**
 * Creates the changeset file in the .changeset directory.
 * @param {string} rootPath The root path of the workspace.
 * @param {Object} packagesWithBumps An object mapping package names to bump types.
 * @param {string} summary The summary of the changes.
 */
async function createChangesetFile(rootPath, packagesWithBumps, summary) {
    const changesetDir = path.join(rootPath, '.changeset');
    if (!fs.existsSync(changesetDir)) {
        fs.mkdirSync(changesetDir);
    }
    const randomId = Math.random().toString(36).substr(2, 5);
    const fileName = `changeset-${randomId}.md`;
    const filePath = path.join(changesetDir, fileName);
    let content = '---\n';
    for (const [pkg, bump] of Object.entries(packagesWithBumps)) {
        content += `"${pkg}": ${bump}\n`;
    }
    content += '---\n\n';
    content += `${summary}\n`;
    fs.writeFileSync(filePath, content);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
