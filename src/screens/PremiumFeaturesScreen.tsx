import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Typography from '../components/Typography';
import Card from '../components/Card';
import Button from '../components/Button';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionProductId } from '../services/subscription';

const PremiumFeaturesScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { 
    subscription, 
    products, 
    isLoading, 
    isPremium, 
    purchaseSubscription,
    restorePurchases 
  } = useSubscription();
  const [processingPurchase, setProcessingPurchase] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.medium,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.large,
    },
    headerImage: {
      width: 120,
      height: 120,
      marginBottom: spacing.medium,
    },
    featureCard: {
      marginBottom: spacing.medium,
      padding: spacing.medium,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.small,
    },
    featureIcon: {
      width: 24,
      height: 24,
      marginRight: spacing.small,
    },
    subscriptionCard: {
      marginBottom: spacing.medium,
      padding: spacing.medium,
      borderWidth: 2,
    },
    selectedSubscription: {
      borderColor: colors.primary,
    },
    subscriptionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.small,
    },
    subscriptionPrice: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    subscriptionFeature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xsmall,
    },
    checkIcon: {
      width: 16,
      height: 16,
      marginRight: spacing.small,
    },
    buttonContainer: {
      padding: spacing.medium,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    restoreButton: {
      marginTop: spacing.small,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    currentSubscription: {
      backgroundColor: colors.primaryLight,
      padding: spacing.small,
      borderRadius: 8,
      marginBottom: spacing.medium,
    },
  });

  const handlePurchase = async (productId: SubscriptionProductId) => {
    try {
      setProcessingPurchase(true);
      const success = await purchaseSubscription(productId);
      
      if (success) {
        Alert.alert(
          'Purchase Successful',
          'Thank you for subscribing to FlorAI Premium! You now have access to all premium features.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Purchase Failed',
        'There was an error processing your purchase. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setProcessingPurchase(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setProcessingPurchase(true);
      const success = await restorePurchases();
      
      if (success) {
        Alert.alert(
          'Purchases Restored',
          'Your previous purchases have been restored successfully.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases associated with your account.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Restore Failed',
        'There was an error restoring your purchases. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setProcessingPurchase(false);
    }
  };

  if (isLoading || processingPurchase) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="body1" style={{ marginTop: spacing.medium }}>
          {processingPurchase ? 'Processing your request...' : 'Loading subscription details...'}
        </Typography>
      </View>
    );
  }

  // Find monthly and annual products
  const monthlyProduct = products.find(p => p.id === SubscriptionProductId.MONTHLY);
  const annualProduct = products.find(p => p.id === SubscriptionProductId.ANNUAL);
  const lifetimeProduct = products.find(p => p.id === SubscriptionProductId.LIFETIME);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/premium-icon.png')} 
            style={styles.headerImage}
            resizeMode="contain"
          />
          <Typography variant="h1">FlorAI Premium</Typography>
          <Typography variant="body1" style={{ textAlign: 'center', marginTop: spacing.small }}>
            Unlock advanced plant diagnostics and care features
          </Typography>
        </View>

        {isPremium && (
          <View style={styles.currentSubscription}>
            <Typography variant="h3" style={{ color: colors.primary }}>
              You're a Premium Member!
            </Typography>
            <Typography variant="body2" style={{ marginTop: spacing.xsmall }}>
              Your subscription is active until{' '}
              {subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </View>
        )}

        <Card style={styles.featureCard}>
          <Typography variant="h2">Premium Features</Typography>
          
          <View style={styles.featureRow}>
            <Image 
              source={require('../../assets/feature-icons/advanced-diagnostics.png')} 
              style={styles.featureIcon}
            />
            <View>
              <Typography variant="h3">Advanced Plant Diagnostics</Typography>
              <Typography variant="body2">
                Early disease detection and health monitoring using advanced image analysis
              </Typography>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <Image 
              source={require('../../assets/feature-icons/multispectral.png')} 
              style={styles.featureIcon}
            />
            <View>
              <Typography variant="h3">Multispectral Analysis</Typography>
              <Typography variant="body2">
                Utilize advanced phone sensors for pre-symptomatic disease detection
              </Typography>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <Image 
              source={require('../../assets/feature-icons/unlimited.png')} 
              style={styles.featureIcon}
            />
            <View>
              <Typography variant="h3">Unlimited Plant Identifications</Typography>
              <Typography variant="body2">
                No daily limits on plant identification and diagnostics
              </Typography>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <Image 
              source={require('../../assets/feature-icons/personalized.png')} 
              style={styles.featureIcon}
            />
            <View>
              <Typography variant="h3">Personalized Care Plans</Typography>
              <Typography variant="body2">
                Custom care schedules and recommendations for your specific plants
              </Typography>
            </View>
          </View>
        </Card>

        {!isPremium && (
          <>
            <Typography variant="h2" style={{ marginBottom: spacing.small }}>
              Choose Your Plan
            </Typography>
            
            {monthlyProduct && (
              <Card style={[styles.subscriptionCard]}>
                <View style={styles.subscriptionHeader}>
                  <Typography variant="h3">Monthly</Typography>
                  <View style={styles.subscriptionPrice}>
                    <Typography variant="h2">{monthlyProduct.price}</Typography>
                    <Typography variant="body2">/month</Typography>
                  </View>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">All premium features</Typography>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">Cancel anytime</Typography>
                </View>
                
                <Button 
                  variant="primary" 
                  style={{ marginTop: spacing.small }}
                  onPress={() => handlePurchase(SubscriptionProductId.MONTHLY)}
                >
                  Subscribe Monthly
                </Button>
              </Card>
            )}
            
            {annualProduct && (
              <Card style={[styles.subscriptionCard, styles.selectedSubscription]}>
                <View style={styles.subscriptionHeader}>
                  <View>
                    <Typography variant="h3">Annual</Typography>
                    <Typography variant="caption" style={{ color: colors.primary }}>
                      BEST VALUE - Save 33%
                    </Typography>
                  </View>
                  <View style={styles.subscriptionPrice}>
                    <Typography variant="h2">{annualProduct.price}</Typography>
                    <Typography variant="body2">/year</Typography>
                  </View>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">All premium features</Typography>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">Priority support</Typography>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">Save 33% compared to monthly</Typography>
                </View>
                
                <Button 
                  variant="primary" 
                  style={{ marginTop: spacing.small }}
                  onPress={() => handlePurchase(SubscriptionProductId.ANNUAL)}
                >
                  Subscribe Annually
                </Button>
              </Card>
            )}
            
            {lifetimeProduct && (
              <Card style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                  <Typography variant="h3">Lifetime</Typography>
                  <Typography variant="h2">{lifetimeProduct.price}</Typography>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">All premium features forever</Typography>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">Priority support</Typography>
                </View>
                
                <View style={styles.subscriptionFeature}>
                  <Image 
                    source={require('../../assets/icons/check.png')} 
                    style={styles.checkIcon}
                  />
                  <Typography variant="body2">No recurring payments</Typography>
                </View>
                
                <Button 
                  variant="primary" 
                  style={{ marginTop: spacing.small }}
                  onPress={() => handlePurchase(SubscriptionProductId.LIFETIME)}
                >
                  Purchase Lifetime
                </Button>
              </Card>
            )}
            
            <Button 
              variant="text" 
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
            >
              Restore Purchases
            </Button>
          </>
        )}
        
        <Typography variant="caption" style={{ textAlign: 'center', marginTop: spacing.medium }}>
          Payment will be charged to your account at confirmation of purchase. 
          Subscriptions automatically renew unless auto-renew is turned off at least 24 hours 
          before the end of the current period. Your account will be charged for renewal within 
          24 hours prior to the end of the current period. You can manage and cancel your 
          subscriptions by going to your account settings on the App Store after purchase.
        </Typography>
      </ScrollView>
    </View>
  );
};

export default PremiumFeaturesScreen;
