import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DriverNotification} from '../types/driver';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';

interface NotificationCardProps {
  notification: DriverNotification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({notification}) => {
  const getCategoryIcon = () => {
    switch (notification.type) {
      case 'ROUTE':
        return '🗺️';
      case 'SCHEDULE':
        return '⏰';
      case 'MAINTENANCE':
        return '🔧';
      case 'SYSTEM':
      default:
        return '🔔';
    }
  };

  return (
    <View
      style={[
        styles.card,
        shadows.soft,
        !notification.read && styles.unreadCard,
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.icon}>{getCategoryIcon()}</Text>
          <Text style={styles.title}>{notification.title}</Text>
        </View>
        <Text style={styles.timestamp}>{notification.timestamp}</Text>
      </View>
      <Text style={styles.message}>{notification.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  unreadCard: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryBg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default NotificationCard;
