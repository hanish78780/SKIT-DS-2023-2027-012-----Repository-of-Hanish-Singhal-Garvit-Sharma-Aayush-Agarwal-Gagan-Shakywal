import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';
import RouteTimeline from '../../components/RouteTimeline';
import LoadingState from '../../components/LoadingState';
import MockApiService from '../../services/mockApi';
import { RouteDetails, StudentProfile } from '../../types';

export const MyRouteScreen: React.FC = () => {
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routeData, stdData] = await Promise.all([
          MockApiService.getAssignedRoute(),
          MockApiService.getStudentProfile(),
        ]);
        setRoute(routeData);
        setStudent(stdData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !route || !student) {
    return <LoadingState message="Loading route timetable and stop sequence..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Route Overview Header Card */}
      <View style={[styles.card, shadows.md]}>
        <View style={styles.headerTop}>
          <Text style={styles.routeBadge}>{route.routeNumber}</Text>
          <Text style={styles.distanceTag}>{route.totalDistanceKm} km • {route.estimatedDurationMins} mins</Text>
        </View>

        <Text style={styles.routeName}>{route.routeName}</Text>

        <View style={styles.pointsRow}>
          <View style={styles.pointItem}>
            <Text style={styles.pointLabel}>START POINT</Text>
            <Text style={styles.pointValue}>{route.startPoint}</Text>
          </View>
          <Text style={styles.arrowIcon}>➔</Text>
          <View style={styles.pointItemRight}>
            <Text style={styles.pointLabel}>DESTINATION</Text>
            <Text style={styles.pointValue}>{route.destination}</Text>
          </View>
        </View>
      </View>

      {/* Your Pickup Stop Highlight Box */}
      <View style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>📍 Your Assigned Pickup Stop</Text>
        <Text style={styles.highlightName}>{student.pickupStopName}</Text>
        <Text style={styles.highlightTime}>Scheduled Pickup: {student.pickupTime}</Text>
      </View>

      <Text style={styles.sectionHeader}>Route Stop Timeline</Text>
      <Text style={styles.sectionSub}>Follow real-time progress of each stop along the route.</Text>

      {/* Vertical Route Stop Timeline */}
      <RouteTimeline
        stops={route.stops}
        studentPickupStopName={student.pickupStopName}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeBadge: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  routeName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 14,
  },
  pointItem: {
    flex: 1,
  },
  pointItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  pointLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  pointValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 16,
    color: colors.primary,
    paddingHorizontal: 8,
  },
  highlightBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D0E1FF',
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  highlightName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  highlightTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
});

export default MyRouteScreen;
