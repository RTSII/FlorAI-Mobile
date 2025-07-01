// Plant related types
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  family?: string;
  description?: string;
  careLevel?: 'easy' | 'moderate' | 'difficult';
  lightRequirements?: string[];
  waterNeeds?: string;
  humidityPreferences?: string;
  temperatureRange?: {
    min: number;
    max: number;
    unit: 'celsius' | 'fahrenheit';
  };
  toxicity?: {
    toPets: boolean;
    toHumans: boolean;
    details?: string;
  };
  images?: string[];
  lastWatered?: Date;
  nextWatering?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// User related types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  plants?: string[]; // Array of plant IDs
  createdAt: Date;
  updatedAt: Date;
}

// Identification result types
export interface IdentificationResult {
  id: string;
  plantId: string;
  userId: string;
  imageUri: string;
  confidence: number;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  metadata?: {
    modelVersion: string;
    processingTime: number;
  };
}

// Care task types
export type TaskType = 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CareTask {
  id: string;
  plantId: string;
  userId: string;
  type: TaskType;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  priority: TaskPriority;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Community and discovery types
export interface DiscoveryItem {
  id: string;
  type: 'article' | 'guide' | 'plant' | 'challenge' | 'community';
  title: string;
  description?: string;
  image: string;
  category: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Identify: undefined;
  Collection: undefined;
  Care: undefined;
  Discover: undefined;
  PlantDetails: { plantId: string };
  IdentificationResult: { resultId: string };
  TaskDetails: { taskId: string };
  ArticleDetails: { articleId: string };
  Profile: { userId: string };
  Settings: undefined;
};

// Theme types
export interface AppTheme {
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    tertiary: string;
    tertiaryContainer: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    error: string;
    errorContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    onTertiary: string;
    onTertiaryContainer: string;
    onBackground: string;
    onSurface: string;
    onSurfaceVariant: string;
    onError: string;
    onErrorContainer: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    elevation: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
    };
    surfaceDisabled: string;
    onSurfaceDisabled: string;
    backdrop: string;
  };
  dark: boolean;
  roundness: number;
  animation: {
    scale: number;
  };
}

// Form types
export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  validate?: (value: T) => string | undefined;
}

export interface FormState {
  [key: string]: FormField<any>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
