import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import colors from '../../theme/colors';
import NotificationCard from '../../components/NotificationCard';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import MockApiService from '../../services/mockApi';
import { NotificationItem, NotificationCategory } from '../../types';

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('All');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await MockApiService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(item => ({ ...item, isRead: true }))
    );
  };

  const handleNotificationPress = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  if (loading) {
    return <LoadingState message="Loading transport alerts..." />;
  }

  const categories: NotificationCategory[] = ['All', 'Important', 'Route', 'Trip'];

  const filteredNotifications = notifications.filter(n => {
    if (selectedCategory === 'All') return true;
    return n.category === selectedCategory;
  });

  return (
    <View style={styles.container}>
      {/* Header & Mark Read */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subTitle}>Stay updated on route changes & bus alerts</Text>
        </View>
        <Pressable onPress={handleMarkAllRead} style={styles.markReadBtn}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </Pressable>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsRow}>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.tabChip, isSelected && styles.tabChipSelected]}>
              <Text
                style={[
                  styles.tabChipText,
                  isSelected && styles.tabChipTextSelected,
                ]}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={() => handleNotificationPress(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Notifications"
            description={`There are currently no ${selectedCategory} alerts to show.`}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  markReadBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabChipTextSelected: {
    color: colors.textInverted,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export default NotificationsScreen;
