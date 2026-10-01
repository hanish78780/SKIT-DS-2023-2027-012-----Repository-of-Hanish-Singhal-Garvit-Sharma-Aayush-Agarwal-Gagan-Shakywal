import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';

interface DriverProfileCardProps {
  driverName?: string;
  driverId?: string;
  phone?: string;
  status?: string;
}

const DriverProfileCard: React.FC<DriverProfileCardProps> = ({
  driverName = 'Rajesh Kumar',
  driverId = 'DRV-001',
  phone = '+91 98290 12345',
  status = 'On Duty',
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.contentRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(driverName)}</Text>
        </View>

        <View style={styles.infoGroup}>
          <View style={styles.nameRow}>
            <Text style={styles.driverName}>{driverName}</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          <Text style={styles.driverIdText}>ID: {driverId}</Text>
          <Text style={styles.phoneText}>{phone}</Text>
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
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  infoGroup: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  driverName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  driverIdText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  phoneText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});

export default DriverProfileCard;
