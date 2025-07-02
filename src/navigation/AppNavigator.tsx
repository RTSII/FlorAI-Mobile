import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Type assertion for MaterialCommunityIcons
const MaterialCommunityIconsWithType = MaterialCommunityIcons as unknown as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
  style?: Record<string, unknown>;
}>;

// Import screens
import HomeScreen from '../screens/HomeScreen';
import IdentifyScreen from '../screens/IdentifyScreen';
import CollectionScreen from '../screens/CollectionScreen';
import CareScreen from '../screens/CareScreen';
import DiscoverScreen from '../screens/DiscoverScreen';

// Import types
import {
  MainTabParamList,
  RootStackParamList,
  HomeStackParamList,
  IdentifyStackParamList,
  CollectionStackParamList,
  CareStackParamList,
  DiscoverStackParamList,
} from './types';

// Define props for AppNavigator
interface AppNavigatorProps {
  theme: Theme;
}

// Create navigators
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// Create stack navigators for each tab
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const IdentifyStack = createNativeStackNavigator<IdentifyStackParamList>();
const CollectionStack = createNativeStackNavigator<CollectionStackParamList>();
const CareStack = createNativeStackNavigator<CareStackParamList>();
const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();

// Home Stack Navigator
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    {/* Add other home stack screens here */}
  </HomeStack.Navigator>
);

// Identify Stack Navigator
const IdentifyStackScreen = () => (
  <IdentifyStack.Navigator>
    <IdentifyStack.Screen
      name="Identify"
      component={IdentifyScreen}
      options={{ headerShown: false }}
    />
    {/* Add other identify stack screens here */}
  </IdentifyStack.Navigator>
);

// Collection Stack Navigator
const CollectionStackScreen = () => (
  <CollectionStack.Navigator>
    <CollectionStack.Screen
      name="Collection"
      component={CollectionScreen}
      options={{ headerShown: false }}
    />
    {/* Add other collection stack screens here */}
  </CollectionStack.Navigator>
);

// Care Stack Navigator
const CareStackScreen = () => (
  <CareStack.Navigator>
    <CareStack.Screen name="Care" component={CareScreen} options={{ headerShown: false }} />
    {/* Add other care stack screens here */}
  </CareStack.Navigator>
);

// Discover Stack Navigator
const DiscoverStackScreen = () => (
  <DiscoverStack.Navigator>
    <DiscoverStack.Screen
      name="Discover"
      component={DiscoverScreen}
      options={{ headerShown: false }}
    />
    {/* Add other discover stack screens here */}
  </DiscoverStack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName = 'leaf';

          // Match icons to UI/UX guidelines
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Identify') {
            // Changed from camera to magnify as per App.tsx for consistency
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'Collection') {
            // Changed from leaf to bookmark as per App.tsx for consistency
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Care') {
            // Changed from calendar to watering-can as per App.tsx for consistency
            iconName = focused ? 'watering-can' : 'watering-can-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          }

          return <MaterialCommunityIconsWithType name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          // Updated height to match UI/UX guidelines (80px)
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Identify" component={IdentifyStackScreen} options={{ title: 'Identify' }} />
      <Tab.Screen
        name="Collection"
        component={CollectionStackScreen}
        options={{ title: 'My Plants' }}
      />
      <Tab.Screen 
        name="Care" 
        component={CareStackScreen} 
        options={{ 
          title: 'Care',
          // Add premium indicator badge as per UI/UX guidelines
          tabBarBadge: 'PRO',
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.tertiary,
            fontSize: 10,
            fontWeight: 'bold',
          }
        }} 
      />
      <Tab.Screen name="Discover" component={DiscoverStackScreen} options={{ title: 'Discover' }} />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = ({ theme }: AppNavigatorProps) => {
  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator>
        <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        {/* Add auth screens and modal screens here */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
