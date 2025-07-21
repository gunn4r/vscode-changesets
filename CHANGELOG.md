# vscode-changesets

## 0.3.0

### Minor Changes

- 8bffa80: feat(vscode-changesets): Add AI-powered changeset suggestions using Google Gemini and secure API key storage.
- 83e961e: feat(vscode-changesets): Enhance validation and security for changeset creation, including path sanitization and input validation

  chore(vscode-changesets): Update README to include details on Google's Gemini AI integration and empty changeset workflow

- 1f5e86f: Enhanced security and API key management for VS Code Changesets extension

  - Added API key management commands: "Set Gemini API Key" and "Clear Gemini API Key"
  - Fixed package name validation to support scoped packages (e.g., @scope/package-name)
  - Improved API authentication by using query parameters instead of Authorization header
  - Enhanced error handling and security measures
  - Added comprehensive security documentation in README
  - Cleaned up debug logs for production readiness
  - Improved path validation and input sanitization

- 364bb14: Add command to create an empty changeset

### Patch Changes

- e79578a: Updated and cleaned up README.md
