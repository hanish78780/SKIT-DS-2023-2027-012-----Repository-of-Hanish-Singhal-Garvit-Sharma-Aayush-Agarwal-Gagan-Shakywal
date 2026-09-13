import React from 'react';
import {Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import colors from '../theme/colors';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'outline' | 'ghost';
  style?: ViewStyle;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  variant = 'outline',
  style,
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        variant === 'outline' && styles.outline,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
    borderColor: colors.primary,
  },
  text: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SecondaryButton;
