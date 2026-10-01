import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';
import {shadows} from '../theme/tokens';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import StatusBadge from './StatusBadge';

export type TripState = 'NOT_STARTED' | 'TRIP_STARTED';

interface TripStatusCardProps {
  tripState: TripState;
  onToggleTrip: () => void;
  onViewActiveTrip?: () => void;
}

const TripStatusCard: React.FC<TripStatusCardProps> = ({
  tripState,
  onToggleTrip,
  onViewActiveTrip,
}) => {
  const isStarted = tripState === 'TRIP_STARTED';

  return (
    <View
      style={[
        styles.card,
        shadows.medium,
        isStarted && styles.cardActive,
      ]}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Trip Status</Text>
        <StatusBadge status={isStarted ? 'ACTIVE' : 'NOT_STARTED'} />
      </View>

      <Text style={styles.description}>
        {isStarted
          ? 'Live GPS broadcasting active. Student app is receiving real-time vehicle updates.'
          : 'Ready to begin assigned route. Tap below to start broadcasting live location.'}
      </Text>

      {isStarted ? (
        <View style={styles.actionRow}>
          <PrimaryButton
            title="STOP TRIP"
            variant="danger"
            onPress={onToggleTrip}
            style={styles.flexBtn}
          />
          {onViewActiveTrip && (
            <SecondaryButton
              title="Live View"
              onPress={onViewActiveTrip}
              style={styles.secondaryBtn}
            />
          )}
        </View>
      ) : (
        <PrimaryButton
          title="START TRIP"
          variant="primary"
          onPress={onToggleTrip}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,
  },
  cardActive: {
    borderColor: colors.successBorder,
    backgroundColor: '#FAFFFC',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flexBtn: {
    flex: 1,
  },
  secondaryBtn: {
    width: 96,
  },
});

export default TripStatusCard;
