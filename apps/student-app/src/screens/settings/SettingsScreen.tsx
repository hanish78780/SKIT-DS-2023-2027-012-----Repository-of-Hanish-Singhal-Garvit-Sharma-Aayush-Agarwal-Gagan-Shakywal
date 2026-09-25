import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Alert } from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';

interface SettingsScreenProps {
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  const [busArrivalAlerts, setBusArrivalAlerts] = useState(true);
  const [delayAlerts, setDelayAlerts] = useState(true);
  const [routeChangeAlerts, setRouteChangeAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Do you wish to log out from UniTransit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure preferences & transit notifications</Text>
      </View>

      {/* Notification Preferences Card */}
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.sectionTitle}>Notification Alerts</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Bus Arrival Proximity Alerts</Text>
            <Text style={styles.settingSub}>Alert 10 minutes before bus reaches your stop</Text>
          </View>
          <Switch
            value={busArrivalAlerts}
            onValueChange={setBusArrivalAlerts}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Delay & Traffic Updates</Text>
            <Text style={styles.settingSub}>Notify if assigned bus is delayed by more than 5 mins</Text>
          </View>
          <Switch
            value={delayAlerts}
            onValueChange={setDelayAlerts}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Route Change Notices</Text>
            <Text style={styles.settingSub}>Updates on detour or stop changes</Text>
          </View>
          <Switch
            value={routeChangeAlerts}
            onValueChange={setRouteChangeAlerts}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Emergency & Safety Broadcasts</Text>
            <Text style={styles.settingSub}>High priority alerts from SKIT Transport</Text>
          </View>
          <Switch
            value={emergencyAlerts}
            onValueChange={setEmergencyAlerts}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      {/* App Info Card */}
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.sectionTitle}>About UniTransit</Text>
        <Text style={styles.infoText}>App Version: 1.0.0 (Build 102)</Text>
        <Text style={styles.infoText}>Campus: SKIT Jaipur (Swami Keshwanand Institute of Technology)</Text>

        <Pressable onPress={handleLogout} style={styles.logoutRow}>
          <Text style={styles.logoutText}>Sign Out from Account</Text>
        </Pressable>
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
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  settingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  logoutRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
});

export default SettingsScreen;
