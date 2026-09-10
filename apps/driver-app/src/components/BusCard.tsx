import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

interface BusCardProps {
  busNumber?: string;
  capacity?: string;
}

const BusCard: React.FC<BusCardProps> = ({
  busNumber = 'RJ-14-PA-2024',
  capacity = '52-Seater Express',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Assigned Bus</Text>
        <View style={styles.busTag}>
          <Text style={styles.busTagText}>Bus #12</Text>
        </View>
      </View>
      <Text style={styles.busNumber}>{busNumber}</Text>
      <Text style={styles.busDetails}>{capacity}</Text>
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
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  busTag: {
    backgroundColor: '#EFF8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  busTagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  busNumber: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  busDetails: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default BusCard;
