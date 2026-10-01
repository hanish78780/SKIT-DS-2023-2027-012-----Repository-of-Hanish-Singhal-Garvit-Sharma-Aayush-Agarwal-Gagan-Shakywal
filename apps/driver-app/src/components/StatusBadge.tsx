import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

export type StatusVariant =
  | 'ACTIVE'
  | 'NOT_STARTED'
  | 'BOARDED'
  | 'WAITING'
  | 'ON_DUTY'
  | 'COMPLETED';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status, label}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'ACTIVE':
      case 'BOARDED':
      case 'ON_DUTY':
      case 'COMPLETED':
        return {
          bg: colors.successBg,
          text: colors.success,
          dot: colors.success,
          border: colors.successBorder,
          defaultLabel: status === 'ACTIVE' ? 'ACTIVE' : status === 'BOARDED' ? 'BOARDED' : status === 'COMPLETED' ? 'COMPLETED' : 'ON DUTY',
        };
      case 'WAITING':
      case 'NOT_STARTED':
      default:
        return {
          bg: colors.warningBg,
          text: colors.warning,
          dot: colors.warning,
          border: colors.warningBorder,
          defaultLabel: status === 'NOT_STARTED' ? 'NOT STARTED' : 'WAITING',
        };
    }
  };

  const styleConfig = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        {backgroundColor: styleConfig.bg, borderColor: styleConfig.border},
      ]}>
      <View style={[styles.dot, {backgroundColor: styleConfig.dot}]} />
      <Text style={[styles.badgeText, {color: styleConfig.text}]}>
        {label || styleConfig.defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
