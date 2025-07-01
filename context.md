### **Project Overview**

A mobile app that identifies plant species in real-time using the device's camera and AI. Users can view detailed plant info, save findings to their profile, and discover others' findings by location or species. Built with Expo for cross-platform compatibility (iOS/Android/iPad).

### **Tech Stack**

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Library**: React Native Paper
- **Backend/Auth**: Supabase (authentication, data storage, real-time features)
- **Deployment**: Expo Go

### **Expo Setup**

- Initialize Expo project with TypeScript template.
- Configure Supabase for auth and data storage.
- Set up Expo Router for file-based navigation.

### **Authentication Flow**

- Email/password or social auth (Google/Apple) via Supabase.
- Protected routes for profile/post features.
- Guest mode for basic plant scanning.

### **Feature List**

#### **Real-Time Plant Identification**

- Uses device camera with AI model (TensorFlow Lite or custom API) to identify plants in real-time.
- Displays bounding box/name overlay during detection.

#### **Expandable Plant Info Card**

- Tap detected plant to view details (scientific name, care tips, etc.).
- Links to external resources (e.g., Wikipedia).

#### **Location Tagging (Optional)**

- Geolocation API to tag findings with coordinates.
- User toggle to enable/disable tracking.

#### **Profile & Findings Gallery**

- Save screenshots of identified plants to user profile.
- Supabase storage for images/metadata.

#### **Discover Community Findings**

- Browse posts by region (map view) or species (search/filter).
- Real-time updates via Supabase.

#### **Offline Mode**

- Cache recent identifications/data for limited offline use.

#### **Camera Optimization**

- Expo Camera module with pinch-to-zoom and focus controls.
- Low-light/performance handling for older devices.

#### **Shareable Findings**

- Export plant info or screenshots to social media/files.

### **Notes**

- Prioritize smooth camera performance and minimal latency in AI detection.
- Use React Native Paper for consistent Material Design UI.
- Expo Go for testing; EAS for production builds.

Keep descriptions actionable and aligned with Expo’s capabilities.
