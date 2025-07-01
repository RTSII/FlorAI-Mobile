import React, { useState } from 'react';
import { Modal, StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Typography from './Typography';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useSubscription } from '../contexts/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PremiumFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
  featureIcon: any; // React Native image source
  benefitsList: string[];
}

type PremiumFeatureModalNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PremiumFeatures'
>;

const { width } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.85;

const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({
  visible,
  onClose,
  featureName,
  featureDescription,
  featureIcon,
  benefitsList,
}) => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<PremiumFeatureModalNavigationProp>();
  const { isPremium } = useSubscription();
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: MODAL_WIDTH,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: spacing.medium,
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    closeButton: {
      position: 'absolute',
      top: spacing.small,
      right: spacing.small,
      padding: spacing.xsmall,
      zIndex: 1,
    },
    closeIcon: {
      width: 24,
      height: 24,
    },
    featureIcon: {
      width: 80,
      height: 80,
      marginBottom: spacing.medium,
    },
    premiumBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.small,
      paddingVertical: spacing.xxsmall,
      borderRadius: 16,
      marginBottom: spacing.small,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.small,
      width: '100%',
    },
    checkIcon: {
      width: 20,
      height: 20,
      marginRight: spacing.small,
    },
    buttonContainer: {
      width: '100%',
      marginTop: spacing.medium,
    },
    dontShowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.medium,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 4,
      marginRight: spacing.small,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkmark: {
      width: 12,
      height: 12,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });

  const handleClose = async () => {
    if (dontShowAgain) {
      try {
        await AsyncStorage.setItem(`premium_modal_${featureName.replace(/\s+/g, '_').toLowerCase()}_dismissed`, 'true');
      } catch (error) {
        console.error('Error saving modal preference:', error);
      }
    }
    onClose();
  };

  const handleSubscribe = () => {
    onClose();
    navigation.navigate('PremiumFeatures');
  };

  // If user is already premium, don't show the modal
  if (isPremium) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Image
              source={require('../../assets/icons/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <Image source={featureIcon} style={styles.featureIcon} resizeMode="contain" />

          <View style={styles.premiumBadge}>
            <Typography variant="caption" style={{ color: colors.onPrimary }}>
              PREMIUM FEATURE
            </Typography>
          </View>

          <Typography variant="h2" style={{ marginBottom: spacing.xsmall, textAlign: 'center' }}>
            {featureName}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: spacing.medium, textAlign: 'center' }}>
            {featureDescription}
          </Typography>

          <Typography variant="h3" style={{ marginBottom: spacing.small, alignSelf: 'flex-start' }}>
            Benefits:
          </Typography>

          {benefitsList.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Image
                source={require('../../assets/icons/check-circle.png')}
                style={styles.checkIcon}
              />
              <Typography variant="body2">{benefit}</Typography>
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <Button variant="primary" onPress={handleSubscribe}>
              Upgrade to Premium
            </Button>
            <Button variant="text" onPress={handleClose} style={{ marginTop: spacing.small }}>
              Maybe Later
            </Button>
          </View>

          <TouchableOpacity
            style={styles.dontShowContainer}
            onPress={() => setDontShowAgain(!dontShowAgain)}
          >
            <View style={styles.checkbox}>
              {dontShowAgain && <View style={styles.checkmark} />}
            </View>
            <Typography variant="caption">Don't show this again for this feature</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PremiumFeatureModal;
