import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';

interface RouteCardProps {
  routeName?: string;
  startLocation?: string;
  endLocation?: string;
  pickupTime?: string;
  totalStops?: number;
  shift?: string;
}

const RouteCard: React.FC<RouteCardProps> = ({
  routeName = 'SKIT Campus → Jaipur',
  startLocation = 'SKIT Campus (Ramnagaria)',
  endLocation = 'Jaipur Main Bus Stand',
  pickupTime = '07:30 AM',
  totalStops = 8,
  shift = 'Morning Campus Express',
}) => {
  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Assigned Route</Text>
        <Text style={styles.shiftBadge}>{shift}</Text>
      </View>

      <Text style={styles.routeName}>{routeName}</Text>

      <View style={styles.routeDetailBox}>
        <View style={styles.pointRow}>
          <View style={[styles.pointDot, styles.startDot]} />
          <Text style={styles.pointText}>{startLocation}</Text>
        </View>
        <View style={styles.connectingLine} />
        <View style={styles.pointRow}>
          <View style={[styles.pointDot, styles.endDot]} />
          <Text style={styles.pointText}>{endLocation}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Departure Time</Text>
          <Text style={styles.statValue}>{pickupTime}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Stops</Text>
          <Text style={styles.statValue}>{totalStops} Scheduled Stops</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shiftBadge: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  routeName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  routeDetailBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  startDot: {
    backgroundColor: colors.primary,
  },
  endDot: {
    backgroundColor: colors.success,
  },
  pointText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  connectingLine: {
    width: 2,
    height: 14,
    backgroundColor: colors.border,
    marginLeft: 3,
    marginVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default RouteCard;
