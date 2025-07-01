import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  // Auth Stack
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;

  // Main Tabs
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  // Shared Screens
  PlantDetails: { plantId: string };
  IdentificationResult: { resultId: string };
  ArticleDetails: { articleId: string };
  Profile: { userId: string };
  Settings: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Search: { initialQuery?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Identify: undefined;
  Collection: undefined;
  Care: undefined;
  Discover: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  // Add any home stack specific screens here
};

export type IdentifyStackParamList = {
  Identify: undefined;
  Camera: undefined;
  Gallery: undefined;
  // Add any identify stack specific screens here
};

export type CollectionStackParamList = {
  Collection: undefined;
  AddPlant: undefined;
  PlantDetails: { plantId: string };
  EditPlant: { plantId: string };
  // Add any collection stack specific screens here
};

export type CareStackParamList = {
  Care: undefined;
  TaskDetails: { taskId: string };
  AddTask: { plantId?: string };
  // Add any care stack specific screens here
};

export type DiscoverStackParamList = {
  Discover: undefined;
  ArticleDetails: { articleId: string };
  ChallengeDetails: { challengeId: string };
  // Add any discover stack specific screens here
};

// Helper types for navigation props
export type RootNavigationProp =
  import('@react-navigation/native').NavigationProp<RootStackParamList>;
export type MainTabNavigationProp =
  import('@react-navigation/native').NavigationProp<MainTabParamList>;

// Route props for screen components
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootNavigationProp;
  route: import('@react-navigation/native').RouteProp<RootStackParamList, T>;
};

// Tab screen props
export type TabScreenProps<T extends keyof MainTabParamList> = {
  navigation: MainTabNavigationProp;
  route: import('@react-navigation/native').RouteProp<MainTabParamList, T>;
};

// Stack navigator props
export type StackScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootNavigationProp;
  route: import('@react-navigation/native').RouteProp<RootStackParamList, T>;
};
