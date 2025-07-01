import { useAppContext } from '../store/AppContext.tsx';
import { useColorScheme } from 'react-native';

/**
 * Hook to manage theme settings in the app
 * Returns the current theme and functions to change it
 */
export const useTheme = () => {
  const { state, dispatch } = useAppContext();
  const deviceTheme = useColorScheme() || 'light';
  
  // Get the effective theme based on settings
  const effectiveTheme = state.theme === 'system' ? deviceTheme : state.theme;
  
  // Function to change theme
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  return {
    theme: effectiveTheme,
    setTheme,
    themePreference: state.theme,
    isDarkMode: effectiveTheme === 'dark',
  };
};
