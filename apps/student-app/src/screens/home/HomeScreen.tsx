import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import colors from '../../theme/colors';
import StudentHeader from '../../components/StudentHeader';
import LiveBusCard from '../../components/LiveBusCard';
import QuickAction from '../../components/QuickAction';
import LoadingState from '../../components/LoadingState';
import MockApiService from '../../services/mockApi';
import { BusDetails, StudentProfile, NotificationItem } from '../../types';

interface HomeScreenProps {
  onNavigateTrack: () => void;
  onNavigateRoute: () => void;
  onNavigateBusDetails: () => void;
  onNavigateNotifications: () => void;
  onNavigateReportIssue: () => void;
  onNavigateHelp: () => void;
  onNavigateProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTrack,
  onNavigateRoute,
  onNavigateBusDetails,
  onNavigateNotifications,
  onNavigateReportIssue,
  onNavigateHelp,
  onNavigateProfile,
}) => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [bus, setBus] = useState<BusDetails | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [stdData, busData, notifData] = await Promise.all([
        MockApiService.getStudentProfile(),
        MockApiService.getAssignedBus(),
        MockApiService.getNotifications(),
      ]);
      setStudent(stdData);
      setBus(busData);
      setNotifications(notifData);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading || !student || !bus) {
    return <LoadingState message="Loading your SKIT bus schedule..." />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <StudentHeader
        student={student}
        unreadNotificationsCount={unreadCount}
        onNotificationPress={onNavigateNotifications}
        onProfilePress={onNavigateProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Main Live Bus Card */}
        <LiveBusCard
          bus={bus}
          student={student}
          onTrackPress={onNavigateTrack}
          onRoutePress={onNavigateRoute}
        />

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <QuickAction
            icon="🗺️"
            title="Live Track"
            subtitle="GPS Bus Location"
            onPress={onNavigateTrack}
          />
          <QuickAction
            icon="📍"
            title="My Route"
            subtitle="View All Stops"
            onPress={onNavigateRoute}
          />
          <QuickAction
            icon="🚍"
            title="Bus Info"
            subtitle="Driver & Details"
            onPress={onNavigateBusDetails}
          />
          <QuickAction
            icon="🔔"
            title="Alerts"
            subtitle="Notifications"
            badgeCount={unreadCount}
            onPress={onNavigateNotifications}
          />
          <QuickAction
            icon="⚠️"
            title="Report Issue"
            subtitle="Delays & Help"
            onPress={onNavigateReportIssue}
          />
          <QuickAction
            icon="🆘"
            title="Help & Safety"
            subtitle="Transport Desk"
            onPress={onNavigateHelp}
          />
        </View>

        {/* Quick Trip Status Summary */}
        <View style={styles.tripSummaryBox}>
          <Text style={styles.tripTitle}>Trip Status Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Morning Pickup Status:</Text>
            <Text style={styles.summaryValue}>ON TIME (8 min ETA)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Assigned Driver:</Text>
            <Text style={styles.summaryValue}>{bus.driver.name} (★ 4.9)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Campus Destination:</Text>
            <Text style={styles.summaryValue}>SKIT Main Gate (08:45 AM)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  tripSummaryBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  tripTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});

export default HomeScreen;
