import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import colors from '../../theme/colors';
import {shadows} from '../../theme/tokens';

interface TripSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onViewDetails?: () => void;
}

const TripSummaryModal: React.FC<TripSummaryModalProps> = ({
  visible,
  onClose,
  onViewDetails,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, shadows.strong]}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeIcon}>🎉</Text>
          </View>

          <Text style={styles.title}>Trip Completed!</Text>
          <Text style={styles.subtitle}>
            Your morning route broadcast has ended successfully.
          </Text>

          {/* Statistics Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>42m</Text>
              <Text style={styles.statLabel}>Trip Duration</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>22.8 km</Text>
              <Text style={styles.statLabel}>Total Distance</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>31 / 32</Text>
              <Text style={styles.statLabel}>Students Picked Up</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>8 / 8</Text>
              <Text style={styles.statLabel}>Stops Completed</Text>
            </View>
          </View>

          <PrimaryButton
            title="Back to Dashboard"
            onPress={onClose}
            style={styles.mainBtn}
          />

          {onViewDetails && (
            <SecondaryButton
              title="View Route Details"
              onPress={() => {
                onClose();
                onViewDetails();
              }}
              style={styles.detailsBtn}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  headerBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  headerBadgeIcon: {
    fontSize: 32,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  statBox: {
    width: '47%',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  mainBtn: {
    width: '100%',
  },
  detailsBtn: {
    width: '100%',
    marginTop: 10,
  },
});

export default TripSummaryModal;
