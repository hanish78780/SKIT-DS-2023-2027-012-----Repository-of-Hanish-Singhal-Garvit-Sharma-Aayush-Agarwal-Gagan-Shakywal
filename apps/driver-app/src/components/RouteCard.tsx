import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

interface RouteCardProps {
  routeName?: string;
  stopsCount?: number;
}

const RouteCard: React.FC<RouteCardProps> = ({
  routeName = 'SKIT Campus → Jaipur Main Bus Stand',
  stopsCount = 8,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Assigned Route</Text>
      <Text style={styles.routeName}>{routeName}</Text>
      <View style={styles.routeFooter}>
        <View style={styles.infoBadge}>
          <Text style={styles.infoText}>{stopsCount} Scheduled Stops</Text>
        </View>
        <Text style={styles.timeText}>Shift: Morning Express</Text>
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
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  routeName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default RouteCard;
