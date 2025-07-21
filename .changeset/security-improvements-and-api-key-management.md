---
"vscode-changesets": minor
---

Enhanced security and API key management for VS Code Changesets extension

- Added API key management commands: "Set Gemini API Key" and "Clear Gemini API Key"
- Fixed package name validation to support scoped packages (e.g., @scope/package-name)
- Improved API authentication by using query parameters instead of Authorization header
- Enhanced error handling and security measures
- Added comprehensive security documentation in README
- Cleaned up debug logs for production readiness
- Improved path validation and input sanitization 