# FlorAI-Mobile Documentation Index

**Version:** 1.0.0  
**Last Updated:** July 1, 2025  
**Status:** Active Development

## Purpose

This document serves as the central index and navigation guide for all FlorAI-Mobile documentation. It provides an overview of available documentation, their purposes, and relationships to help team members and contributors quickly find the information they need.

## Table of Contents

1. [Overview](#overview)
2. [Documentation Structure](#documentation-structure)
3. [Key Documents](#key-documents)
4. [Technical Specifications](#technical-specifications)
5. [User Documentation](#user-documentation)
6. [Development Guides](#development-guides)
7. [How to Update Documentation](#how-to-update-documentation)

## Overview

FlorAI-Mobile is an AI-powered plant identification app using Expo, React Native, TypeScript, and Supabase. The app provides advanced AI features including plant identification, disease diagnosis, and personalized care recommendations with a transparent premium experience.

This documentation is organized to serve different audiences and purposes, from high-level project planning to detailed technical specifications.

## Documentation Structure

The documentation is organized into three main categories:

- **Technical Specifications** (`/docs/specs/`): Detailed technical documentation for developers, including API specifications, data models, and architecture diagrams.
- **User Documentation** (`/docs/user-docs/`): End-user focused documentation, including user guides, feature explanations, and FAQs.
- **Development Guides** (`/docs/dev-guides/`): Guides for developers working on the project, including setup instructions, coding standards, and contribution guidelines.

## Key Documents

### Project Management

- [**Project Plan**](./project-plan.md) - Comprehensive project plan including current status, testing strategy, and manual QA checklist.
- [**Project Status**](./project-status.md) - Current project state, completed features, in-progress items, and known issues.
- [**Implementation Roadmap**](./implementation-roadmap.md) - Detailed timeline and milestones for project implementation.
- [**AI Agent Assignments**](./ai-agent-assignments.md) - Detailed guidance on which AI models and agents to use for specific development tasks.

### Technical Documentation

- [**Proprietary Model Roadmap**](./specs/proprietary-model-roadmap.md) - Strategic plan for developing FlorAI-Mobile's proprietary plant identification model and API.
- [**API Deployment Roadmap**](./specs/api-deployment-roadmap.md) - Plan for deploying and scaling the backend API services.
- [**Advanced Sensors Implementation**](./specs/advanced-sensors-implementation.md) - Technical details for implementing advanced sensor integration.

### Testing Documentation

- [**Testing Guide**](./dev-guides/TESTING_GUIDE.md) - Philosophy, patterns, and tools for testing the application.
- [**Testing Challenges**](./dev-guides/testing-challenges.md) - Current testing blockers and recommendations.
- [**Alternative Testing Strategy**](./dev-guides/alternative-testing-strategy.md) - Alternative approaches for ensuring quality without Jest.
- [**Manual QA Checklist**](./dev-guides/manual-qa-checklist.md) - Comprehensive checklist for manual quality assurance.

### User-Facing Documentation

- [**Privacy Policy**](./user-docs/privacy-policy.md) - Detailed privacy policy for user data handling.

## Technical Specifications

| Document                                                                      | Purpose                                                            | Primary Audience                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------- |
| [Proprietary Model Roadmap](./specs/proprietary-model-roadmap.md)             | Details the plan for developing our own plant identification model | ML Engineers, Backend Developers |
| [API Deployment Roadmap](./specs/api-deployment-roadmap.md)                   | Outlines the strategy for API deployment and scaling               | Backend Developers, DevOps       |
| [Advanced Sensors Implementation](./specs/advanced-sensors-implementation.md) | Technical specifications for sensor integration                    | Mobile Developers, ML Engineers  |
| [Model Training Pipeline](./specs/model-training-pipeline.md)                 | Details the pipeline for training machine learning models          | ML Engineers, Data Scientists    |

## User Documentation

| Document                                        | Purpose                                                  | Primary Audience      |
| ----------------------------------------------- | -------------------------------------------------------- | --------------------- |
| [Privacy Policy](./user-docs/privacy-policy.md) | Explains how user data is collected, used, and protected | End Users, Legal Team |

## Development Guides

| Document                                                                     | Purpose                                               | Primary Audience         |
| ---------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------ |
| [Testing Guide](./dev-guides/TESTING_GUIDE.md)                               | Provides guidance on testing philosophy and practices | Developers, QA Engineers |
| [Testing Challenges](./dev-guides/testing-challenges.md)                     | Documents current testing issues and workarounds      | Developers, QA Engineers |
| [Alternative Testing Strategy](./dev-guides/alternative-testing-strategy.md) | Outlines alternative approaches to testing            | Developers, QA Engineers |
| [Manual QA Checklist](./dev-guides/manual-qa-checklist.md)                   | Comprehensive list for manual testing                 | QA Engineers, Developers |
| [Integration Testing Plan](./dev-guides/integration-testing-plan.md)         | Plan for integration testing across the stack         | Developers, QA Engineers |

## How to Update Documentation

When updating documentation, please follow these guidelines:

1. **Version Control**: Update the version number and last updated date at the top of the document.
2. **Consistent Structure**: Maintain the document structure with proper headings and sections.
3. **Cross-References**: Ensure cross-references to other documents are accurate and up-to-date.
4. **Review Process**: Have another team member review significant documentation changes.
5. **Index Updates**: When adding new documentation, update this index file accordingly.

## Next Steps

- Migrate existing documentation to the new folder structure
- Create missing documentation for key features
- Implement automated documentation generation for API endpoints

---

_For questions about this documentation structure, please contact the project lead._
