import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

interface DriverInfoCardProps {
  driverId: string;
  driverName?: string;
}

const DriverInfoCard: React.FC<DriverInfoCardProps> = ({
  driverId,
  driverName = 'Hanish Singhal',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>
          {driverName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{driverName}</Text>
        <Text style={styles.driverId}>ID: {driverId || 'DRV-101'}</Text>
      </View>
      <View style={styles.statusBadge}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>On Duty</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  details: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  driverId: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DriverInfoCard;
