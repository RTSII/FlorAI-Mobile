import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'leaf';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Identify') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Collection') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Care') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
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
      <Tab.Screen name="Care" component={CareStackScreen} options={{ title: 'Care' }} />
      <Tab.Screen name="Discover" component={DiscoverStackScreen} options={{ title: 'Discover' }} />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        {/* Add auth screens and modal screens here */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
