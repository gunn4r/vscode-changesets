# Changesets Cursor Extension

This extension provides a simple way to use the [changesets](https://github.com/changesets/changesets) workflow directly from within VSCode.

## Features

-   **`Changeset: Add (Manual)` command:** Walks you through creating a new changeset file, similar to the `changeset add` CLI command.
-   **`Changeset: Add with AI` command:** Automatically determines version bumps and generates a summary based on your staged git changes.

## How to Use

### Manual Workflow

1.  Open a project that has been initialized with changesets.
2.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3.  Type and select `Changeset: Add (Manual)`.
4.  Follow the prompts to select packages, choose semver bumps, and write a summary.

### AI-Powered Workflow

1.  Make your code changes and stage them using `git add`.
2.  Open the Command Palette.
3.  Type and select `Changeset: Add with AI`.
4.  The extension will analyze your staged changes and propose version bumps and a summary.
5.  Review the AI's suggestion and click "Accept" to create the changeset file.

## Requirements

-   Your project should be set up to use changesets. If it's not, run `npx changeset init` in your project's root directory.
-   `git` must be installed and available in your system's PATH.
-   For the AI feature, you must have staged changes (`git add ...`) for the AI to analyze.
*/


// ---------------- .vscode/launch.json ----------------

/*
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run Extension",
            "type": "extensionHost",
            "request": "launch",
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}"
            ]
        }
    ]
}
*/
