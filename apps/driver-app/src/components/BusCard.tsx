import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';

interface BusCardProps {
  busNumber?: string;
  model?: string;
  capacity?: number;
  type?: string;
  busTag?: string;
}

const BusCard: React.FC<BusCardProps> = ({
  busNumber = 'RJ-14-AB-1234',
  model = 'Tata Starbus 52-Seater',
  capacity = 52,
  type = 'AC Deluxe Campus Express',
  busTag = 'Bus #12',
}) => {
  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Assigned Bus</Text>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{busTag}</Text>
        </View>
      </View>

      <Text style={styles.busNumber}>{busNumber}</Text>
      <Text style={styles.modelText}>{model}</Text>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Capacity</Text>
          <Text style={styles.metaValue}>{capacity} Seats</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Class</Text>
          <Text style={styles.metaValue}>{type}</Text>
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
  tagBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  busNumber: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modelText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  metaValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
});

export default BusCard;
