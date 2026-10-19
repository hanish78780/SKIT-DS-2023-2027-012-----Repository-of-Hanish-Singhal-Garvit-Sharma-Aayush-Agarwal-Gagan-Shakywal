/**
 * GpsStatusBadge.tsx
 *
 * A small, reusable component that renders the current GPS state as a
 * compact status indicator consistent with the UniTransit Driver App design.
 *
 * States rendered:
 *  idle / requesting_permission → "Initialising…"   (amber)
 *  acquiring_location           → "Acquiring…"       (amber)
 *  tracking                     → "● Active"         (green)
 *  permission_denied            → "○ Permission Required"   (red)
 *  permission_blocked           → "○ Permission Blocked"    (red)
 *  location_unavailable         → "○ Location Unavailable"  (orange)
 *  error                        → "○ GPS Error"             (red)
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';
import {LocationStatus} from '../types/driver';

interface GpsStatusBadgeProps {
  status: LocationStatus;
}

interface BadgeConfig {
  dot: string;
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

function getBadgeConfig(status: LocationStatus): BadgeConfig {
  switch (status) {
    case 'tracking':
      return {
        dot: '●',
        label: 'Active',
        dotColor: colors.success,
        textColor: colors.success,
        bgColor: colors.successBg,
        borderColor: colors.successBorder,
      };
    case 'acquiring_location':
      return {
        dot: '◌',
        label: 'Acquiring…',
        dotColor: colors.warning,
        textColor: colors.warning,
        bgColor: colors.warningBg,
        borderColor: colors.warningBorder,
      };
    case 'requesting_permission':
      return {
        dot: '◌',
        label: 'Initialising…',
        dotColor: colors.warning,
        textColor: colors.warning,
        bgColor: colors.warningBg,
        borderColor: colors.warningBorder,
      };
    case 'permission_denied':
      return {
        dot: '○',
        label: 'Permission Required',
        dotColor: colors.error,
        textColor: colors.error,
        bgColor: colors.errorBg,
        borderColor: colors.errorBorder,
      };
    case 'permission_blocked':
      return {
        dot: '○',
        label: 'Permission Blocked',
        dotColor: colors.error,
        textColor: colors.error,
        bgColor: colors.errorBg,
        borderColor: colors.errorBorder,
      };
    case 'location_unavailable':
      return {
        dot: '○',
        label: 'Location Unavailable',
        dotColor: colors.warning,
        textColor: colors.warning,
        bgColor: colors.warningBg,
        borderColor: colors.warningBorder,
      };
    case 'error':
      return {
        dot: '○',
        label: 'GPS Error',
        dotColor: colors.error,
        textColor: colors.error,
        bgColor: colors.errorBg,
        borderColor: colors.errorBorder,
      };
    case 'idle':
    default:
      return {
        dot: '○',
        label: 'Idle',
        dotColor: colors.textMuted,
        textColor: colors.textMuted,
        bgColor: colors.borderLight,
        borderColor: colors.border,
      };
  }
}

const GpsStatusBadge: React.FC<GpsStatusBadgeProps> = ({status}) => {
  const config = getBadgeConfig(status);

  return (
    <View
      style={[
        styles.badge,
        {backgroundColor: config.bgColor, borderColor: config.borderColor},
      ]}>
      <Text style={[styles.dot, {color: config.dotColor}]}>{config.dot}</Text>
      <Text style={[styles.label, {color: config.textColor}]}>
        GPS: {config.label}
      </Text>
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
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    fontSize: 11,
    marginRight: 5,
    lineHeight: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default GpsStatusBadge;
