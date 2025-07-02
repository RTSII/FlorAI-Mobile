/**
 * Contexts Index
 * 
 * Centralizes all context exports for easier imports throughout the application.
 * This follows the UI/UX guidelines for consolidating context management.
 */

// Auth Context
export { default as AuthContext } from './AuthContext';
export { AuthProvider, useAuth } from './AuthContext';

// User Preferences Context
export { UserPreferencesProvider, useUserPreferences, useDataConsent, useAdvancedFeaturesConsent } from './UserPreferencesContext';

// Subscription Context
export { default as SubscriptionContext } from './SubscriptionContext';
export { SubscriptionProvider, useSubscription } from './SubscriptionContext';

// User Consent Context
export { UserConsentProvider, useUserConsent } from './UserConsentContext';

/**
 * Combined Provider Component
 * 
 * Wraps all context providers in a single component for easier usage in App.tsx
 */
import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UserPreferencesProvider } from './UserPreferencesContext';
import { SubscriptionProvider } from './SubscriptionContext';
import { UserConsentProvider } from './UserConsentContext';

interface ProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <SubscriptionProvider>
          <UserConsentProvider>
            {children}
          </UserConsentProvider>
        </SubscriptionProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  );
};
