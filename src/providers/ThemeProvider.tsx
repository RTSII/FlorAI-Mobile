import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

// Import our custom themes
import { lightTheme, darkTheme, AppTheme } from '../theme';

// Extend the theme type to include our custom theme properties
type CombinedTheme = typeof lightTheme;

// Create a context for the theme
const ThemeContext = createContext<{
  theme: CombinedTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Custom hook to use the theme
const useAppTheme = () => useContext(ThemeContext);

// Theme provider component
const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    // Here you would typically save the user's preference to AsyncStorage or similar
  };

  // Set theme explicitly
  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    // Here you would typically save the user's preference to AsyncStorage or similar
  };

  // Update theme when system color scheme changes
  useEffect(() => {
    // Uncomment to automatically follow system theme
    // setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  // Memoize the theme object to prevent unnecessary re-renders
  const theme = useMemo<CombinedTheme>(() => (isDark ? darkTheme : lightTheme), [isDark]);

  // Combine React Navigation and React Paper themes
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const navigationTheme = isDark ? DarkTheme : LightTheme;

  // Combine the themes
  const combinedTheme = {
    ...theme,
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      ...theme.colors,
    },
  } as unknown as AppTheme;

  return (
    <ThemeContext.Provider value={{ theme: combinedTheme, isDark, toggleTheme, setTheme }}>
      <PaperProvider theme={combinedTheme}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={combinedTheme.colors.background}
        />
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export { AppThemeProvider, useAppTheme, ThemeContext };
export type { CombinedTheme as Theme };

// Helper hook to use theme with type safety
export const useTheme = (): AppTheme => {
  const { theme } = useAppTheme();
  return theme;
};
