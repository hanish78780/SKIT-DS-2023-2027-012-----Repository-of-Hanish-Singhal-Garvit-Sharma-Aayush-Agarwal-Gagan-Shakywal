import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import BusCard from '../../components/BusCard';
import DriverInfoCard from '../../components/DriverInfoCard';
import RouteCard from '../../components/RouteCard';
import TripStatusCard, {TripState} from '../../components/TripStatusCard';
import colors from '../../theme/colors';

interface DriverDashboardScreenProps {
  driverId: string;
  onLogout: () => void;
}

const DriverDashboardScreen: React.FC<DriverDashboardScreenProps> = ({
  driverId,
  onLogout,
}) => {
  const [tripState, setTripState] = useState<TripState>('NOT_STARTED');

  const handleToggleTrip = () => {
    setTripState(prev => (prev === 'NOT_STARTED' ? 'TRIP_STARTED' : 'NOT_STARTED'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>U</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>UniTransit</Text>
            <Text style={styles.brandSubtitle}>Driver Portal</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Logout"
          onPress={onLogout}
          style={({pressed}) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <DriverInfoCard driverId={driverId} />
        <TripStatusCard
          tripState={tripState}
          onToggleTrip={handleToggleTrip}
        />
        <BusCard />
        <RouteCard />

        <Text style={styles.footerNote}>
          UniTransit Campus Transport • Driver Session Active
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  brandTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: -2,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  logoutButtonPressed: {
    backgroundColor: colors.errorBg,
    borderColor: colors.error,
  },
  logoutText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  footerNote: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 10,
  },
});

export default DriverDashboardScreen;
