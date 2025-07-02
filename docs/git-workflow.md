# FlorAI-Mobile Git Workflow Guidelines

**Version:** 1.0.0  
**Last Updated:** July 1, 2025  
**Status:** Active

## Purpose

This document outlines the recommended Git workflow and best practices for the FlorAI-Mobile repository. Following these guidelines will help maintain code quality, ensure consistent version control, and facilitate collaboration among team members.

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [Branching Strategy](#branching-strategy)
3. [Commit Guidelines](#commit-guidelines)
4. [Pull Request Process](#pull-request-process)
5. [Code Review Standards](#code-review-standards)
6. [Security Considerations](#security-considerations)

## Repository Structure

The FlorAI-Mobile repository is hosted on GitHub at [https://github.com/RTSII/FlorAI-Mobile](https://github.com/RTSII/FlorAI-Mobile).

## Branching Strategy

We follow a simplified Git Flow branching model:

- **`master`**: The main branch containing production-ready code
- **`develop`**: Integration branch for features in development
- **`feature/*`**: Feature branches for new functionality
- **`bugfix/*`**: Branches for bug fixes
- **`release/*`**: Branches for release preparation
- **`hotfix/*`**: Branches for urgent production fixes

### Branch Naming Conventions

- Feature branches: `feature/feature-name`
- Bug fix branches: `bugfix/issue-description`
- Hotfix branches: `hotfix/issue-description`
- Release branches: `release/version-number`

## Commit Guidelines

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Changes to the build process or auxiliary tools

#### Examples

```
feat(identification): add multi-image plant identification support

fix(premium): resolve subscription validation issue

docs: update API documentation
```

### Best Practices for Commits

1. **Make atomic commits**: Each commit should represent a single logical change
2. **Commit early and often**: Small, frequent commits are easier to review and revert if needed
3. **Write meaningful commit messages**: Clearly explain what changes were made and why
4. **Reference issues**: Include issue numbers in commit messages when applicable (e.g., "fix #123")
5. **Don't commit sensitive information**: Never commit API keys, credentials, or personal data

## Pull Request Process

1. Create a new branch from `develop` for your feature or bugfix
2. Make your changes in small, logical commits
3. Push your branch to GitHub
4. Create a Pull Request to merge your changes into `develop`
5. Ensure the PR description clearly describes the changes and references any related issues
6. Request reviews from appropriate team members
7. Address any feedback from code reviews
8. Once approved, merge the PR using the "Squash and merge" option

## Code Review Standards

All code changes should be reviewed before merging to ensure quality and consistency:

1. **Functionality**: Does the code work as intended?
2. **Code quality**: Is the code clean, readable, and maintainable?
3. **Performance**: Are there any performance concerns?
4. **Security**: Are there any security vulnerabilities?
5. **Testing**: Are appropriate tests included?
6. **Documentation**: Are comments and documentation updated?

## Security Considerations

1. **Sensitive information**: Never commit sensitive information such as:
   - API keys
   - Passwords
   - Service account credentials
   - Personal data
   - Environment variables with secrets

2. **Environment variables**:
   - Store sensitive values in `.env` files
   - Always include `.env` files in `.gitignore`
   - Provide an `.env.example` file with placeholder values

3. **Secret scanning**:
   - GitHub's secret scanning will block pushes containing detected secrets
   - If you receive a secret scanning alert, immediately rotate any compromised credentials
   - Use the GitHub interface to bypass alerts only for non-sensitive or revoked credentials

## Troubleshooting Common Issues

### Commit Message Format Errors

If you encounter errors when committing, it's likely due to commit message format validation:

```
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg script failed (code 1)
```

**Solution:**

1. Ensure your commit message follows the Conventional Commits format: `<type>[optional scope]: <description>`
2. Valid types include: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
3. Example of a valid commit message: `fix: optimize plant identification service structure`

### Bypassing Husky Hooks (Emergency Only)

In emergency situations where you need to bypass the commit hooks:

```bash
git commit -m "fix: your message here" --no-verify
```

**Note:** This should only be used in exceptional circumstances. Always try to follow the proper commit message format first.

### Husky Deprecation Warnings

If you see Husky deprecation warnings about lines in `.husky/commit-msg`, you may need to remove these lines:

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
```

These will be removed in Husky v10.0.0 and should be addressed proactively.

## Additional Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [GitHub Secret Scanning Documentation](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [Husky Documentation](https://typicode.github.io/husky/)
