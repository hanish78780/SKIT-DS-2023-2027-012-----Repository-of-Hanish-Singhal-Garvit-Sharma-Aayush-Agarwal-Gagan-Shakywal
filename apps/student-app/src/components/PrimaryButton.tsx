import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isInteractive = !disabled && !isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive }}
      onPress={isInteractive ? onPress : undefined}
      style={({ pressed }) => [
        styles.button,
        shadows.sm,
        disabled && styles.buttonDisabled,
        pressed && isInteractive && styles.buttonPressed,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={colors.textInverted} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  text: {
    color: colors.textInverted,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default PrimaryButton;
