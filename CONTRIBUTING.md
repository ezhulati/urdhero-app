# Contributing to Urdhëro

Thank you for considering contributing to the Urdhëro restaurant ordering platform! This document provides guidelines and instructions for contributing to our project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/urdhero-albania.git`
3. Navigate to the project directory: `cd urdhero-albania`
4. Install dependencies: `npm install`
5. Create a `.env.local` file with your Firebase configuration (see README.md)
6. Start the development server: `npm run dev`

## Development Workflow

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes:
   - Run unit tests: `npm test`
   - Run the development server and manually test: `npm run dev`
4. Commit your changes using conventional commit format:
   - `feat: add new feature`
   - `fix: resolve issue with X`
   - `docs: update documentation`
   - `style: formatting changes`
   - `refactor: restructure code without changing functionality`
   - `test: add or update tests`
   - `chore: update build scripts, etc.`
5. Push your branch: `git push -u origin feature/your-feature-name`
6. Open a pull request against the main branch

## Pull Request Process

1. Ensure your code follows the project's style and conventions
2. Update documentation if necessary
3. Add tests for new features
4. Ensure all tests pass
5. Make sure your code is properly formatted
6. Request a review from a maintainer

## Code Style Guidelines

- Follow the TypeScript style guide
- Use functional components with hooks for React components
- Use Tailwind CSS for styling
- Follow the file structure conventions of the project
- Write meaningful comments and documentation

## Commit Guidelines

- Use conventional commit messages
- Keep commits focused and atomic
- Reference issues in commit messages where applicable

## Testing

- Write unit tests for new functionality
- Test components with React Testing Library
- Ensure existing tests pass before submitting a PR

## Documentation

- Update README.md if you add new features or change existing ones
- Document complex functions and components
- Keep API documentation up to date

## Reporting Bugs

If you find a bug, please create an issue with:
- A clear title and description
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/device information

## Feature Requests

Feature requests are welcome! Please create an issue with:
- A clear title and description
- Detailed explanation of the feature
- Any relevant mockups or examples
- Justification for why this feature would benefit the project

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.

Thank you for contributing to Urdhëro!