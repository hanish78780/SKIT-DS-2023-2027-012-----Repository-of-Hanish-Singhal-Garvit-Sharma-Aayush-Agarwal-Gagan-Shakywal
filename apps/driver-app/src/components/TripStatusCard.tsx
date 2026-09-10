import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

export type TripState = 'NOT_STARTED' | 'TRIP_STARTED';

interface TripStatusCardProps {
  tripState: TripState;
  onToggleTrip: () => void;
}

const TripStatusCard: React.FC<TripStatusCardProps> = ({
  tripState,
  onToggleTrip,
}) => {
  const isStarted = tripState === 'TRIP_STARTED';

  return (
    <View style={[styles.card, isStarted && styles.cardActive]}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Current Trip Status</Text>
        <View
          style={[
            styles.statusBadge,
            isStarted ? styles.badgeActive : styles.badgeInactive,
          ]}>
          <View
            style={[
              styles.statusDot,
              isStarted ? styles.dotActive : styles.dotInactive,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isStarted ? styles.textActive : styles.textInactive,
            ]}>
            {isStarted ? 'ACTIVE' : 'NOT STARTED'}
          </Text>
        </View>
      </View>

      <Text style={styles.statusDescription}>
        {isStarted
          ? 'Trip is currently active. Live updates are broadcasting to students.'
          : 'Ready to begin assigned route. Tap below to start trip.'}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isStarted ? 'Stop Trip' : 'Start Trip'}
        onPress={onToggleTrip}
        style={({pressed}) => [
          styles.actionButton,
          isStarted ? styles.stopButton : styles.startButton,
          pressed &&
            (isStarted
              ? styles.stopButtonPressed
              : styles.startButtonPressed),
        ]}>
        <Text style={styles.actionButtonText}>
          {isStarted ? 'STOP TRIP' : 'START TRIP'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 20,
  },
  cardActive: {
    borderColor: colors.success,
    backgroundColor: '#FAFFFC',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeInactive: {
    backgroundColor: colors.warningBg,
  },
  badgeActive: {
    backgroundColor: colors.successBg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotInactive: {
    backgroundColor: colors.warning,
  },
  dotActive: {
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textInactive: {
    color: colors.warning,
  },
  textActive: {
    color: colors.success,
  },
  statusDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  actionButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: colors.primary,
  },
  startButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  stopButton: {
    backgroundColor: colors.error,
  },
  stopButtonPressed: {
    backgroundColor: '#C92A2A',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default TripStatusCard;
