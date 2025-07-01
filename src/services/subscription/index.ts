/**
 * Subscription Service
 * 
 * Handles subscription management and payment processing for premium features
 */
import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApiError, ApiErrorCode } from '../../api/types';

// Subscription product IDs
export enum SubscriptionProductId {
  MONTHLY = 'florai.premium.monthly',
  ANNUAL = 'florai.premium.annual',
  LIFETIME = 'florai.premium.lifetime',
}

// Subscription tiers
export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
}

// Subscription status
export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
  PENDING = 'pending',
}

// Subscription product information
export interface SubscriptionProduct {
  id: SubscriptionProductId;
  title: string;
  description: string;
  price: string;
  priceAmount: number;
  currency: string;
  period?: string;
  introductoryPrice?: string;
  introductoryPriceAmount?: number;
  introductoryPricePeriod?: string;
}

// User subscription information
export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  productId?: SubscriptionProductId;
  expiryDate?: Date;
  autoRenew?: boolean;
  purchaseDate?: Date;
  trialEndDate?: Date;
}

// Purchase receipt information
export interface PurchaseReceipt {
  productId: SubscriptionProductId;
  transactionId: string;
  transactionDate: Date;
  receipt: string;
}

/**
 * Subscription Service class
 * Handles subscription management and payment processing
 */
export class SubscriptionService {
  private supabase: SupabaseClient;
  private products: SubscriptionProduct[] = [];
  private isConnected: boolean = false;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Initialize the subscription service
   * @returns Promise<void>
   */
  async initialize(): Promise<void> {
    try {
      // Connect to the store
      await InAppPurchases.connectAsync();
      this.isConnected = true;
      
      // Set up purchase listener
      InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results?.forEach(purchase => {
            if (!purchase.acknowledged) {
              this.processPurchase(purchase);
            }
          });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          console.log('User canceled the transaction');
        } else {
          console.error(`Purchase error: ${errorCode}`);
        }
      });
      
      // Get available products
      await this.loadProducts();
    } catch (error) {
      console.error('Failed to initialize subscription service:', error);
      throw new ApiError({
        code: ApiErrorCode.SUBSCRIPTION_ERROR,
        message: `Failed to initialize subscription service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Load available subscription products
   * @returns Promise<SubscriptionProduct[]>
   */
  async loadProducts(): Promise<SubscriptionProduct[]> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }
      
      const productIds = Object.values(SubscriptionProductId);
      const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        this.products = results.map(product => ({
          id: product.productId as SubscriptionProductId,
          title: product.title,
          description: product.description,
          price: product.price,
          priceAmount: product.priceAmountMicros / 1000000,
          currency: product.priceCurrencyCode,
          period: Platform.OS === 'ios' ? product.subscriptionPeriod : undefined,
          introductoryPrice: product.introductoryPrice,
          introductoryPriceAmount: product.introductoryPriceAmountMicros ? product.introductoryPriceAmountMicros / 1000000 : undefined,
          introductoryPricePeriod: product.introductoryPricePeriod,
        }));
        
        return this.products;
      } else {
        throw new Error(`Failed to load products: ${responseCode}`);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      throw new ApiError({
        code: ApiErrorCode.SUBSCRIPTION_ERROR,
        message: `Failed to load products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Get available subscription products
   * @returns SubscriptionProduct[]
   */
  getProducts(): SubscriptionProduct[] {
    return this.products;
  }
  
  /**
   * Purchase a subscription product
   * @param productId Subscription product ID
   * @returns Promise<boolean>
   */
  async purchaseSubscription(productId: SubscriptionProductId): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }
      
      const { responseCode, results } = await InAppPurchases.purchaseItemAsync(productId);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        // Purchase successful, but actual processing happens in the purchase listener
        return true;
      } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
        console.log('User canceled the purchase');
        return false;
      } else {
        throw new Error(`Purchase failed: ${responseCode}`);
      }
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      throw new ApiError({
        code: ApiErrorCode.SUBSCRIPTION_ERROR,
        message: `Failed to purchase subscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Process a purchase
   * @param purchase Purchase object from InAppPurchases
   * @returns Promise<void>
   */
  private async processPurchase(purchase: InAppPurchases.Purchase): Promise<void> {
    try {
      // Verify the purchase with the server
      const { data: verificationData, error: verificationError } = await this.supabase
        .functions
        .invoke('verify-purchase', {
          body: {
            productId: purchase.productId,
            transactionId: purchase.transactionId,
            transactionReceipt: purchase.transactionReceipt,
            platform: Platform.OS,
          }
        });
      
      if (verificationError) {
        throw new Error(`Purchase verification failed: ${verificationError.message}`);
      }
      
      if (!verificationData.isValid) {
        throw new Error('Invalid purchase receipt');
      }
      
      // Save the purchase to the database
      const { error: saveError } = await this.supabase
        .from('user_subscriptions')
        .upsert({
          user_id: (await this.supabase.auth.getUser()).data.user?.id,
          product_id: purchase.productId,
          transaction_id: purchase.transactionId,
          purchase_date: new Date().toISOString(),
          expiry_date: verificationData.expiryDate,
          auto_renew: verificationData.autoRenew,
          status: SubscriptionStatus.ACTIVE,
          receipt_data: purchase.transactionReceipt,
        });
      
      if (saveError) {
        throw new Error(`Failed to save subscription: ${saveError.message}`);
      }
      
      // Acknowledge the purchase
      await InAppPurchases.finishTransactionAsync(purchase, true);
      
      // Refresh the user's subscription status
      await this.getUserSubscription(true);
    } catch (error) {
      console.error('Failed to process purchase:', error);
      // Don't acknowledge the purchase if processing failed
      // It will be retried on next app launch
    }
  }
  
  /**
   * Get the user's current subscription
   * @param forceRefresh Force refresh from the server
   * @returns Promise<UserSubscription>
   */
  async getUserSubscription(forceRefresh: boolean = false): Promise<UserSubscription> {
    try {
      // Check local cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedSubscription = await this.getCachedSubscription();
        if (cachedSubscription) {
          return cachedSubscription;
        }
      }
      
      // Get the user's subscription from the server
      const { data: user } = await this.supabase.auth.getUser();
      
      if (!user.user) {
        return {
          tier: SubscriptionTier.FREE,
          status: SubscriptionStatus.EXPIRED,
        };
      }
      
      const { data, error } = await this.supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('status', SubscriptionStatus.ACTIVE)
        .order('expiry_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw new Error(`Failed to get subscription: ${error.message}`);
      }
      
      if (!data) {
        const subscription: UserSubscription = {
          tier: SubscriptionTier.FREE,
          status: SubscriptionStatus.EXPIRED,
        };
        
        await this.cacheSubscription(subscription);
        return subscription;
      }
      
      // Check if the subscription has expired
      const expiryDate = new Date(data.expiry_date);
      const now = new Date();
      
      if (expiryDate < now && data.status === SubscriptionStatus.ACTIVE) {
        // Update the subscription status in the database
        await this.supabase
          .from('user_subscriptions')
          .update({ status: SubscriptionStatus.EXPIRED })
          .eq('id', data.id);
        
        const subscription: UserSubscription = {
          tier: SubscriptionTier.FREE,
          status: SubscriptionStatus.EXPIRED,
          productId: data.product_id as SubscriptionProductId,
          expiryDate: expiryDate,
          purchaseDate: new Date(data.purchase_date),
          autoRenew: data.auto_renew,
        };
        
        await this.cacheSubscription(subscription);
        return subscription;
      }
      
      const subscription: UserSubscription = {
        tier: SubscriptionTier.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        productId: data.product_id as SubscriptionProductId,
        expiryDate: expiryDate,
        purchaseDate: new Date(data.purchase_date),
        autoRenew: data.auto_renew,
      };
      
      await this.cacheSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to get user subscription:', error);
      
      // Return free tier if there's an error
      return {
        tier: SubscriptionTier.FREE,
        status: SubscriptionStatus.EXPIRED,
      };
    }
  }
  
  /**
   * Cache the user's subscription locally
   * @param subscription User subscription
   * @returns Promise<void>
   */
  private async cacheSubscription(subscription: UserSubscription): Promise<void> {
    try {
      // Store in AsyncStorage or similar
      // Implementation depends on the storage solution used in the app
    } catch (error) {
      console.error('Failed to cache subscription:', error);
    }
  }
  
  /**
   * Get the cached subscription
   * @returns Promise<UserSubscription | null>
   */
  private async getCachedSubscription(): Promise<UserSubscription | null> {
    try {
      // Retrieve from AsyncStorage or similar
      // Implementation depends on the storage solution used in the app
      return null;
    } catch (error) {
      console.error('Failed to get cached subscription:', error);
      return null;
    }
  }
  
  /**
   * Restore purchases
   * @returns Promise<boolean>
   */
  async restorePurchases(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }
      
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        let hasValidSubscription = false;
        
        for (const purchase of results) {
          // Process each purchase
          await this.processPurchase(purchase);
          
          // Check if this is a valid subscription
          if (Object.values(SubscriptionProductId).includes(purchase.productId as SubscriptionProductId)) {
            hasValidSubscription = true;
          }
        }
        
        return hasValidSubscription;
      } else {
        throw new Error(`Failed to restore purchases: ${responseCode}`);
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw new ApiError({
        code: ApiErrorCode.SUBSCRIPTION_ERROR,
        message: `Failed to restore purchases: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Check if a feature is available based on subscription tier
   * @param featureRequiresPremium Whether the feature requires premium
   * @returns Promise<boolean>
   */
  async isFeatureAvailable(featureRequiresPremium: boolean): Promise<boolean> {
    try {
      if (!featureRequiresPremium) {
        return true;
      }
      
      const subscription = await this.getUserSubscription();
      return subscription.tier === SubscriptionTier.PREMIUM && 
             subscription.status === SubscriptionStatus.ACTIVE;
    } catch (error) {
      console.error('Failed to check feature availability:', error);
      return false;
    }
  }
  
  /**
   * Clean up resources
   * @returns Promise<void>
   */
  async cleanup(): Promise<void> {
    if (this.isConnected) {
      await InAppPurchases.disconnectAsync();
      this.isConnected = false;
    }
  }
}

// Create singleton instance with environment variables
const subscriptionService = new SubscriptionService(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

export default subscriptionService;
