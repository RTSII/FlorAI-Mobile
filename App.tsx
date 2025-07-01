import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import IdentifyScreen from './src/screens/IdentifyScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import CareScreen from './src/screens/CareScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';

// Import theme
import { colors } from './src/theme/designTokens';

// Type assertion for MaterialCommunityIcons
const MaterialCommunityIconsWithType = MaterialCommunityIcons as unknown as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
  style?: Record<string, unknown>;
}>;

// Types
type TabBarIconProps = {
  color: string;
  size: number;
};

type RootTabParamList = {
  Home: undefined;
  Identify: undefined;
  Collection: undefined;
  Care: undefined;
  Discover: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

// Tab bar icon component
interface TabBarIconComponentProps extends TabBarIconProps {
  name: string;
}

const TabBarIcon = ({ name, color, size }: TabBarIconComponentProps) => (
  <MaterialCommunityIconsWithType
    name={name}
    size={size}
    color={color}
    style={{ marginBottom: -3 }}
  />
);

// Extend the theme with our custom colors
const appTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
} as const;

// Create navigation theme with proper type safety
const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: appTheme.colors.primary,
    background: appTheme.colors.background,
    card: appTheme.colors.surface,
    text: appTheme.colors.onSurface,
    border: appTheme.colors.outlineVariant,
    notification: appTheme.colors.error,
  },
} as const;

// Create a factory function for tab bar icons
const createTabBarIcon = (name: string) => {
  const IconComponent = ({ color, size }: TabBarIconProps) => (
    <TabBarIcon name={name} color={color} size={size} />
  );
  return {
    tabBarIcon: (props: TabBarIconProps) => <IconComponent {...props} />,
  };
};

const App = (): JSX.Element => {
  // Memoize the tab bar icon renderer to prevent unnecessary re-renders
  const renderTabBarIcon = React.useCallback(createTabBarIcon, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={appTheme}>
        <StatusBar barStyle="dark-content" backgroundColor={appTheme.colors.surface} />
        <NavigationContainer theme={navigationTheme}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: appTheme.colors.primary,
              tabBarInactiveTintColor: appTheme.colors.onSurfaceVariant,
              tabBarStyle: {
                backgroundColor: appTheme.colors.surface,
                borderTopColor: appTheme.colors.outlineVariant,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
              },
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Home',
                ...renderTabBarIcon('home-outline'),
              }}
            />
            <Tab.Screen
              name="Identify"
              component={IdentifyScreen}
              options={{
                title: 'Identify',
                ...renderTabBarIcon('magnify'),
              }}
            />
            <Tab.Screen
              name="Collection"
              component={CollectionScreen}
              options={{
                title: 'Collection',
                ...renderTabBarIcon('bookmark-outline'),
              }}
            />
            <Tab.Screen
              name="Care"
              component={CareScreen}
              options={{
                title: 'Care',
                ...renderTabBarIcon('watering-can-outline'),
              }}
            />
            <Tab.Screen
              name="Discover"
              component={DiscoverScreen}
              options={{
                title: 'Discover',
                ...renderTabBarIcon('compass-outline'),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
