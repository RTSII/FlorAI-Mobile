# FlorAI-Mobile: Project Plan

## Notes

- App goal: Real-time plant species identification using device camera and AI, with user profiles, community sharing, and offline mode.
- Tech stack: Expo (React Native), TypeScript, Expo Router, React Native Paper, Supabase (auth/storage/real-time), TensorFlow Lite or custom API for AI.
- Prioritize smooth camera performance and minimal AI detection latency.
- Competitive landscape: PlantNet is fast, accurate, and free but light on plant care info and premium features; PictureThis offers care guides, disease diagnosis, and expert consultation but can be aggressive with paid upsells; iNaturalist/Seek focus on community science and broad organism ID, but less on premium or AI-driven features.
- Key weaknesses in competitors: limited actionable plant care, lack of advanced AI features (e.g., disease detection, AR overlays), aggressive or confusing paywalls, and basic user engagement.
- Opportunities: Leverage advanced AI (disease/pest detection, AR visualization, personalized care), transparent and valuable premium experience (no paywall confusion), richer plant info, multilingual support, and innovative community/social features.
- Expo Go for dev/testing, EAS for production.
- Areas for enhancement: AI model selection/integration, offline capabilities, camera optimization, user privacy for location, community moderation, scalability, advanced AI-driven features, premium/paid experience differentiation, and unique value propositions.
- Add README.md deliverable: Should summarize context.md/app goals, include agent/model instructions, best practices for AI/human collaboration, and reference plan.md as a living roadmap. Recommend a clear structure: (1) Project Overview, (2) Phase/Task Outline, (3) Agentic/Model Instructions, (4) Best Practices, (5) Reference to plan.md for updates. Use directory and naming: FlorAI-Mobile/README.md and FlorAI-Mobile throughout documentation.

## Phase-Based Delegation & Assignment Outline (Windsurf AI + Human Roles)

### Phase 1: Requirements & Competitive Benchmarking

- [ ] Review and finalize feature requirements with stakeholders
  - **Assigned to:** Product Manager (Human), Cascade Chat (requirements summarization)
- [ ] Benchmark top competitors and document their features/weaknesses
  - **Assigned to:** Cascade Web Search Agent

### Phase 2: AI Model Selection & Core Setup

- [ ] Select and integrate AI model for plant identification
  - **Assigned to:** SWE-1 (AI model research, integration prototyping), Product Manager
- [ ] Set up Expo project with TypeScript and configure Expo Router
  - **Assigned to:** SWE-1-lite (project scaffolding)
- [ ] Implement authentication (Supabase: email/password, social, guest mode)
  - **Assigned to:** SWE-1-lite, Developer

### Phase 3: Core App Features

- [ ] Build camera interface with real-time AI inference (bounding box overlay)
  - **Assigned to:** SWE-1, Cascade Write Mode
- [ ] Design and implement plant info card with external links
  - **Assigned to:** SWE-1-lite, UI Designer
- [ ] Integrate geolocation tagging with user privacy toggle
  - **Assigned to:** SWE-1-lite, Developer
- [ ] Develop profile and findings gallery (Supabase storage)
  - **Assigned to:** SWE-1-lite, Developer
- [ ] Create community discover features (map view, search/filter, real-time updates)
  - **Assigned to:** SWE-1, SWE-1-lite, Developer
- [ ] Implement offline mode (caching identifications/data)
  - **Assigned to:** SWE-1-lite, Developer
- [ ] Optimize camera for performance, low-light, and older devices
  - **Assigned to:** SWE-1, Cascade Chat (optimization suggestions)
- [ ] Add sharing/export functionality for findings
  - **Assigned to:** SWE-1-lite, Developer
- [ ] UI/UX polish using React Native Paper
  - **Assigned to:** UI Designer, SWE-1-lite

### Phase 4: Premium, AI-Driven & Community Features

- [ ] Ideate and validate unique, AI-driven and premium features
  - **Assigned to:** Product Manager, SWE-1 (AI ideation)
- [ ] Design transparent and valuable paid experience
  - **Assigned to:** Product Manager, SWE-1-lite
- [ ] Plan for post-launch: analytics, feedback, moderation tools
  - **Assigned to:** Product Manager, SWE-1-lite

### Phase 5: Testing, Deployment & QA

- [ ] Testing (Expo Go, device, edge cases)
  - **Assigned to:** QA Engineer, SWE-1-lite (test script generation)
- [ ] Prepare EAS build and deployment pipeline
  - **Assigned to:** SWE-1-lite, DevOps

## Task List

- [ ] Review and finalize feature requirements with stakeholders
- [ ] Select and integrate AI model for plant identification
- [ ] Set up Expo project with TypeScript and configure Expo Router
- [ ] Implement authentication (Supabase: email/password, social, guest mode)
- [ ] Build camera interface with real-time AI inference (bounding box overlay)
- [ ] Design and implement plant info card with external links
- [ ] Integrate geolocation tagging with user privacy toggle
- [ ] Develop profile and findings gallery (Supabase storage)
- [ ] Create community discover features (map view, search/filter, real-time updates)
- [ ] Implement offline mode (caching identifications/data)
- [ ] Optimize camera for performance, low-light, and older devices
- [ ] Add sharing/export functionality for findings
- [ ] UI/UX polish using React Native Paper
- [ ] Testing (Expo Go, device, edge cases)
- [ ] Prepare EAS build and deployment pipeline
- [ ] Benchmark top competitors and document their features/weaknesses
- [ ] Ideate and validate unique, AI-driven and premium features
- [ ] Design transparent and valuable paid experience
- [ ] Plan for post-launch: analytics, feedback, moderation tools

## Current Goal

Assign and initiate Phase 1: Requirements & Benchmarking
