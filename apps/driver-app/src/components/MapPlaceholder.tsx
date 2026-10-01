import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';

interface MapPlaceholderProps {
  currentSpeed?: number;
  distanceKm?: number;
  durationMins?: number;
  currentLocationName?: string;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  currentSpeed = 38,
  distanceKm = 12.4,
  durationMins = 24,
  currentLocationName = 'Near Jagatpura Flyover (Heading to Malviya Nagar)',
}) => {
  return (
    <View style={[styles.mapContainer, shadows.medium]}>
      {/* Mock Map Grid & Polyline visuals */}
      <View style={styles.mapGridBackground}>
        <View style={styles.gridLineHorizontal} />
        <View style={[styles.gridLineHorizontal, {top: '40%'}]} />
        <View style={[styles.gridLineHorizontal, {top: '70%'}]} />
        <View style={styles.gridLineVertical} />
        <View style={[styles.gridLineVertical, {left: '50%'}]} />
        <View style={[styles.gridLineVertical, {left: '75%'}]} />

        {/* Route Path Polyline Visual */}
        <View style={styles.routePathContainer}>
          <View style={styles.polylineSegment1} />
          <View style={styles.polylineSegment2} />
          <View style={styles.polylineSegment3} />

          {/* Active Bus Marker */}
          <View style={styles.busMarkerContainer}>
            <View style={styles.pulseRing} />
            <View style={styles.busMarkerDot}>
              <Text style={styles.busMarkerIcon}>🚌</Text>
            </View>
          </View>
        </View>

        {/* GPS Badge Overlay */}
        <View style={styles.gpsLiveBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.gpsLiveText}>GPS LIVE BROADCASTING</Text>
        </View>
      </View>

      {/* Map Footer Overlay Stats */}
      <View style={styles.mapFooterStats}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationPinIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {currentLocationName}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{durationMins}m</Text>
            <Text style={styles.metricLabel}>Duration</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{distanceKm} km</Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{currentSpeed} km/h</Text>
            <Text style={styles.metricLabel}>Speed</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 280,
    backgroundColor: '#E2E8F0',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  mapGridBackground: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '20%',
    height: 1,
    backgroundColor: '#CBD5E1',
    opacity: 0.5,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 1,
    backgroundColor: '#CBD5E1',
    opacity: 0.5,
  },
  routePathContainer: {
    position: 'absolute',
    width: '80%',
    height: '60%',
  },
  polylineSegment1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '40%',
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  polylineSegment2: {
    position: 'absolute',
    top: '20%',
    left: '48%',
    width: 4,
    height: '50%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  polylineSegment3: {
    position: 'absolute',
    top: '68%',
    left: '48%',
    width: '40%',
    height: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 2,
  },
  busMarkerContainer: {
    position: 'absolute',
    top: '12%',
    left: '42%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(26, 86, 219, 0.25)',
  },
  busMarkerDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  busMarkerIcon: {
    fontSize: 14,
  },
  gpsLiveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  gpsLiveText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mapFooterStats: {
    backgroundColor: colors.surface,
    padding: 14,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationPinIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    paddingVertical: 8,
    borderRadius: 10,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
  },
  verticalLine: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  metricValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
});

export default MapPlaceholder;
