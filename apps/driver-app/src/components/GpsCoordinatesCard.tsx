/**
 * GpsCoordinatesCard.tsx
 *
 * DEBUG / DEVELOPMENT card that displays raw GPS coordinates
 * (latitude, longitude, accuracy) during an active trip.
 *
 * This component is intentionally labelled "[DEV]" in the UI to make
 * clear it shows debug info; it will be replaced with a proper map
 * integration in a future milestone.
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';
import {LocationCoordinates} from '../types/driver';

interface GpsCoordinatesCardProps {
  coordinates: LocationCoordinates | null;
}

const GpsCoordinatesCard: React.FC<GpsCoordinatesCardProps> = ({
  coordinates,
}) => {
  if (!coordinates) {
    return null;
  }

  const lat = coordinates.latitude.toFixed(6);
  const lng = coordinates.longitude.toFixed(6);
  const acc = coordinates.accuracy.toFixed(1);
  const ts = new Date(coordinates.timestamp).toLocaleTimeString();

  return (
    <View style={[styles.card, shadows.soft]}>
      <Text style={styles.sectionTitle}>[DEV] GPS Coordinates</Text>

      <View style={styles.row}>
        <Text style={styles.key}>Latitude</Text>
        <Text style={styles.value}>{lat}°</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>Longitude</Text>
        <Text style={styles.value}>{lng}°</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>Accuracy</Text>
        <Text style={styles.value}>±{acc} m</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>Last Update</Text>
        <Text style={styles.value}>{ts}</Text>
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
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  key: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

export default GpsCoordinatesCard;
