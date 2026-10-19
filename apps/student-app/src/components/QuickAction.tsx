import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';

interface QuickActionProps {
  icon: string;
  title: string;
  subtitle?: string;
  badgeCount?: number;
  onPress: () => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  title,
  subtitle,
  badgeCount,
  onPress,
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadows.sm,
        pressed && styles.pressed,
      ]}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon}</Text>
        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.primaryLight,
    borderColor: '#D0E1FF',
    transform: [{ scale: 0.98 }],
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconText: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textInverted,
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default QuickAction;
