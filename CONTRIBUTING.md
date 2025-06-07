# Contributing to Payment Link MCP

Thank you for your interest in contributing to the Payment Link MCP project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project.

## Development Process

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Format code: `npm run format`
7. Commit your changes with a descriptive commit message
8. Push to your fork
9. Create a Pull Request

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the version number in package.json following [SemVer](https://semver.org/)
3. The PR will be merged once you have the sign-off of at least one other developer

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Acquired.com API credentials:
```
ACQUIRED_COM_APP_ID=your_app_id
ACQUIRED_COM_APP_KEY=your_app_key
```

3. Run tests:
```bash
npm test
```

## Code Style

- Use ESLint and Prettier for code formatting
- Follow the existing code style
- Write clear, descriptive commit messages
- Include comments for complex logic

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Update tests when fixing bugs

## Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Document any new environment variables

## Questions?

Feel free to open an issue for any questions or concerns. 