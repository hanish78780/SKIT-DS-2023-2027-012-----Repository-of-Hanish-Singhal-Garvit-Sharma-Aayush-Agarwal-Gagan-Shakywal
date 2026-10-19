import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';
import StatusBadge from './StatusBadge';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { BusDetails, StudentProfile } from '../types';

interface LiveBusCardProps {
  bus: BusDetails;
  student: StudentProfile;
  onTrackPress: () => void;
  onRoutePress: () => void;
}

export const LiveBusCard: React.FC<LiveBusCardProps> = ({
  bus,
  student,
  onTrackPress,
  onRoutePress,
}) => {
  return (
    <View style={[styles.card, shadows.md]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.busLabel}>ASSIGNED BUS</Text>
          <Text style={styles.busNumber}>{bus.busNumber}</Text>
        </View>
        <StatusBadge status={bus.status} />
      </View>

      <Text style={styles.routeName}>{bus.assignedRoute}</Text>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>YOUR PICKUP STOP</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {student.pickupStopName}
          </Text>
        </View>

        <View style={styles.infoColRight}>
          <Text style={styles.infoLabel}>PICKUP TIME</Text>
          <Text style={styles.infoValue}>{student.pickupTime}</Text>
        </View>
      </View>

      <View style={styles.etaContainer}>
        <View style={styles.etaLeft}>
          <Text style={styles.etaTitle}>Estimated Arrival (ETA)</Text>
          <Text style={styles.etaSub}>Updated {bus.lastUpdated}</Text>
        </View>
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>8 MIN</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Distance</Text>
          <Text style={styles.metricValue}>2.4 km</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Current Speed</Text>
          <Text style={styles.metricValue}>{bus.currentSpeedKmH} km/h</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Driver</Text>
          <Text style={styles.metricValue}>{bus.driver.name}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <PrimaryButton
          title="Track Live Bus"
          onPress={onTrackPress}
          style={styles.primaryAction}
        />
        <SecondaryButton
          title="Route Stops"
          onPress={onRoutePress}
          style={styles.secondaryAction}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  busLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  busNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  routeName: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  infoColRight: {
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  etaContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D0E1FF',
  },
  etaLeft: {
    flex: 1,
  },
  etaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  etaSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  etaBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  etaText: {
    color: colors.textInverted,
    fontSize: 15,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryAction: {
    flex: 1.4,
    height: 46,
  },
  secondaryAction: {
    flex: 1,
    height: 46,
  },
});

export default LiveBusCard;
