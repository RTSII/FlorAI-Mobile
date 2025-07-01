# FlorAI-Mobile - Project Resume Guide

This document helps you quickly resume work on the FlorAI-Mobile project by summarizing the current status, recent changes, and next steps.

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- npm or Yarn
- Git
- Expo CLI (local installation)

### Setup & Development

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**

   ```bash
   npx expo start --clear
   ```

4. **Code Quality**

   ```bash
   # Run TypeScript type checking
   npx tsc --noEmit

   # Run linter
   npm run lint

   # Run tests
   npm test
   ```

5. **Git Workflow**
   - Follow the Git Flow branching strategy
   - Create feature branches from `develop`
   - Submit pull requests for review
   - Ensure all tests pass before merging

## 📋 Current Status (2025-06-27)

### ✅ Completed

- Resolved TypeScript declaration conflicts
- Fixed module resolution issues
- Updated to use local Expo CLI (removed global dependency)
- Fixed MaterialCommunityIcons type issues
- Cleaned up and reorganized type declarations
- Configured proper module resolution in tsconfig.json and metro.config.js
- Set up project with TypeScript and Expo Router
- Implemented basic navigation structure

### 🔄 In Progress

- Verifying development server startup with new Expo CLI
- Testing screen rendering and navigation
- Fixing remaining lint and TypeScript issues
- Implementing core UI components with React Native Paper

### 📝 Next Steps

1. **Immediate Tasks**
   - [ ] Start the development server using the new local Expo CLI
   - [ ] Verify that all screens render correctly
   - [ ] Test navigation between screens
   - [ ] Run linter and fix any remaining issues
   - [ ] Verify UI/UX against design specifications

2. **Upcoming Features**
   - [ ] Implement camera interface with AI integration
   - [ ] Set up Supabase authentication
   - [ ] Develop plant identification functionality
   - [ ] Create user profile and findings gallery
   - [ ] Implement community features

3. **Testing & Quality**
   - [ ] Write unit tests for core components
   - [ ] Set up E2E testing
   - [ ] Perform accessibility audit
   - [ ] Optimize performance for various devices

## 🛠️ Project Structure

```
├── src/
│   ├── @types/                  # TypeScript type definitions
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Base UI components
│   │   ├── buttons/             # Button components
│   │   └── surfaces/            # Card and other surface components
│   │
│   ├── navigation/             # Navigation configuration
│   │   └── AppNavigator.tsx     # Main navigation setup
│   │
│   ├── screens/                # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── IdentifyScreen.tsx
│   │   ├── CollectionScreen.tsx
│   │   ├── CareScreen.tsx
│   │   └── DiscoverScreen.tsx
│   │
│   ├── theme/                  # Design tokens and theming
│   │   └── designTokens.ts      # Theme configuration
│   │
│   └── lib/                    # Utility functions and services
│       ├── supabase.ts          # Supabase client
│       └── supermemory.ts       # Supermemory.ai integration
│
├── App.tsx                     # Main application component
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro bundler configuration
└── tsconfig.json                # TypeScript configuration
```

## 🔍 Key Files

- **App.tsx**: Main application component with navigation setup
- **metro.config.js**: Metro bundler configuration with module resolution
- **tsconfig.json**: TypeScript configuration with path aliases
- **src/theme/designTokens.ts**: Design tokens and theming (MD3 compliant)
- **src/navigation/AppNavigator.tsx**: Main navigation setup
- **src/lib/supabase.ts**: Supabase client configuration
- **src/lib/supermemory.ts**: Supermemory.ai integration
- **.env.example**: Template for environment variables
- **package.json**: Project dependencies and scripts

## 🎨 Design System

### Typography

- Uses system fonts with platform-specific fallbacks
- Follows Material Design 3 typography scale
- Defined in `src/theme/designTokens.ts`

### Colors

- Material Design 3 color system
- Light/dark theme support
- Accessible contrast ratios

### Components

- Built with React Native Paper
- Custom components extend base components
- Follows Atomic Design principles

## 🔧 Development Workflow

### Code Style

- 2-space indentation
- Single quotes for strings
- Follow Airbnb JavaScript/TypeScript Style Guide
- TypeScript with strict mode enabled

### Git Workflow

1. Create a feature branch from `develop`
2. Make your changes with atomic commits
3. Run linter and tests before pushing
4. Create a pull request for review
5. Address all review comments
6. Squash and merge when approved

### Testing

- Unit tests: `npm test`
- Linting: `npm run lint`
- Type checking: `npx tsc --noEmit`

## 📝 Notes for Next Session

- The project now uses a local installation of Expo CLI
- All TypeScript type issues have been resolved
- Module resolution is configured to use path aliases (e.g., @/components)
- The development server can be started with `npx expo start --clear`
- Follow the project's code style and commit message conventions

## 🆘 Getting Help

If you encounter any issues:

1. **Check Documentation**
   - [Expo Documentation](https://docs.expo.dev/)
   - [React Native Paper](https://callstack.github.io/react-native-paper/)
   - [Supabase Docs](https://supabase.com/docs)

2. **Troubleshooting**

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Reinstall dependencies
   rm -rf node_modules
   npm install

   # Clear Metro bundler cache
   npx expo start --clear
   ```

3. **Team Members**
   - Product Manager: [Name/Contact]
   - Lead Developer: [Name/Contact]
   - UI/UX Designer: [Name/Contact]

4. **Issue Reporting**
   - Check existing issues before creating new ones
   - Provide detailed reproduction steps
   - Include relevant logs and screenshots
   - Mention your environment (OS, Node version, etc.)

## 📅 Project Timeline

### Current Phase: Core Setup & UI Development

- **Start Date**: 2025-06-20
- **Target Completion**: 2025-07-15
- **Next Milestone**: MVP with basic plant identification

### Upcoming Phases

1. **AI Integration** (2025-07-16 to 2025-08-15)
   - Implement camera interface
   - Integrate plant identification API
   - Add offline support

2. **User Features** (2025-08-16 to 2025-09-15)
   - User authentication
   - Plant collection management
   - Community features

3. **Polish & Launch** (2025-09-16 to 2025-10-01)
   - Performance optimization
   - Beta testing
   - App store submission
