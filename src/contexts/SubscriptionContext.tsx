import React, { createContext, useContext, useState, useEffect } from 'react';
import subscriptionService, { 
  UserSubscription, 
  SubscriptionTier, 
  SubscriptionStatus,
  SubscriptionProductId,
  SubscriptionProduct
} from '../services/subscription';

interface SubscriptionContextType {
  subscription: UserSubscription;
  products: SubscriptionProduct[];
  isLoading: boolean;
  isPremium: boolean;
  purchaseSubscription: (productId: SubscriptionProductId) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  isFeatureAvailable: (featureRequiresPremium: boolean) => Promise<boolean>;
}

const defaultSubscription: UserSubscription = {
  tier: SubscriptionTier.FREE,
  status: SubscriptionStatus.EXPIRED,
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: defaultSubscription,
  products: [],
  isLoading: true,
  isPremium: false,
  purchaseSubscription: async () => false,
  restorePurchases: async () => false,
  refreshSubscription: async () => {},
  isFeatureAvailable: async () => false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<UserSubscription>(defaultSubscription);
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const initializeSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Initialize the subscription service
      await subscriptionService.initialize();
      
      // Load available products
      const availableProducts = await subscriptionService.loadProducts();
      setProducts(availableProducts);
      
      // Get the user's current subscription
      await refreshSubscription();
    } catch (error) {
      console.error('Failed to initialize subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    try {
      const userSubscription = await subscriptionService.getUserSubscription(true);
      setSubscription(userSubscription);
      
      // Update premium status
      const premium = userSubscription.tier === SubscriptionTier.PREMIUM && 
                      userSubscription.status === SubscriptionStatus.ACTIVE;
      setIsPremium(premium);
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    }
  };

  const purchaseSubscription = async (productId: SubscriptionProductId): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await subscriptionService.purchaseSubscription(productId);
      
      if (success) {
        await refreshSubscription();
      }
      
      return success;
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await subscriptionService.restorePurchases();
      
      if (success) {
        await refreshSubscription();
      }
      
      return success;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isFeatureAvailable = async (featureRequiresPremium: boolean): Promise<boolean> => {
    return await subscriptionService.isFeatureAvailable(featureRequiresPremium);
  };

  useEffect(() => {
    initializeSubscription();
    
    return () => {
      // Clean up subscription service when component unmounts
      subscriptionService.cleanup();
    };
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        products,
        isLoading,
        isPremium,
        purchaseSubscription,
        restorePurchases,
        refreshSubscription,
        isFeatureAvailable,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
