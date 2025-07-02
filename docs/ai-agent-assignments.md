# FlorAI-Mobile AI Agent Assignments

**Version:** 1.0.0  
**Last Updated:** July 1, 2025  
**Status:** Active  
**Repository:** [https://github.com/RTSII/FlorAI-Mobile](https://github.com/RTSII/FlorAI-Mobile)

## Purpose

This document outlines the AI agent assignments for specific development tasks in the FlorAI-Mobile project. It provides clear guidance on which AI models and agents should be used for different types of tasks to maximize efficiency and quality.

## Table of Contents

1. [Available AI Models](#available-ai-models)
2. [Task-Specific Agent Assignments](#task-specific-agent-assignments)
3. [Development Phase Assignments](#development-phase-assignments)
4. [Agent Switching Triggers](#agent-switching-triggers)
5. [Best Practices for AI Assistance](#best-practices-for-ai-assistance)

## Available AI Models

### SWE-1 (Premium - Complex Development)

**Role**: Lead Development Agent  
**Capabilities**: Complex multi-file generation, advanced AI integration, performance optimization  
**Best For**: 
- Multi-file code generation
- Complex system architecture
- Performance-critical components
- Advanced AI feature implementation

### Cascade Web Search Agent

**Role**: Research & Documentation Agent  
**Capabilities**: Real-time web research, documentation analysis  
**Best For**:
- API documentation research
- Best practices investigation
- Competitive analysis
- Technical standards research

## Task-Specific Agent Assignments

| Task Category | Recommended Agent | Rationale |
|---------------|-------------------|-----------|
| **Camera & Image Processing** | SWE-1 | Requires complex integration with device hardware and optimization for real-time processing |
| **AI Model Integration** | SWE-1 | Involves sophisticated API interactions and data processing pipelines |
| **UI Component Development** | SWE-1-lite | Focused on single-file components with clear requirements |
| **Navigation & Routing** | SWE-1-lite | Requires understanding of app structure but limited complexity |
| **State Management** | SWE-1 | Involves cross-cutting concerns and complex data flow |
| **API Integration** | SWE-1 | Requires error handling, data transformation, and security considerations |
| **Testing & QA** | SWE-1-lite + Web Search | Combines code generation with research on best testing practices |
| **Documentation** | Web Search Agent | Focuses on clarity, standards compliance, and comprehensive coverage |
| **Performance Optimization** | SWE-1 | Requires deep technical understanding and cross-cutting changes |
| **Security Implementation** | SWE-1 + Web Search | Combines code implementation with up-to-date security practices |

## Development Phase Assignments

### Phase 1: Foundation & Research (Weeks 1-2)

- **Competitive Analysis**: Web Search Agent ✓
- **Technical Architecture**: SWE-1 + Chat Mode ✓
- **AI Model Selection**: SWE-1 + Web Search Agent ✓
- **Supermemory.ai Integration Planning**: SWE-1 + Product Manager ✓

### Phase 2: Project Setup (Weeks 3-4)

- **Expo Project Scaffolding**: SWE-1-lite + Write Mode ✓
- **Supabase Backend**: SWE-1-lite ✓
- **Development Environment**: SWE-1-mini ✓
- **Supermemory.ai API Setup**: SWE-1-lite ✓

### Phase 3: Core AI Features (Weeks 5-8)

- **Camera + AI Integration**: SWE-1 + Write Mode
- **Supermemory.ai Memory Layer Integration**: SWE-1 + Write Mode
- **Advanced AI Features**: SWE-1 + Claude 3.7 Sonnet
- **Plant Information System**: SWE-1-lite + Web Search Agent

### Phase 4: Enhanced Features & User Experience (Weeks 9-14)

- **State Management Implementation**: SWE-1
- **Offline Capability**: SWE-1
- **Image Optimization and Caching**: SWE-1
- **Enhanced Plant Identification**: SWE-1 + Web Search Agent
- **UI/UX Refinements**: SWE-1-lite
- **User Accounts & Cloud Sync**: SWE-1 + Web Search Agent

### Phase 5: Premium Features & Monetization (Weeks 15-22)

- **Subscription Management**: SWE-1 + Web Search Agent
- **Payment Processing**: SWE-1 + Web Search Agent
- **AI Plant Doctor**: SWE-1 + Claude 3.7 Sonnet
- **Advanced Care Recommendations**: SWE-1 + Claude 3.7 Sonnet
- **App Store Optimization**: Web Search Agent

### Phase 6: Community & Advanced AI (Weeks 23-32)

- **User Profiles & Social**: SWE-1
- **AR Visualization**: SWE-1 + Claude 3.7 Sonnet
- **Growth Prediction**: SWE-1 + Claude 3.7 Sonnet
- **Voice Interface**: SWE-1 + Claude 3.7 Sonnet

## Agent Switching Triggers

To ensure the appropriate AI agent is used for each task, the following triggers should be used to switch between agents:

### SWE-1 Triggers

- Task involves multiple files or complex architecture
- Performance-critical component implementation
- Advanced AI feature development
- Complex state management or data flow
- Security-sensitive implementations

### Web Search Agent Triggers

- Research on best practices or standards
- API documentation analysis
- Competitive feature analysis
- Security practice updates
- Testing methodology research

### Combined Agent Triggers

- Complex implementation requiring up-to-date external information
- Advanced AI features needing both implementation and research
- Security features requiring both code and best practices

## Best Practices for AI Assistance

1. **Clear Context**: Provide clear, specific prompts with relevant file paths and context
2. **Desired Output Format**: Specify the expected format for AI-generated content
3. **Code Review**: Always review AI-generated code before committing
4. **Document AI Assistance**: Note any significant AI contributions in commit messages
5. **Iterative Refinement**: Use AI agents iteratively to improve code quality
6. **Security Verification**: Double-check security-related code generated by AI

## Implementation

To automatically trigger the appropriate AI agent, add the following comment at the beginning of your prompt:

```
// AI-Agent: [agent-name]
// Task-Type: [task-category]
// Files: [comma-separated-list-of-files]
```

Example:

```
// AI-Agent: SWE-1
// Task-Type: Camera Integration
// Files: src/components/Camera.tsx, src/hooks/useCamera.ts
```

This will help the system automatically select the appropriate AI agent for the task at hand.
