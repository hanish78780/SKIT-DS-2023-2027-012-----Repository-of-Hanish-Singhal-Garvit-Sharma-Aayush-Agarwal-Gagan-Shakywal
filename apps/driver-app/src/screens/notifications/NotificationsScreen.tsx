import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import NotificationCard from '../../components/NotificationCard';
import {mockNotifications} from '../../constants/mockData';
import {DriverNotification} from '../../types/driver';
import colors from '../../theme/colors';

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<DriverNotification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} Unread Alerts` : 'All caught up'}
      />

      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.sectionHeader}>Campus Dispatch Notices</Text>
          {unreadCount > 0 && (
            <Pressable onPress={handleMarkAllRead}>
              <Text style={styles.markReadText}>Mark all as read</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({item}) => <NotificationCard notification={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeader: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  markReadText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default NotificationsScreen;
