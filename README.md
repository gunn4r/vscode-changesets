# Changesets VSCode Extension

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
4.  The first time you run this, you will be prompted to enter your Google Gemini API key. This will be stored securely for future use.
5.  The extension will analyze your staged changes and propose version bumps and a summary.
6.  Review the AI's suggestion and click "Accept" to create the changeset file.

## Requirements

-   Your project should be set up to use changesets. If it's not, run `npx changeset init` in your project's root directory.
-   `git` must be installed and available in your system's PATH.
-   For the AI feature, you must have staged changes (`git add ...`) for the AI to analyze.
-   You need a Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
