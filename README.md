# Changesets VSCode Extension

This extension provides a simple way to use the [changesets](https://github.com/changesets/changesets) workflow directly from within VSCode.

## Features

-   **`Changeset: Add (Manual)` command:** Walks you through creating a new changeset file, similar to the `changeset add` CLI command.
-   **`Changeset: Add with AI` command:** Automatically determines version bumps and generates a summary based on your staged git changes using Google's Gemini AI.
-   **`Changeset: Add Empty` command:** Creates an empty changeset with no version bumps, useful for documentation-only changes.
-   **`Changeset: Set Gemini API Key` command:** Manually set or replace your Google Gemini API key.
-   **`Changeset: Clear Gemini API Key` command:** Remove your stored API key from secure storage.

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
4.  The first time you run this, you will be prompted to enter your Google Gemini API key. This will be stored securely for future use.
5.  The extension will analyze your staged changes and propose version bumps and a summary.
6.  Review the AI's suggestion and click "Accept" to create the changeset file.

### Empty Changeset Workflow

1.  Open the Command Palette.
2.  Type and select `Changeset: Add Empty`.
3.  Enter a summary for your changes (can be empty for documentation-only changes).
4.  The changeset will be created with no version bumps.

## Requirements

-   Your project should be set up to use changesets. If it's not, run `npx changeset init` (or your package managers equivalent) in your project's root directory.
-   `git` must be installed and available in your system's PATH.
-   For the AI feature, you must have staged changes (`git add ...`) for the AI to analyze.
-   You need a Google Gemini API key to use the AI Feature. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

## AI Feature Details

The AI-powered workflow uses Google's Gemini 2.0 Flash model to:
- Analyze your staged git changes
- Determine appropriate semantic version bumps (major, minor, or patch) for affected packages
- Generate a concise changelog summary
- Present the suggestions in a user-friendly format for review

The extension securely stores your API key using VSCode's built-in secret storage, so you only need to enter it once.

## Security

This extension implements several security measures to protect your data and system:

- **Secure API Key Storage**: API keys are stored using VSCode's built-in secret storage
- **Path Validation**: All file operations validate paths to prevent path traversal attacks
- **Input Sanitization**: All user inputs are validated and sanitized before processing
- **Memory Protection**: Limits on buffer sizes and file counts prevent memory exhaustion attacks
- **Command Injection Protection**: Git commands are executed with validated working directories
- **Cryptographically Secure Randomness**: File names are generated using secure random algorithms

### API Key Security

**Important**: When using the AI feature, your Google Gemini API key is transmitted as a query parameter in the URL. While this is the official method required by Google's API, it has some security implications:

#### Security Considerations:
- **Server Logs**: The API key may appear in Google's server logs
- **Network Proxies**: Corporate or network proxies might log the full URL including the API key
- **HTTPS Transmission**: The key is transmitted over HTTPS, but is visible in the URL

#### Recommendations:
1. **Use a Dedicated API Key**: Create a separate API key specifically for this extension rather than using your main Google account key
2. **Monitor Usage**: Check your Google AI Studio dashboard for unexpected usage
3. **Rotate Keys**: Consider rotating your API key periodically
4. **Limit Scope**: If possible, create API keys with minimal required permissions

#### What We Do to Protect You:
- API keys are stored encrypted in VSCode's secure storage
- Keys are automatically cleared if they become invalid
- All API requests include a user agent for tracking
- No API keys are logged or stored in plain text

You can manage your API key using the `Changeset: Set API Key` and `Changeset: Clear API Key` commands.

## Development

This extension is built for VSCode and requires Node.js. To run it in development mode:

1. Clone this repository
2. Run `npm install`
3. Press F5 in VSCode to launch the extension in a new Extension Development Host window
