import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, UserPlant, ThemeType } from '../types/state.ts';

// Initial state
const initialState: AppState = {
  theme: 'system',
  userPlants: [],
  identifiedPlants: [],
  isLoading: false,
  error: null,
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_USER_PLANTS':
      return {
        ...state,
        userPlants: action.payload,
      };
    case 'SET_IDENTIFIED_PLANTS':
      return {
        ...state,
        identifiedPlants: action.payload,
      };
    case 'ADD_USER_PLANT':
      return {
        ...state,
        userPlants: [...state.userPlants, action.payload],
      };
    case 'REMOVE_USER_PLANT':
      return {
        ...state,
        userPlants: state.userPlants.filter((plant: UserPlant) => plant.id !== action.payload),
      };
    case 'UPDATE_USER_PLANT':
      return {
        ...state,
        userPlants: state.userPlants.map((plant: UserPlant) =>
          plant.id === action.payload.id ? action.payload : plant
        ),
      };
    case 'ADD_IDENTIFIED_PLANT':
      return {
        ...state,
        identifiedPlants: [action.payload, ...state.identifiedPlants.slice(0, 9)], // Keep only 10 most recent
      };
    case 'CLEAR_IDENTIFIED_PLANTS':
      return {
        ...state,
        identifiedPlants: [],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
