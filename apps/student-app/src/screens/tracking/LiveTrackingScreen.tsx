import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';
import MockMap from '../../components/MockMap';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import MockApiService from '../../services/mockApi';
import { BusDetails, RouteDetails, StudentProfile } from '../../types';

interface LiveTrackingScreenProps {
  onNavigateRoute: () => void;
}

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  onNavigateRoute,
}) => {
  const [bus, setBus] = useState<BusDetails | null>(null);
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busData, routeData, stdData] = await Promise.all([
          MockApiService.getAssignedBus(),
          MockApiService.getAssignedRoute(),
          MockApiService.getStudentProfile(),
        ]);
        setBus(busData);
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

  if (loading || !bus || !route || !student) {
    return <LoadingState message="Connecting to Live GPS Feed..." />;
  }

  const handleCallDriver = () => {
    Alert.alert(
      `Call Driver ${bus.driver.name}`,
      `Dial ${bus.driver.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${bus.driver.phone}`),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Live Bus Tracking</Text>
          <Text style={styles.subtitle}>{bus.busNumber} • {route.routeNumber}</Text>
        </View>
        <StatusBadge status={bus.status} />
      </View>

      {/* Interactive Vector Mock Map */}
      <MockMap
        busNumber={bus.busNumber}
        speedKmH={bus.currentSpeedKmH}
        etaMinutes={8}
        stops={route.stops}
        studentPickupStopName={student.pickupStopName}
        onBusMarkerPress={() =>
          Alert.alert(
            bus.busNumber,
            `Tata Marcopolo Deluxe Coach\nSpeed: ${bus.currentSpeedKmH} km/h\nDriver: ${bus.driver.name}`
          )
        }
      />

      {/* Realtime Metrics Strip */}
      <View style={[styles.metricsStrip, shadows.sm]}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>ETA TO STOP</Text>
          <Text style={styles.metricValHighlight}>8 MIN</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>DISTANCE</Text>
          <Text style={styles.metricVal}>2.4 km</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>CURRENT SPEED</Text>
          <Text style={styles.metricVal}>{bus.currentSpeedKmH} km/h</Text>
        </View>
      </View>

      {/* Pickup Stop Card */}
      <View style={[styles.card, shadows.sm]}>
        <View style={styles.pickupHeader}>
          <View style={styles.pickupIconCircle}>
            <Text style={styles.pickupIcon}>📍</Text>
          </View>
          <View style={styles.pickupTextCol}>
            <Text style={styles.pickupLabel}>YOUR ASSIGNED PICKUP STOP</Text>
            <Text style={styles.pickupName}>{student.pickupStopName}</Text>
            <Text style={styles.pickupTime}>Scheduled Arrival: {student.pickupTime}</Text>
          </View>
        </View>

        <Pressable onPress={onNavigateRoute} style={styles.viewTimelineBtn}>
          <Text style={styles.viewTimelineText}>View Full Route Timeline →</Text>
        </Pressable>
      </View>

      {/* Driver Information Card */}
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.cardSectionTitle}>Assigned Transport Driver</Text>
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>{bus.driver.name.charAt(0)}</Text>
          </View>
          <View style={styles.driverCol}>
            <Text style={styles.driverName}>{bus.driver.name}</Text>
            <Text style={styles.driverSub}>
              Driver ID: {bus.driver.driverId} • {bus.driver.experienceYears} Yrs Exp
            </Text>
            <Text style={styles.driverRating}>★ {bus.driver.rating} Rating</Text>
          </View>
          <Pressable onPress={handleCallDriver} style={styles.callBtn}>
            <Text style={styles.callBtnIcon}>📞</Text>
            <Text style={styles.callBtnText}>Call</Text>
          </Pressable>
        </View>
      </View>

      {/* Live GPS Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          📡 GPS updates automatically every 10 seconds. Live tracking uses SKIT driver broadcast signals.
        </Text>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  metricValHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 6,
  },
  pickupHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  pickupIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupIcon: {
    fontSize: 20,
  },
  pickupTextCol: {
    flex: 1,
  },
  pickupLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.4,
  },
  pickupName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1,
  },
  pickupTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  viewTimelineBtn: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    alignItems: 'flex-end',
  },
  viewTimelineText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    color: colors.textInverted,
    fontSize: 18,
    fontWeight: '700',
  },
  driverCol: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  driverSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  driverRating: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warningDark,
    marginTop: 1,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  callBtnIcon: {
    fontSize: 14,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.successDark,
  },
  infoBanner: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D0E1FF',
  },
  infoBannerText: {
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
  },
});

export default LiveTrackingScreen;
