import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';
import { RouteStop } from '../types';

interface MockMapProps {
  busNumber: string;
  speedKmH: number;
  etaMinutes: number;
  stops: RouteStop[];
  studentPickupStopName: string;
  onBusMarkerPress?: () => void;
}

export const MockMap: React.FC<MockMapProps> = ({
  busNumber,
  speedKmH,
  etaMinutes,
  stops,
  studentPickupStopName,
  onBusMarkerPress,
}) => {
  const [isSimulating, setIsSimulating] = useState(true);
  const [busProgress, setBusProgress] = useState(0.42); // 42% along the route line

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSimulating) {
      interval = setInterval(() => {
        setBusProgress(prev => (prev >= 0.85 ? 0.2 : prev + 0.02));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <View style={styles.container}>
      {/* Map Canvas Background */}
      <View style={styles.mapCanvas}>
        {/* Simulated Grid / Territory Roads */}
        <View style={[styles.gridRoadHorizontal, { top: '25%' }]} />
        <View style={[styles.gridRoadHorizontal, { top: '55%' }]} />
        <View style={[styles.gridRoadHorizontal, { top: '80%' }]} />
        <View style={[styles.gridRoadVertical, { left: '30%' }]} />
        <View style={[styles.gridRoadVertical, { left: '70%' }]} />

        {/* Route Path (Curved / Angled Line) */}
        <View style={styles.routeLineMain} />
        <View style={styles.routeLineCompleted} />

        {/* Stops Pin Markers */}
        {stops.map((stop, idx) => {
          const topPercent = `${15 + idx * 14}%`;
          const leftPercent = idx % 2 === 0 ? '38%' : '48%';
          const isPickup = stop.stopName.includes(studentPickupStopName) || stop.isStudentPickup;

          return (
            <View
              key={stop.id}
              style={[
                styles.stopPinContainer,
                { top: topPercent, left: leftPercent },
              ]}>
              <View
                style={[
                  styles.stopDot,
                  stop.status === 'passed' && styles.stopDotPassed,
                  isPickup && styles.stopDotPickup,
                ]}>
                {isPickup && <View style={styles.pickupPulse} />}
              </View>
              {isPickup && (
                <View style={[styles.stopTooltip, shadows.sm]}>
                  <Text style={styles.stopTooltipTitle}>YOUR STOP</Text>
                  <Text style={styles.stopTooltipName} numberOfLines={1}>
                    {stop.stopName}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Moving Live Bus Marker */}
        <Pressable
          onPress={onBusMarkerPress}
          style={[
            styles.busMarker,
            shadows.lg,
            {
              top: `${15 + busProgress * 70}%`,
              left: `${35 + (busProgress % 0.2) * 40}%`,
            },
          ]}>
          <View style={styles.busRipple} />
          <View style={styles.busMarkerBody}>
            <Text style={styles.busMarkerIcon}>🚍</Text>
          </View>
          <View style={styles.busBadgeLabel}>
            <Text style={styles.busBadgeText}>{busNumber}</Text>
          </View>
        </Pressable>

        {/* Campus Destination Target */}
        <View style={[styles.destinationContainer, { top: '85%', left: '52%' }]}>
          <Text style={styles.destIcon}>🎓</Text>
          <Text style={styles.destText}>SKIT Campus</Text>
        </View>

        {/* Top Floating Map Controls / Metrics */}
        <View style={styles.floatingTopBar}>
          <View style={[styles.liveStatusChip, shadows.sm]}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.liveStatusText}>LIVE GPS TRACKING</Text>
          </View>

          <View style={[styles.speedChip, shadows.sm]}>
            <Text style={styles.speedText}>⚡ {speedKmH} km/h</Text>
          </View>
        </View>

        {/* Map Simulation Controls Overlay */}
        <View style={styles.controlsBottomRight}>
          <Pressable
            onPress={() => setIsSimulating(prev => !prev)}
            style={[styles.controlBtn, shadows.sm]}>
            <Text style={styles.controlBtnText}>
              {isSimulating ? '⏸️ Pause' : '▶️ Live'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setBusProgress(0.42)}
            style={[styles.controlBtn, shadows.sm]}>
            <Text style={styles.controlBtnText}>🎯 Recenter</Text>
          </Pressable>
        </View>

        {/* ETA Overlay Pill */}
        <View style={[styles.floatingEtaCard, shadows.md]}>
          <Text style={styles.floatingEtaLabel}>BUS ETA</Text>
          <Text style={styles.floatingEtaValue}>{etaMinutes} MIN</Text>
          <Text style={styles.floatingEtaSub}>Distance: 2.4 km</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#EAEFF8',
    marginVertical: 10,
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
  },
  gridRoadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#D6E2F5',
  },
  gridRoadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: '#D6E2F5',
  },
  routeLineMain: {
    position: 'absolute',
    top: '15%',
    left: '42%',
    height: '70%',
    width: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    transform: [{ rotate: '-12deg' }],
  },
  routeLineCompleted: {
    position: 'absolute',
    top: '15%',
    left: '42%',
    height: '35%',
    width: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
    transform: [{ rotate: '-12deg' }],
  },
  stopPinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  stopDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  stopDotPassed: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  stopDotPickup: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderColor: colors.primaryDark,
    backgroundColor: colors.primary,
  },
  pickupPulse: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(23, 105, 255, 0.25)',
    position: 'absolute',
    top: -5,
    left: -5,
  },
  stopTooltip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    position: 'absolute',
    left: 22,
    top: -4,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 100,
  },
  stopTooltipTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  stopTooltipName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  busMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  busRipple: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(23, 105, 255, 0.2)',
  },
  busMarkerBody: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  busMarkerIcon: {
    fontSize: 20,
  },
  busBadgeLabel: {
    backgroundColor: colors.text,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  busBadgeText: {
    color: colors.textInverted,
    fontSize: 9,
    fontWeight: '800',
  },
  destinationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  destIcon: {
    fontSize: 14,
  },
  destText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  floatingTopBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  liveStatusChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3,
  },
  speedChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  controlsBottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    gap: 6,
    zIndex: 5,
  },
  controlBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  floatingEtaCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  floatingEtaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 0.5,
  },
  floatingEtaValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textInverted,
  },
  floatingEtaSub: {
    fontSize: 10,
    color: '#E0F2FE',
    marginTop: 1,
  },
});

export default MockMap;
