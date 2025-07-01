# Contributing to FlorAI-Mobile

Thank you for your interest in contributing to FlorAI-Mobile! This guide will help you get started with the project and understand our development practices.

## 🌟 First Time Setup

1. **Prerequisites**
   - Node.js v16+
   - npm or Yarn
   - Git
   - Expo CLI (`npm install -g expo-cli`)
   - Google Cloud SDK (for backend services)
   - Supabase CLI (for local development)

2. **Environment Setup**

   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/FlorAI-Mobile.git
   cd FlorAI-Mobile

   # Install dependencies
   npm install

   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development Workflow**

   ```bash
   # Start the development server
   npm start

   # Run tests
   npm test

   # Lint code
   npm run lint
   ```

## 🧑‍💻 Development Standards

### Code Style

- TypeScript with strict mode enabled
- Follow Airbnb JavaScript/TypeScript Style Guide
- 2-space indentation
- Single quotes for strings
- Semicolons at end of statements
- Max line length: 100 characters

### Git Workflow

1. Create a new branch for each feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Run tests and linter
4. Commit with a descriptive message:
   ```
   feat: add plant identification service
   fix: resolve camera permission issue
   docs: update API documentation
   ```
5. Push your branch and create a Pull Request

### Testing

- Write unit tests for all new features
- Test coverage should not decrease
- Mock external API calls in tests
- Test on both iOS and Android simulators

## 🤖 AI/Agent Assignment Guide

### When to Use AI Assistance

| Task Type       | Recommended AI/Agent | Notes                                         |
| --------------- | -------------------- | --------------------------------------------- |
| Code Generation | GPT-4                | For generating boilerplate and component code |
| Code Review     | Claude 3 Opus        | For thorough code analysis and suggestions    |
| Bug Fixing      | GPT-4 + CodeQL       | For identifying and fixing complex bugs       |
| Documentation   | Claude 3 Sonnet      | For clear, concise documentation              |
| UI/UX Design    | Midjourney + GPT-4   | For generating mockups and design suggestions |
| Performance     | GPT-4 + DeepCode     | For performance optimization                  |
| Security        | CodeQL + Snyk        | For security analysis                         |

### AI Context Guidelines

- Always provide clear, specific prompts
- Include relevant file paths and context
- Specify the desired output format
- Review all AI-generated code before committing
- Document any AI assistance in commit messages

## 📁 Project Structure

```
FlorAI-Mobile/
├── src/
│   ├── assets/           # Images, fonts, and other static files
│   ├── components/       # Reusable UI components
│   ├── constants/        # App-wide constants
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   ├── services/         # API and service integrations
│   │   └── supermemory/  # Supermemory API service
│   ├── store/            # State management
│   ├── theme/            # Styling and theming
│   └── utils/            # Utility functions
├── scripts/             # Build and utility scripts
├── __tests__/           # Test files
├── .env                 # Environment variables
├── .eslintrc.js         # ESLint configuration
├── .gitignore           # Git ignore rules
├── app.json             # Expo configuration
├── babel.config.js      # Babel configuration
├── package.json         # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## 🚀 Getting Started with Development

### Key Files to Review First

1. `src/App.tsx` - Main application component
2. `src/navigation/AppNavigator.tsx` - Navigation setup
3. `src/theme/index.ts` - Theme configuration
4. `src/services/supermemory/` - Supermemory API integration
5. `src/screens/PlantIdentification/` - Core feature implementation

### Common Tasks

#### Adding a New Screen

1. Create a new directory in `src/screens/`
2. Create `YourScreen.tsx` and `styles.ts`
3. Add screen to the navigation
4. Add tests in `__tests__/screens/YourScreen.test.tsx`

#### Adding a New Service

1. Create a new directory in `src/services/`
2. Create `yourService.service.ts`
3. Add tests in `__tests__/services/yourService.test.ts`
4. Document the service in README.md

## 📝 Code Review Process

1. Create a Pull Request (PR)
2. Ensure all checks pass (tests, linting)
3. Request review from at least one team member
4. Address all review comments
5. Get approval before merging
6. Squash and merge when approved

## 🆘 Getting Help

- For technical questions, open an issue
- For urgent matters, contact the project maintainers
- Check the project's README for additional resources

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE) file.
