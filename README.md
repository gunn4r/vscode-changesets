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

## CI/CD Setup

This project uses [changesets](https://github.com/changesets/changesets) for versioning and automated releases. The CI/CD pipeline automatically publishes to the VS Code Marketplace.

### Required GitHub Secrets

To enable automated publishing, you need to set up the following secret in your GitHub repository:

1. **`VSCE_PAT`**: Your VS Code Marketplace Personal Access Token
   - Create at: https://marketplace.visualstudio.com/manage
   - Requires marketplace publish permissions

### How It Works

1. **Changeset Creation**: When you create changesets using the extension commands, they are stored in the `.changeset/` directory
2. **Automated PRs**: The changesets bot automatically creates release PRs when changesets are added
3. **Versioning**: When a release PR is merged, the CI automatically:
   - Bumps version numbers based on changeset types
   - Updates the changelog
   - Publishes to the VS Code Marketplace
   - Creates a GitHub release

### Manual Release Process

If you need to manually trigger a release:

1. Create changesets using the extension commands
2. Commit and push the changesets
3. The bot will create a release PR automatically
4. Review and merge the PR to trigger the release

### Local Development

To test the release process locally:

```bash
# Install changesets CLI
npm install -g @changesets/cli

# Create a changeset
changeset

# Preview the release
changeset version

# Preview the publish
changeset publish --dry-run
```

## Contributing

We welcome contributions to improve this extension! Here's how you can help:

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gunn4r/vscode-changesets.git
   cd vscode-changesets
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Open in VSCode**:
   ```bash
   code .
   ```

4. **Run the extension**:
   - Press `F5` to launch the extension in a new Extension Development Host window
   - Test your changes in the development environment

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** to the extension code

3. **Test your changes**:
   - Use the Extension Development Host to test your changes
   - Ensure all commands work correctly
   - Test with different project configurations

4. **Create a changeset**:
   - Use the extension commands to create a changeset for your changes
   - Or run `npx changeset` in the terminal
   - Choose the appropriate version bump (patch, minor, major)

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - The changesets bot will automatically create a release PR
   - Review the proposed changes and version bumps
   - Merge when ready

### Development Guidelines

- **Code Style**: Follow the existing code style and patterns
- **Security**: All user inputs should be validated and sanitized
- **Error Handling**: Provide clear error messages for users
- **Documentation**: Update README.md for new features
- **Testing**: Test your changes thoroughly before submitting

### Areas for Contribution

- **Bug Fixes**: Report and fix issues you encounter
- **Feature Enhancements**: Add new functionality to the extension
- **Documentation**: Improve README, add examples, or clarify instructions
- **Performance**: Optimize extension performance
- **Security**: Enhance security measures and validation
- **UI/UX**: Improve the user experience and interface

### Reporting Issues

When reporting issues, please include:
- VSCode version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Any error messages or logs

### Questions or Need Help?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues and discussions first

Thank you for contributing to making this extension better for everyone!
