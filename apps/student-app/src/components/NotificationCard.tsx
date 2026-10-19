import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';
import { NotificationItem } from '../types';

interface NotificationCardProps {
  notification: NotificationItem;
  onPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const getTypeColor = () => {
    switch (notification.type) {
      case 'warning':
        return { bg: colors.warningLight, text: colors.warningDark, border: colors.warning };
      case 'success':
        return { bg: colors.successLight, text: colors.successDark, border: colors.success };
      case 'alert':
        return { bg: colors.errorLight, text: colors.errorDark, border: colors.error };
      default:
        return { bg: colors.primaryLight, text: colors.primaryDark, border: colors.primary };
    }
  };

  const theme = getTypeColor();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        shadows.sm,
        !notification.isRead && styles.unreadCard,
      ]}>
      <View style={styles.headerRow}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.bg }]}>
          <Text style={[styles.categoryText, { color: theme.text }]}>
            {notification.category.toUpperCase()}
          </Text>
        </View>

        <View style={styles.rightHeader}>
          <Text style={styles.timestamp}>{notification.timestamp}</Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
      </View>

      <Text style={[styles.title, !notification.isRead && styles.unreadTitle]}>
        {notification.title}
      </Text>
      <Text style={styles.message}>{notification.message}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 6,
  },
  unreadCard: {
    borderColor: colors.primary,
    backgroundColor: '#F4F8FF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  unreadTitle: {
    color: colors.primaryDark,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default NotificationCard;
