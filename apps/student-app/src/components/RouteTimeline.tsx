import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';
import { RouteStop } from '../types';

interface RouteTimelineProps {
  stops: RouteStop[];
  studentPickupStopName: string;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  stops,
  studentPickupStopName,
}) => {
  return (
    <View style={styles.container}>
      {stops.map((stop, idx) => {
        const isLast = idx === stops.length - 1;
        const isPickup =
          stop.isStudentPickup || stop.stopName.includes(studentPickupStopName);

        const getStatusBadge = () => {
          if (stop.status === 'passed') {
            return {
              icon: '✓',
              bg: colors.successLight,
              border: colors.success,
              text: colors.successDark,
            };
          }
          if (stop.status === 'current') {
            return {
              icon: '🚍',
              bg: colors.primaryLight,
              border: colors.primary,
              text: colors.primaryDark,
            };
          }
          return {
            icon: `${stop.stopNumber}`,
            bg: colors.background,
            border: colors.borderDark,
            text: colors.textSecondary,
          };
        };

        const badge = getStatusBadge();

        return (
          <View key={stop.id} style={styles.stopRow}>
            {/* Left Timeline Line & Dot */}
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.nodeBadge,
                  { backgroundColor: badge.bg, borderColor: badge.border },
                  isPickup && styles.pickupNodeBadge,
                ]}>
                <Text
                  style={[
                    styles.nodeIconText,
                    { color: badge.text },
                    isPickup && styles.pickupIconText,
                  ]}>
                  {badge.icon}
                </Text>
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.verticalLine,
                    stop.status === 'passed' && styles.linePassed,
                  ]}
                />
              )}
            </View>

            {/* Right Details Card */}
            <View
              style={[
                styles.detailsCard,
                shadows.sm,
                isPickup && styles.pickupCard,
              ]}>
              <View style={styles.cardHeader}>
                <View style={styles.nameRow}>
                  <Text
                    style={[
                      styles.stopName,
                      isPickup && styles.pickupStopName,
                    ]}>
                    {stop.stopName}
                  </Text>
                </View>
                <Text style={styles.timeText}>{stop.scheduledTime}</Text>
              </View>

              <View style={styles.cardFooter}>
                {isPickup ? (
                  <View style={styles.yourStopTag}>
                    <Text style={styles.yourStopTagText}>★ YOUR PICKUP STOP</Text>
                  </View>
                ) : (
                  <Text style={styles.stopStatusText}>
                    {stop.status === 'passed'
                      ? 'Completed'
                      : stop.status === 'current'
                      ? 'Bus At Stop / Next'
                      : 'Scheduled Stop'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stopRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineLeft: {
    width: 44,
    alignItems: 'center',
  },
  nodeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pickupNodeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  nodeIconText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pickupIconText: {
    color: colors.textInverted,
    fontSize: 14,
  },
  verticalLine: {
    width: 3,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  linePassed: {
    backgroundColor: colors.success,
  },
  detailsCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 8,
  },
  pickupCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameRow: {
    flex: 1,
    paddingRight: 8,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  pickupStopName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  cardFooter: {
    marginTop: 6,
  },
  yourStopTag: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  yourStopTagText: {
    color: colors.textInverted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  stopStatusText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

export default RouteTimeline;
