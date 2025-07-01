# FlorAI-Mobile Proprietary Plant Identification Model Roadmap

**Version:** 2.0.0  
**Last Updated:** July 1, 2025  
**Status:** Active Development

## Purpose

This document outlines the strategic plan for developing FlorAI-Mobile's proprietary plant identification model and API. It serves as a technical roadmap for the ML team and provides transparency on our AI development strategy.

## Table of Contents

1. [Overview](#overview)
2. [Current Progress](#current-progress-july-2025)
3. [Phase 1: Data Collection](#phase-1-data-collection-months-1-3)
4. [Phase 2: Data Processing](#phase-2-data-processing-months-3-5)
5. [Phase 3: Model Development](#phase-3-model-development-months-5-8)
6. [Phase 4: API Development & Deployment](#phase-4-api-development--deployment-months-8-10)
7. [Phase 5: On-Device Model](#phase-5-on-device-model-months-10-12)
8. [Step-by-Step Guide](#step-by-step-guide-creating-our-own-plant-identification-api)
9. [See Also](#see-also)

## Overview

This document outlines the strategic plan for developing FlorAI-Mobile's proprietary plant identification model and API. While we're currently using Plant.id API for immediate functionality, our proprietary model development is actively progressing according to this roadmap. Building our own model provides significant competitive advantages:

1. **Cost reduction** - Eliminating third-party API fees as usage scales
2. **Unique features** - Developing specialized capabilities tailored to our user base
3. **Data ownership** - Creating a valuable proprietary dataset and AI asset
4. **Offline capabilities** - Enabling on-device identification for premium users
5. **Advanced diagnostics** - Pre-symptomatic disease detection using multispectral analysis

## Current Progress (July 2025)

- ✅ Data collection infrastructure established
- ✅ Consent & privacy framework implemented
- ✅ Backend routes for data contribution created
- ✅ Initial dataset aggregation begun
- ✅ Data processing pipeline implemented
- ✅ Advanced sensor utility module created
- ✅ Weather service integrated for environmental context
- 🔄 User-contributed data collection in progress
- 🔄 Annotation & labeling system in development

## Architecture & Integration

Our proprietary model development will leverage our existing hybrid architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Native   │     │   Node.js API   │     │ Python ML/Data  │
│    Frontend     │────▶│    Backend      │────▶│   Microservice  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  Supabase &     │
                                               │ Supermemory.ai  │
                                               └─────────────────┘
```

## Phase 1: Data Collection Infrastructure (Months 1-2)

### 1.1 Data Storage & Management

- **Supabase Integration**
  - Create dedicated tables for plant images, metadata, and annotations
  - Implement secure storage buckets for raw image data
  - Set up row-level security and access controls

- **Supermemory.ai Integration**
  - Configure plant recognition context storage
  - Establish user preference and interaction tracking
  - Implement feedback loop for model improvement

### 1.2 Consent & Privacy Framework

- **Enhanced Privacy Policy**
  - Update to explicitly cover data collection for AI training
  - Detail data anonymization and protection measures
  - Specify data retention policies and user rights

- **In-App Consent Flow**
  - Design granular opt-in interface for AI training contribution
  - Implement consent management dashboard
  - Create incentive system for users who contribute data (e.g., premium features)

### 1.3 Data Collection Pipeline

- **Backend API Endpoints**
  - `/api/plants/contribute` - For explicit user contributions
  - `/api/feedback/annotation` - For user corrections to identifications
  - `/api/plants/metadata` - For collecting contextual information

- **Frontend Components**
  - Contribution screen with clear consent messaging
  - Feedback mechanism for incorrect identifications
  - Optional metadata input (location, growing conditions, etc.)

## Phase 2: Dataset Building (Months 2-4)

### 2.1 Public Dataset Aggregation

- **Sources to Integrate**
  - PlantNet-300K (1,000+ species)
  - PlantVillage Dataset (disease diagnosis)
  - Kaggle plant identification datasets
  - GBIF occurrence records with images

- **Processing Pipeline**
  - Standardize image formats and sizes
  - Remove duplicates and low-quality images
  - Normalize taxonomic classifications

### 2.2 User-Contributed Data Management

- **Data Validation**
  - Automated quality checks (blur detection, composition analysis)
  - Spam/irrelevant content filtering
  - Multi-angle capture encouragement

- **Metadata Enrichment**
  - Geographic region (if user consented)
  - Seasonal information
  - Growth stage classification
  - Plant health indicators

### 2.3 Annotation & Labeling System

- **Multi-tier Labeling Process**
  - Initial labels from Plant.id API
  - User-provided corrections
  - Expert review for high-confidence dataset
  - Consensus mechanism for disputed labels

- **Annotation Tools**
  - Admin dashboard for manual review
  - Batch processing interface
  - Quality control metrics

## Phase 3: Model Development (Months 4-8)

### 3.1 Model Architecture Selection

- **Base Models to Consider**
  - EfficientNet (B0-B7 variants)
  - Vision Transformer (ViT)
  - ConvNeXt
  - MobileNetV3 (for on-device deployment)

- **Multi-task Learning**
  - Species identification
  - Disease diagnosis
  - Growth stage classification
  - Care needs assessment

### 3.2 Training Pipeline

- **Infrastructure Setup**
  - Cloud GPU training environment (AWS/GCP)
  - Experiment tracking with MLflow or Weights & Biases
  - Version control for models and datasets

## Step-by-Step Guide: Creating Our Own Plant Identification API

This comprehensive guide outlines the detailed process for building our proprietary plant identification model and API.

### Step 1: Data Acquisition

**Open-Source Datasets Integration**

- We've begun aggregating data from these public sources:
  - PlantNet-300K: Over 300,000 images across 1,000+ species
  - PlantVillage Dataset: Focused on diseased and healthy plant leaves
  - Kaggle plant datasets: Various specialized collections
  - GBIF (Global Biodiversity Information Facility): Millions of plant occurrence records with images

**Proprietary Dataset Building**

- Our user data collection pipeline is now active with:
  - Explicit consent mechanisms in the app
  - Anonymous contribution options
  - Incentives for premium users who contribute data
  - Metadata enrichment (with user permission)

### Step 2: Data Cleaning and Labeling

**Data Processing Pipeline**

- Our implemented pipeline includes:
  - Automated quality assessment (blur detection, exposure analysis)
  - Image standardization (224x224 pixels, RGB format)
  - Duplicate removal and noise filtering
  - EXIF data extraction (when available and permitted)

**Labeling Workflow**

- Our multi-tier labeling system includes:
  - Initial labels from Plant.id API
  - User corrections and feedback
  - Expert review process for high-confidence data
  - Consensus-based verification for edge cases

### Step 3: Model Training with Transfer Learning

**Framework Selection**

- We're using PyTorch with fastai for rapid experimentation
- TensorFlow/Keras for production deployment

**Training Methodology**

- Data splitting: 70% training, 15% validation, 15% test
- Progressive unfreezing of pre-trained layers
- Learning rate finder and one-cycle policy
- Mixed precision training for efficiency
- Ensemble methods for improved accuracy

**Evaluation Metrics**

- Top-1 and Top-5 accuracy
- Confusion matrix analysis
- F1 score for imbalanced classes
- Inference speed benchmarking

### Step 4: Deployment

**API Development**

- FastAPI/Flask microservice for model serving
- Docker containerization for consistent deployment
- Cloud hosting with auto-scaling capabilities
- Monitoring and logging infrastructure

**On-Device Deployment**

- Model compression using knowledge distillation
- TensorFlow Lite conversion for mobile deployment
- Optimization for battery and performance constraints
- Offline functionality for premium users

### 3.3 Evaluation & Benchmarking

- **Metrics to Track**
  - Top-1 and Top-5 accuracy
  - Precision and recall per species
  - Confusion matrix analysis
  - Performance on rare vs. common species

- **Benchmark Against**
  - Plant.id API performance
  - Published research models
  - User satisfaction with identifications

## Phase 4: API Development & Deployment (Months 8-10)

### 4.1 API Design

- **FastAPI Microservice**
  - `/identify` - Main identification endpoint
  - `/health-assessment` - Plant health analysis
  - `/species-info` - Detailed plant information
  - `/feedback` - User correction submission

- **Performance Optimization**
  - Request batching
  - Caching strategy
  - Rate limiting and quota management

### 4.2 Containerization & Deployment

- **Docker Configuration**
  - Multi-stage build for minimal image size
  - GPU support for inference
  - Health monitoring and logging

- **Cloud Deployment**
  - Auto-scaling configuration
  - Regional deployment for latency reduction
  - Fallback to Plant.id API during outages

### 4.3 Integration with Main Application

- **Gradual Rollout Strategy**
  - A/B testing between proprietary model and Plant.id
  - Performance monitoring and comparison
  - User satisfaction tracking

- **Hybrid Approach**
  - Use proprietary model for common species
  - Fallback to Plant.id for edge cases
  - Continuous improvement based on feedback

## Phase 5: On-Device Model (Months 10-12)

### 5.1 Model Optimization

- **Model Compression**
  - Quantization (8-bit, 4-bit)
  - Pruning techniques
  - Knowledge distillation to smaller architecture

- **TensorFlow Lite Conversion**
  - Operator compatibility verification
  - Performance benchmarking on target devices
  - Memory footprint optimization

### 5.2 Mobile Integration

- **React Native Bridge**
  - Native module for TFLite integration
  - Efficient camera-to-model pipeline
  - Battery usage optimization

- **Offline Functionality**
  - Selective model downloading
  - Regional model specialization
  - Update mechanism for model improvements

### 5.3 Premium Feature Packaging

- **Offline Mode**
  - Marketing as premium feature
  - Subscription tier integration
  - Usage analytics

- **Advanced Features**
  - Batch identification
  - Custom collection analysis
  - Personal model fine-tuning

## Continuous Improvement

### Data Flywheel

- As user base grows, collect more diverse plant images
- Periodic model retraining with expanded dataset
- Specialized models for different regions/use cases

### Performance Monitoring

- Track accuracy metrics over time
- Compare with third-party APIs
- User satisfaction surveys

### Research & Development

- Stay current with latest computer vision advances
- Explore multi-modal approaches (image + text)
- Investigate few-shot learning for rare species

## Resource Requirements

### Technical Infrastructure

- **Storage**: 5-10TB initially, scaling with user growth
- **Compute**: GPU instances for training, CPU for inference
- **Bandwidth**: Depends on user growth and image sizes

### Human Resources

- Data scientist/ML engineer (1-2)
- Backend developer with ML ops experience (1)
- Botanist/plant expert for validation (part-time/consultant)

### Timeline & Milestones

| Milestone            | Timeframe  | Key Deliverables                                |
| -------------------- | ---------- | ----------------------------------------------- |
| Infrastructure Setup | Months 1-2 | Data storage, consent flow, collection pipeline |
| Initial Dataset      | Month 4    | 100K+ labeled images across 1,000+ species      |
| Model V1             | Month 8    | First proprietary model with 80%+ accuracy      |
| API Deployment       | Month 10   | Production API with monitoring                  |
| On-Device Model      | Month 12   | TFLite model for premium offline use            |

## Privacy & Ethical Considerations

### Data Privacy

- All user-contributed images will be anonymized
- Metadata stripped of personally identifiable information
- Strict access controls for raw user data

### Transparency

- Clear documentation of how user data is used
- Opt-out mechanism at any time
- Data deletion upon request

### Ethical AI

- Monitor for and address algorithmic bias
- Sustainable computing practices
- Environmental impact consideration

## Conclusion

Building a proprietary plant identification model represents a significant investment but offers substantial long-term benefits for FlorAI-Mobile. By starting the data collection process early with proper consent mechanisms, we can gradually build a valuable dataset while continuing to leverage third-party APIs for immediate functionality. This hybrid approach minimizes risk while positioning us for future independence and competitive advantage.

## See Also

- [Documentation Index](../index.md) - Central index of all project documentation
- [Project Plan](../project-plan.md) - Comprehensive project plan and roadmap
- [Project Status](../project-status.md) - Current state of the project and completed features
- [Advanced Sensors Implementation](./advanced-sensors-implementation.md) - Technical specifications for sensor integration
- [API Deployment Roadmap](./api-deployment-roadmap.md) - Strategy for API deployment and scaling
