import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import colors from '../theme/colors';
import { TripStatusType } from '../types';

interface StatusBadgeProps {
  status: TripStatusType | string;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'ON THE WAY':
      case 'BUS STARTED':
      case 'ARRIVING':
        return {
          bg: colors.successLight,
          text: colors.successDark,
          dot: colors.success,
        };
      case 'DELAYED':
      case 'SCHEDULED':
        return {
          bg: colors.warningLight,
          text: colors.warningDark,
          dot: colors.warning,
        };
      case 'CANCELLED':
      case 'OFFLINE':
      case 'GPS UNAVAILABLE':
        return {
          bg: colors.errorLight,
          text: colors.errorDark,
          dot: colors.error,
        };
      case 'COMPLETED':
        return {
          bg: colors.infoLight,
          text: colors.primaryDark,
          dot: colors.primary,
        };
      default:
        return {
          bg: colors.neutralBadge,
          text: colors.neutralBadgeText,
          dot: colors.textMuted,
        };
    }
  };

  const badgeTheme = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: badgeTheme.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: badgeTheme.dot }]} />
      <Text style={[styles.text, { color: badgeTheme.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default StatusBadge;
