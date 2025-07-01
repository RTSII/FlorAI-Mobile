import * as React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  Text as RNText,
  TextStyle,
} from 'react-native';
import { Button as PaperButton, Text as PaperText } from 'react-native-paper';

// Create a simple wrapper for Button to avoid type issues
const Button = (props: any) => <PaperButton {...props} />;

// Create a simple wrapper for Text to avoid type issues
const Text = (props: any) => <PaperText {...props} />;

// Create a simple wrapper for Portal to avoid type issues
const Portal = (props: any) => <React.Fragment>{props.children}</React.Fragment>;

type ReactNode = React.ReactNode;

// Simple theme mock
const defaultTheme = {
  colors: {
    primary: '#6200ee',
    onPrimary: '#ffffff',
    surface: '#ffffff',
    onSurface: '#000000',
    background: '#f5f5f5',
    error: '#b00020',
    onSurfaceVariant: '#757575',
  },
  roundness: 4,
};

// Simple useTheme mock
const useTheme = () => defaultTheme;

// Base dialog props
type DialogBaseProps = {
  /** Whether the dialog is visible */
  visible: boolean;
  /** Callback when the dialog is dismissed */
  onDismiss: () => void;
  /** Whether clicking outside the dialog dismisses it */
  dismissable?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Style for the dialog container */
  style?: StyleSheet.NamedStyles<any>;
};

// Alert dialog props
export interface AlertDialogProps extends Omit<DialogBaseProps, 'style'> {
  /** Title of the dialog */
  title: string;
  /** Dialog content text */
  content: string;
  /** Text for the confirm button */
  confirmText?: string;
  /** Callback when the confirm button is pressed */
  onConfirm?: () => void;
  /** Whether to show a cancel button */
  showCancel?: boolean;
  /** Text for the cancel button */
  cancelText?: string;
  /** Callback when the cancel button is pressed */
  onCancel?: () => void;
  /** Whether the confirm button is in a loading state */
  loading?: boolean;
  /** Whether the confirm button is disabled */
  confirmDisabled?: boolean;
  /** Whether this is a destructive action (changes button color) */
  destructive?: boolean;
}

/**
 * A reusable alert dialog component with animations
 */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  onDismiss,
  title,
  content,
  confirmText = 'OK',
  onConfirm,
  showCancel = false,
  cancelText = 'Cancel',
  onCancel,
  loading = false,
  confirmDisabled = false,
  dismissable = true,
  animationDuration = 200,
  destructive = false,
}) => {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    // Reset values
    scale.setValue(0.9);
    opacity.setValue(0);

    // Start animations in parallel
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [scale, opacity, animationDuration]);

  const animateOut = useCallback(
    (callback?: () => void) => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => {
        callback?.();
      });
    },
    [scale, opacity, animationDuration],
  );

  const handleDismiss = useCallback(() => {
    if (!dismissable) return;
    animateOut(onDismiss);
  }, [dismissable, onDismiss, animateOut]);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    } else {
      handleDismiss();
    }
  }, [onConfirm, handleDismiss]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    handleDismiss();
  }, [onCancel, handleDismiss]);

  // Animate in when visible changes
  useEffect(() => {
    if (visible) {
      animateIn();
    }
  }, [visible, animateIn]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleDismiss}>
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dialogContainer,
                {
                  opacity,
                  transform: [{ scale }],
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.roundness * 2,
                },
              ]}
            >
              <Text variant="titleLarge" style={styles.title}>
                {title}
              </Text>
              <Text variant="bodyMedium" style={styles.content}>
                {content}
              </Text>
              <View style={styles.actions}>
                {showCancel && (
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    disabled={loading}
                    style={styles.button}
                  >
                    {cancelText}
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={handleConfirm}
                  loading={loading}
                  disabled={confirmDisabled || loading}
                  style={[styles.button, destructive && { backgroundColor: theme.colors.error }]}
                  labelStyle={{ color: theme.colors.onPrimary }}
                >
                  {confirmText}
                </Button>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

/**
 * A simple loading dialog with a spinner and optional message
 */
export const LoadingDialog: React.FC<{
  visible: boolean;
  message?: string;
  dismissable?: boolean;
  onDismiss?: () => void;
}> = ({ visible, message = 'Loading...', dismissable = false, onDismiss = () => {} }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismissable ? onDismiss : undefined}
    >
      <View style={styles.loadingBackdrop}>
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge">{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    elevation: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    marginLeft: 8,
    minWidth: 100,
  },
  loadingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
});
