# Changesets VSCode Extension

This extension provides a simple way to use the [changesets](https://github.com/changesets/changesets) workflow directly from within VSCode.

## Features

-   **`Changeset: Add (Manual)` command:** Walks you through creating a new changeset file, similar to the `changeset add` CLI command.
-   **`Changeset: Add with AI` command:** Automatically determines version bumps and generates a summary based on your staged git changes using Google's Gemini AI.
-   **`Changeset: Add Empty` command:** Creates an empty changeset with no version bumps, useful for documentation-only changes.

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

## Development

This extension is built for VSCode and requires Node.js. To run it in development mode:

1. Clone this repository
2. Run `npm install`
3. Press F5 in VSCode to launch the extension in a new Extension Development Host window
