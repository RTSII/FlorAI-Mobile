import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSubscription } from '../contexts/SubscriptionContext';

interface PremiumFeatureConfig {
  featureName: string;
  featureDescription: string;
  featureIcon: any; // React Native image source
  benefitsList: string[];
}

/**
 * Hook to manage premium feature prompts
 * @param featureKey Unique identifier for the feature
 * @param config Premium feature configuration
 * @returns Object with modal state and controls
 */
export const usePremiumFeaturePrompt = (
  featureKey: string,
  config: PremiumFeatureConfig
) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState<boolean>(false);
  const { isPremium, isFeatureAvailable } = useSubscription();

  // Check if the modal has been dismissed before
  useEffect(() => {
    const checkModalDismissed = async () => {
      try {
        const storageKey = `premium_modal_${featureKey.replace(/\s+/g, '_').toLowerCase()}_dismissed`;
        const dismissed = await AsyncStorage.getItem(storageKey);
        setHasCheckedStorage(true);
        
        // If user is premium or has dismissed this modal before, don't show it
        if (isPremium || dismissed === 'true') {
          return;
        }
      } catch (error) {
        console.error('Error checking modal dismissed status:', error);
        setHasCheckedStorage(true);
      }
    };

    checkModalDismissed();
  }, [featureKey, isPremium]);

  /**
   * Check if a feature is available and show premium modal if needed
   * @returns Promise<boolean> True if feature is available
   */
  const checkFeatureAccess = async (): Promise<boolean> => {
    // If we haven't checked storage yet, wait a bit
    if (!hasCheckedStorage) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Check if the feature requires premium and if user has premium
    const available = await isFeatureAvailable(true);
    
    // If feature is not available and modal hasn't been dismissed, show it
    if (!available) {
      setShowModal(true);
    }
    
    return available;
  };

  /**
   * Close the premium feature modal
   */
  const closeModal = () => {
    setShowModal(false);
  };

  /**
   * Mark the modal as permanently dismissed
   */
  const dismissPermanently = async () => {
    try {
      const storageKey = `premium_modal_${featureKey.replace(/\s+/g, '_').toLowerCase()}_dismissed`;
      await AsyncStorage.setItem(storageKey, 'true');
    } catch (error) {
      console.error('Error saving modal dismissed status:', error);
    }
    closeModal();
  };

  /**
   * Reset the dismissed status (for testing)
   */
  const resetDismissedStatus = async () => {
    try {
      const storageKey = `premium_modal_${featureKey.replace(/\s+/g, '_').toLowerCase()}_dismissed`;
      await AsyncStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error resetting modal dismissed status:', error);
    }
  };

  return {
    showModal,
    closeModal,
    dismissPermanently,
    resetDismissedStatus,
    checkFeatureAccess,
    featureConfig: config,
  };
};

export default usePremiumFeaturePrompt;
