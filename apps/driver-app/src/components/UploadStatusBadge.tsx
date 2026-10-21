/**
 * UploadStatusBadge.tsx
 *
 * Renders the backend server location synchronization status as a compact
 * indicator badge separate from device GPS acquisition status.
 *
 * States rendered:
 *  idle          → "○ Server Offline"   (gray)
 *  uploading     → "◌ Uploading…"       (amber)
 *  synced        → "● Server Synced"    (green)
 *  retry_pending → "◌ Reconnecting…"    (amber)
 *  error         → "○ Sync Failed"      (red)
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import { LocationUploadStatus } from '../types/driver';

interface UploadStatusBadgeProps {
  status: LocationUploadStatus;
}

interface BadgeConfig {
  dot: string;
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

function getBadgeConfig(status: LocationUploadStatus): BadgeConfig {
  switch (status) {
    case 'synced':
      return {
        dot: '●',
        label: 'Server Synced',
        dotColor: colors.success,
        textColor: colors.success,
        bgColor: colors.successBg,
        borderColor: colors.successBorder,
      };
    case 'uploading':
      return {
        dot: '◌',
        label: 'Uploading…',
        dotColor: colors.warning,
        textColor: colors.warning,
        bgColor: colors.warningBg,
        borderColor: colors.warningBorder,
      };
    case 'retry_pending':
      return {
        dot: '◌',
        label: 'Reconnecting…',
        dotColor: colors.warning,
        textColor: colors.warning,
        bgColor: colors.warningBg,
        borderColor: colors.warningBorder,
      };
    case 'error':
      return {
        dot: '○',
        label: 'Sync Failed',
        dotColor: colors.error,
        textColor: colors.error,
        bgColor: colors.errorBg,
        borderColor: colors.errorBorder,
      };
    case 'idle':
    default:
      return {
        dot: '○',
        label: 'Server Offline',
        dotColor: colors.textMuted,
        textColor: colors.textMuted,
        bgColor: colors.borderLight,
        borderColor: colors.border,
      };
  }
}

const UploadStatusBadge: React.FC<UploadStatusBadgeProps> = ({ status }) => {
  const config = getBadgeConfig(status);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bgColor, borderColor: config.borderColor },
      ]}>
      <Text style={[styles.dot, { color: config.dotColor }]}>{config.dot}</Text>
      <Text style={[styles.label, { color: config.textColor }]}>
        {config.label}
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

export default UploadStatusBadge;
