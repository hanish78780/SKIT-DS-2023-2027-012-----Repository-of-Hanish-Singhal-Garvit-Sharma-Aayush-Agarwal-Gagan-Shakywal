import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import MockApiService from '../../services/mockApi';
import { BusDetails } from '../../types';

export const BusDetailsScreen: React.FC = () => {
  const [bus, setBus] = useState<BusDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const data = await MockApiService.getAssignedBus();
        setBus(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, []);

  if (loading || !bus) {
    return <LoadingState message="Fetching bus specifications & driver information..." />;
  }

  const handleCallDriver = () => {
    Alert.alert('Call Driver', `Call ${bus.driver.name} at ${bus.driver.phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Now', onPress: () => Linking.openURL(`tel:${bus.driver.phone}`) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Main Vehicle Header Card */}
      <View style={[styles.card, shadows.md]}>
        <View style={styles.headerRow}>
          <View style={styles.busIconCircle}>
            <Text style={styles.busIconText}>🚍</Text>
          </View>
          <View style={styles.busHeaderCol}>
            <Text style={styles.busNumber}>{bus.busNumber}</Text>
            <Text style={styles.busModel}>{bus.model}</Text>
          </View>
          <StatusBadge status={bus.status} />
        </View>

        <View style={styles.divider} />

        <View style={styles.specGrid}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Registration No.</Text>
            <Text style={styles.specValue}>{bus.registrationNumber}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Seating Capacity</Text>
            <Text style={styles.specValue}>{bus.capacity} Passengers</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Coach Type</Text>
            <Text style={styles.specValue}>{bus.busType}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Current Speed</Text>
            <Text style={styles.specValueHighlight}>{bus.currentSpeedKmH} km/h</Text>
          </View>
        </View>
      </View>

      {/* Driver Information Card */}
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.sectionTitle}>Transport Driver Information</Text>
        <Text style={styles.sectionSub}>Only transportation-relevant operational details are displayed.</Text>

        <View style={styles.driverProfileBox}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>{bus.driver.name.charAt(0)}</Text>
          </View>

          <View style={styles.driverInfoCol}>
            <Text style={styles.driverName}>{bus.driver.name}</Text>
            <Text style={styles.driverMeta}>Driver ID: {bus.driver.driverId}</Text>
            <Text style={styles.driverMeta}>Experience: {bus.driver.experienceYears} Years</Text>
            <Text style={styles.driverRatingText}>Rating: ★ {bus.driver.rating} / 5.0</Text>
          </View>

          <Pressable onPress={handleCallDriver} style={styles.callButton}>
            <Text style={styles.callIcon}>📞</Text>
            <Text style={styles.callText}>Call</Text>
          </Pressable>
        </View>
      </View>

      {/* Safety & Compliance Card */}
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.sectionTitle}>Safety & Inspection Status</Text>
        <View style={styles.safetyRow}>
          <Text style={styles.safetyCheck}>✓ GPS Telematics Device Active</Text>
          <Text style={styles.safetyCheck}>✓ Speed Governor Limited (40 km/h)</Text>
          <Text style={styles.safetyCheck}>✓ Daily Pre-Trip Mechanical Checked</Text>
          <Text style={styles.safetyCheck}>✓ First-Aid Box & Extinguisher Onboard</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  busIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busIconText: {
    fontSize: 28,
  },
  busHeaderCol: {
    flex: 1,
  },
  busNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  busModel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  specItem: {
    width: '45%',
  },
  specLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  specValueHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  driverProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    color: colors.textInverted,
    fontSize: 20,
    fontWeight: '700',
  },
  driverInfoCol: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  driverMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  driverRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warningDark,
    marginTop: 2,
  },
  callButton: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  callIcon: {
    fontSize: 14,
  },
  callText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.successDark,
  },
  safetyRow: {
    gap: 8,
  },
  safetyCheck: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.successDark,
  },
});

export default BusDetailsScreen;
