# FlorAI-Mobile - AI-Powered Plant Identification App

**Repository:** [https://github.com/RTSII/FlorAI-Mobile](https://github.com/RTSII/FlorAI-Mobile)

## 📌 Current Status (Last Updated: 2025-06-27)

### Recent Changes

- ✅ Resolved TypeScript declaration conflicts and module resolution issues
- ✅ Updated Expo CLI to use local version (removed global dependency)
- ✅ Fixed MaterialCommunityIcons type issues
- ✅ Configured proper module resolution with updated tsconfig.json and metro.config.js
- ✅ Cleaned up and reorganized type declarations

### Next Steps

1. Start the development server using the new local Expo CLI
2. Verify that all screens render correctly
3. Test navigation between screens
4. Run linter and fix any remaining issues
5. Verify UI/UX against design specifications

## 🌱 Project Overview

**Mission**: Create the world's most advanced AI-powered plant identification mobile app that goes beyond simple identification to become a comprehensive plant companion.

### Core Vision

A mobile app that identifies plant species in real-time using device camera and AI, with user profiles, community sharing, offline capabilities, and advanced AI-driven features that differentiate us from competitors like PlantNet and PictureThis.

### Key Differentiators

- **AI-First Approach**: Multi-modal AI analysis (identification + disease detection + health assessment + personalized care)
- **Persistent AI Memory**: Supermemory.ai integration for cross-session learning and personalized experiences
- **Transparent Premium Experience**: No aggressive paywalls, clear value proposition
- **Advanced Features**: AR plant visualization, growth prediction, AI plant doctor with historical context
- **Real-time Performance**: Optimized for smooth camera performance and minimal AI detection latency

## 📝 Development Guidelines

### Git Workflow

We follow a structured Git workflow to maintain code quality and facilitate collaboration. Please review our [Git Workflow Guidelines](./docs/git-workflow.md) before contributing to the repository.

Key points:
- Follow the branching strategy (feature/, bugfix/, hotfix/, release/ branches)
- Use conventional commits format for commit messages
- Never commit sensitive information (API keys, credentials, etc.)
- Create pull requests for code reviews before merging

## 🏗️ Technical Architecture

### Tech Stack

- **Frontend**:
  - Expo (React Native) with TypeScript
  - Expo Router (file-based)
  - React Native Paper (Material Design)
- **Backend**:
  - Supabase (Authentication, Realtime DB)
  - Google Cloud Functions (Serverless Backend)
  - Cloud Run (Containerized Services)
- **AI/ML Services**:
  - Google Cloud Vision AI (Plant Identification)
  - Vertex AI (Custom Model Training)
  - AutoML Vision (Specialized Plant Models)
- **Storage**:
  - Supabase Storage (User Content)
  - Google Cloud Storage (AI Models/Assets)
- **AI Memory Layer**:
  - [Supermemory.ai](https://supermemory.ai) (User Context & Personalization)
    - [API Documentation](https://docs.supermemory.ai)
    - [TypeScript Service](./src/services/supermemory/README.md)
    - Used for persistent user preferences, learning patterns, and contextual memory
- \*\*Deployment`:
  - Expo Go (Development/Testing)
  - EAS Build (Production)
  - Google Cloud Run (Backend Services)

### Core Features

1. **Real-Time Plant Identification** - Camera-based AI with bounding box overlays
2. **Advanced AI Plant Doctor** - Disease/pest detection with treatment recommendations and historical context
3. **Personalized Care Assistant** - AI-driven care schedules that learn from user patterns
4. **AR Plant Visualization** - Show growth stages and care zones
5. **Community Discovery** - Location-based findings and social features
6. **Offline Mode** - Cached identifications and core functionality
7. **Premium AI Features** - Growth prediction, expert consultation, advanced analytics with memory-powered insights
8. **Persistent Plant Memory** - Cross-session AI learning and personalized plant care companion

## 🔄 Supermemory API Integration

### Status: ✅ Successfully Integrated

We've integrated the Supermemory API for persistent AI memory and context management. The service is available at `src/services/supermemory/`.

### Configuration

1. Add your API key to `.env`:

   ```
   NEXT_PUBLIC_SUPERMEMORY_API_KEY=your_api_key_here
   ```

2. The service uses `https://api.supermemory.ai/v3` by default. To override:
   ```
   NEXT_PUBLIC_SUPERMEMORY_API_URL=your_custom_url
   ```

### Usage

```typescript
import { supermemoryService } from './services/supermemory';

// Create a memory
const memory = await supermemoryService.createMemory({
  content: 'User prefers low-maintenance plants',
  userId: 'user-123',
  metadata: {
    preferenceType: 'plant-care',
    importance: 'high',
  },
});

// Search memories
const results = await supermemoryService.searchMemories({
  query: 'plant preferences',
  userId: 'user-123',
  limit: 5,
});
```

### Best Practices

1. **User Context**: Always include `userId` in memory operations
2. **Metadata**: Use metadata for filtering and additional context
3. **Error Handling**: Implement proper error handling in components
4. **Rate Limiting**: Be mindful of API rate limits
5. **Testing**: Run tests with `npm test src/services/supermemory/__tests__/`

### Example Response

```json
{
  "id": "jsaDBLo3UDeriKTcZzAjNX",
  "status": "queued"
}
```

## 🧠 AI Integration Strategy

### Hybrid AI Architecture

FlorAI-Mobile leverages a hybrid AI approach combining multiple services for optimal performance and accuracy:

1. **Google Cloud Vision AI**
   - First-line plant identification
   - High-accuracy pre-trained models
   - Image analysis and feature extraction

2. **Vertex AI Custom Models**
   - Fine-tuned for specific plant diseases
   - Custom model training pipeline
   - A/B testing of model versions

3. **Supermemory.ai** (✅ Integrated)
   - User-specific plant memory
   - Cross-session learning and context persistence
   - Personalized care recommendations
   - Successfully tested with memory creation and retrieval
   - MCP endpoint: `https://mcp.supermemory.ai/guyugQ3xRxBWjmW7izcQx/sse`

4. **Supabase Realtime**
   - Real-time data synchronization
   - User authentication
   - Community feature backend

### Google Cloud Integration

```typescript
// Example Google Cloud Vision API integration
export async function identifyPlant(imageUri: string) {
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'path-to-service-account.json',
  });

  const [result] = await client.labelDetection({
    image: { source: { imageUri } },
  });

  return result.labelAnnotations;
}
```

### Implementation Roadmap

1. **Phase 1 (Weeks 1-2)**
   - Set up Google Cloud project & billing
   - Configure Vision API and initial model
   - Implement basic plant identification

2. **Phase 2 (Weeks 3-4)**
   - Train custom models on Vertex AI
   - Implement model versioning
   - Set up performance monitoring

3. **Phase 3 (Weeks 5-6)**
   - Integrate Supermemory.ai for personalization
   - Implement real-time updates via Supabase
   - Optimize model performance

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/FlorAI-Mobile.git
   cd FlorAI-Mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your specific configuration.

### Google Cloud Setup

1. **Run the setup script**

   ```bash
   chmod +x ./scripts/setup-gcp.sh
   ./scripts/setup-gcp.sh
   ```

2. **Authenticate with Google Cloud**

   ```bash
   gcloud auth application-default login
   ```

3. **Enable required APIs** (if not done by the script)
   ```bash
   gcloud services enable \
       vision.googleapis.com \
       aiplatform.googleapis.com \
       cloudfunctions.googleapis.com \
       run.googleapis.com \
       storage-component.googleapis.com \
       --project=forward-robot-456807-g6
   ```

### Supabase Setup

1. **Run the setup script**

   ```bash
   chmod +x ./scripts/setup-supabase.sh
   ./scripts/setup-supabase.sh
   ```

2. **Create a new Supabase project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create a new project
   - Update the `.env` file with your Supabase URL and API keys

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📊 Resource Allocation

### Google Cloud Budget ($2,000)

| Service       | Allocation | Purpose               |
| ------------- | ---------- | --------------------- |
| Vision AI     | $300       | Plant identification  |
| Vertex AI     | $700       | Custom model training |
| Cloud Run     | $200       | Serverless backend    |
| Cloud Storage | $100       | Model/asset storage   |
| Maps Platform | $100       | Location features     |
| Monitoring    | $100       | Performance tracking  |
| Buffer        | $500       | Contingency           |

## 🤖 AI Agent Instructions & Role Assignments

### Available Windsurf AI Models

#### SWE-1 (Premium - Complex Development)

**Role**: Lead Development Agent
**Capabilities**: Complex multi-file generation, advanced AI integration, performance optimization
**Assigned Tasks**:

- Camera system with real-time AI inference
- Advanced AI features (disease detection, AR visualization)
- Supermemory.ai integration for persistent AI context
- Performance optimization and complex debugging
- Multi-modal AI integration

#### Cascade Web Search Agent

**Role**: Research & Documentation Agent
**Capabilities**: Real-time web research, documentation analysis
**Assigned Tasks**:

- Competitive analysis and market research
- API documentation research (including Supermemory.ai integration)
- Best practices and implementation guides
- External library and framework research

## 📋 Development Phases & Task Distribution

### Phase 1: Foundation & Research (Weeks 1-2)

- **Competitive Analysis**: Web Search Agent
- **Technical Architecture**: SWE-1 + Chat Mode
- **AI Model Selection**: SWE-1 + Web Search Agent
- **Supermemory.ai Integration Planning**: SWE-1 + Product Manager

### Phase 2: Project Setup (Weeks 3-4)

- **Expo Project Scaffolding**: SWE-1-lite + Write Mode
- **Supabase Backend**: SWE-1-lite
- **Development Environment**: SWE-1-mini
- **Supermemory.ai API Setup**: SWE-1-lite

### Phase 3: Core AI Features (Weeks 5-8)

- **Camera + AI Integration**: SWE-1 + Write Mode
- **Supermemory.ai Memory Layer Integration**: SWE-1 + Write Mode
- **Advanced AI Features**: SWE-1 + Claude 3.7 Sonnet
- **Plant Information System**: SWE-1-lite + Web Search Agent

## 🎯 AI Agent Best Practices

### General Guidelines for All AI Agents

#### Code Quality Standards

```typescript
// Always use TypeScript with strict typing
interface PlantIdentification {
  species: string;
  confidence: number;
  scientificName: string;
  commonNames: string[];
  careInstructions?: CareInstructions;
  memoryContext?: PlantMemoryContext; // Supermemory integration
}

// Supermemory integration example
interface PlantMemoryContext {
  previousIdentifications: PlantIdentification[];
  careHistory: CareAction[];
  healthPatterns: HealthPattern[];
  userPreferences: UserPreferences;
}

// Follow consistent naming conventions
const identifyPlantFromImage = async (imageUri: string): Promise<PlantIdentification> => {
  // Implementation with memory context
};
```

#### Performance Priorities

1. **Camera Performance**: Prioritize smooth real-time processing
2. **AI Inference Speed**: Optimize for minimal latency
3. **Memory Integration**: Efficient Supermemory.ai API calls with caching
4. **Memory Management**: Efficient image processing and caching
5. **Battery Optimization**: Minimize background processing

### Specific Agent Instructions

#### For SWE-1 (Complex Development)

- **Context Awareness**: Always consider the full codebase when making changes
- **Performance First**: Optimize for real-time camera and AI processing
- **Memory Integration**: Implement Supermemory.ai for persistent AI context and learning
- **Error Handling**: Implement comprehensive error boundaries and fallbacks
- **Testing**: Include unit tests for complex AI integration logic

## 🔧 Development Workflow

### AI Memory Configuration

```markdown
# Set these as AI Rules in Windsurf:

1. Always prioritize camera performance and AI inference speed
2. Use TypeScript strict mode for all code
3. Follow React Native Paper design patterns
4. Implement proper error handling for AI operations
5. Consider offline functionality in all features
6. Optimize for cross-platform compatibility (iOS/Android)
7. Integrate Supermemory.ai for persistent AI context and personalization
8. Ensure user privacy and data security for memory storage
```

## 📊 Success Metrics & KPIs

### Technical Metrics

- **AI Accuracy**: >85% plant identification accuracy
- **Performance**: <2s average identification time
- **Memory Integration**: <400ms Supermemory.ai API response time
- **Crash Rate**: <1% across all devices
- **Battery Impact**: <5% additional drain during active use

### Business Metrics

- **User Engagement**: >70% weekly active users
- **Premium Conversion**: >15% free-to-paid conversion (enhanced by memory-powered features)
- **Community Growth**: >50% users sharing findings monthly
- **Retention**: >60% 30-day retention rate (improved by personalized AI experience)
- **Memory Utilization**: >80% of users benefiting from personalized AI recommendations

## 🔗 Reference Documents

### Living Documentation

- **plan.md**: Current project roadmap and task assignments (auto-updated)
- **context.md**: Original project context and requirements
- **SUPERMEMORY_INTEGRATION.md**: Detailed Supermemory.ai integration plan and technical specifications
- **This README.md**: Central coordination document

---

**Last Updated**: June 23, 2025
**Project Status**: Phase 1 - Foundation & Research
**Next Milestone**: Complete competitive analysis, technical architecture planning, and Supermemory.ai integration setup
