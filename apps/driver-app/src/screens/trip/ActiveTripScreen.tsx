import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import MapPlaceholder from '../../components/MapPlaceholder';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import StatusBadge from '../../components/StatusBadge';
import {mockBus, mockRoute, mockTripMetrics} from '../../constants/mockData';
import {TripState} from '../../types/driver';
import colors from '../../theme/colors';
import {shadows} from '../../theme/tokens';

interface ActiveTripScreenProps {
  tripState: TripState;
  onStopTrip: () => void;
  onNavigateToStudents: () => void;
}

const ActiveTripScreen: React.FC<ActiveTripScreenProps> = ({
  tripState,
  onStopTrip,
  onNavigateToStudents,
}) => {
  const isStarted = tripState === 'TRIP_STARTED';

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Active Trip Monitor" subtitle={mockBus.busNumber} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Status Summary */}
        <View style={[styles.statusCard, shadows.soft]}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.routeNameText}>{mockRoute.routeName}</Text>
              <Text style={styles.busTagText}>{mockBus.busTag} • {mockBus.type}</Text>
            </View>
            <StatusBadge status={isStarted ? 'ACTIVE' : 'NOT_STARTED'} />
          </View>
        </View>

        {/* Live Vector Map Visual */}
        <MapPlaceholder
          currentSpeed={isStarted ? mockTripMetrics.currentSpeedKmh : 0}
          distanceKm={isStarted ? mockTripMetrics.distanceKm : 0}
          durationMins={isStarted ? mockTripMetrics.durationMinutes : 0}
          currentLocationName={
            isStarted
              ? mockTripMetrics.currentLocationName
              : 'Depot (SKIT Campus Main Parking)'
          }
        />

        {/* Next Stop Card */}
        <View style={[styles.card, shadows.soft]}>
          <Text style={styles.cardSectionTitle}>Next Stop</Text>
          <View style={styles.nextStopContent}>
            <View style={styles.stopIconCircle}>
              <Text style={styles.stopIcon}>🚏</Text>
            </View>
            <View style={styles.stopTextGroup}>
              <Text style={styles.nextStopName}>Malviya Nagar SNG Plaza</Text>
              <Text style={styles.nextStopTime}>Expected Arrival: 07:55 AM (In 6 mins)</Text>
            </View>
          </View>
        </View>

        {/* Student Onboarding Progress Bar */}
        <View style={[styles.card, shadows.soft]}>
          <View style={styles.progressHeader}>
            <Text style={styles.cardSectionTitle}>Student Onboarding</Text>
            <Text style={styles.progressText}>
              {mockTripMetrics.studentsPickedUp} / {mockTripMetrics.totalStudents} Boarded
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${
                    (mockTripMetrics.studentsPickedUp /
                      mockTripMetrics.totalStudents) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          <SecondaryButton
            title="View Full Student Manifest →"
            onPress={onNavigateToStudents}
            style={styles.manifestBtn}
          />
        </View>

        {/* Stop Trip Button */}
        {isStarted ? (
          <PrimaryButton
            title="STOP TRIP & FINISH"
            variant="danger"
            onPress={onStopTrip}
            style={styles.stopBtn}
          />
        ) : (
          <PrimaryButton
            title="START TRIP BROADCAST"
            variant="primary"
            onPress={onStopTrip}
            style={styles.stopBtn}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeNameText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  busTagText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  cardSectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  nextStopContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopIcon: {
    fontSize: 20,
  },
  stopTextGroup: {
    flex: 1,
  },
  nextStopName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  nextStopTime: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 5,
  },
  manifestBtn: {
    marginTop: 6,
  },
  stopBtn: {
    marginTop: 4,
  },
});

export default ActiveTripScreen;
