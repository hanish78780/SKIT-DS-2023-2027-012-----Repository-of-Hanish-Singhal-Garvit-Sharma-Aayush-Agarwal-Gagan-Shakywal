import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import BusCard from '../../components/BusCard';
import DriverProfileCard from '../../components/DriverProfileCard';
import GpsStatusBadge from '../../components/GpsStatusBadge';
import RouteCard from '../../components/RouteCard';
import TripStatusCard from '../../components/TripStatusCard';
import {mockBus, mockDriver, mockRoute} from '../../constants/mockData';
import {LocationState, TripState} from '../../types/driver';
import colors from '../../theme/colors';

interface DriverDashboardScreenProps {
  driverId: string;
  tripState: TripState;
  locationState: LocationState;
  onToggleTrip: () => void;
  onLogout: () => void;
  onNavigateTab: (tab: 'activeTrip' | 'students' | 'notifications' | 'profile') => void;
}

const DriverDashboardScreen: React.FC<DriverDashboardScreenProps> = ({
  driverId,
  tripState,
  locationState,
  onToggleTrip,
  onLogout,
  onNavigateTab,
}) => {
  const isTripActive = tripState === 'TRIP_STARTED';

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="UniTransit"
        subtitle="SKIT Jaipur • Driver Portal"
        showLogout
        onLogout={onLogout}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Welcome Greeting */}
        <View style={styles.greetingHeader}>
          <Text style={styles.greetingTitle}>
            Good morning, {mockDriver.name.split(' ')[0]} 👋
          </Text>
          <Text style={styles.greetingSubtitle}>
            Have a safe &amp; punctual shift today!
          </Text>
        </View>

        {/* GPS Status – shown when a trip is active */}
        {isTripActive && (
          <View style={styles.gpsRow}>
            <GpsStatusBadge status={locationState.status} />
            {locationState.errorMessage ? (
              <Text style={styles.gpsErrorText} numberOfLines={2}>
                {locationState.errorMessage}
              </Text>
            ) : null}
          </View>
        )}

        {/* Driver Info Profile Card */}
        <DriverProfileCard
          driverName={mockDriver.name}
          driverId={driverId || mockDriver.id}
          phone={mockDriver.phone}
          status={mockDriver.status === 'ON_DUTY' ? 'On Duty' : 'Off Duty'}
        />

        {/* Dynamic Trip Status Card */}
        <TripStatusCard
          tripState={tripState}
          onToggleTrip={onToggleTrip}
          onViewActiveTrip={() => onNavigateTab('activeTrip')}
        />

        {/* Assigned Bus Card */}
        <BusCard
          busNumber={mockBus.busNumber}
          model={mockBus.model}
          capacity={mockBus.capacity}
          type={mockBus.type}
          busTag={mockBus.busTag}
        />

        {/* Assigned Route Card */}
        <RouteCard
          routeName={mockRoute.routeName}
          startLocation={mockRoute.startLocation}
          endLocation={mockRoute.endLocation}
          pickupTime={mockRoute.pickupTime}
          totalStops={mockRoute.totalStops}
          shift={mockRoute.shift}
        />

        <Text style={styles.footerNote}>
          UniTransit Campus Transport • SKIT Jaipur Transport Cell
        </Text>
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
  greetingHeader: {
    marginBottom: 16,
  },
  greetingTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  greetingSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  gpsRow: {
    marginBottom: 12,
    gap: 6,
  },
  gpsErrorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  footerNote: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
});

export default DriverDashboardScreen;
