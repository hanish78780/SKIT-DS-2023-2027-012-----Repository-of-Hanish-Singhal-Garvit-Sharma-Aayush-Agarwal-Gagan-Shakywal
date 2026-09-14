import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import colors from '../../theme/colors';
import shadows from '../../theme/shadows';
import StudentProfileCard from '../../components/StudentProfileCard';
import SecondaryButton from '../../components/SecondaryButton';
import LoadingState from '../../components/LoadingState';
import MockApiService from '../../services/mockApi';
import { StudentProfile } from '../../types';

interface ProfileScreenProps {
  onNavigateSettings: () => void;
  onNavigateHelp: () => void;
  onNavigateReportIssue: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigateSettings,
  onNavigateHelp,
  onNavigateReportIssue,
  onLogout,
}) => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await MockApiService.getStudentProfile();
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !student) {
    return <LoadingState message="Loading student profile details..." />;
  }

  const handleConfirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out of Student App?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Profile</Text>
        <Text style={styles.subtitle}>SKIT Jaipur Transportation Credentials</Text>
      </View>

      {/* Main Student Profile Card */}
      <StudentProfileCard student={student} />

      {/* Transportation Pass Status Card */}
      <View style={[styles.card, shadows.sm]}>
        <View style={styles.passHeader}>
          <Text style={styles.passTitle}>SKIT Bus Transit Pass</Text>
          <View style={styles.activePassBadge}>
            <Text style={styles.activePassText}>ACTIVE</Text>
          </View>
        </View>
        <View style={styles.passGrid}>
          <View style={styles.passItem}>
            <Text style={styles.passLabel}>Route</Text>
            <Text style={styles.passValue}>{student.assignedRouteNumber}</Text>
          </View>
          <View style={styles.passItem}>
            <Text style={styles.passLabel}>Bus Number</Text>
            <Text style={styles.passValue}>{student.assignedBusNumber}</Text>
          </View>
          <View style={styles.passItem}>
            <Text style={styles.passLabel}>Pickup Stop</Text>
            <Text style={styles.passValue} numberOfLines={1}>{student.pickupStopName}</Text>
          </View>
          <View style={styles.passItem}>
            <Text style={styles.passLabel}>Validity</Text>
            <Text style={styles.passValue}>Academic Year 2026</Text>
          </View>
        </View>
      </View>

      {/* Action Navigation Menu */}
      <View style={[styles.card, shadows.sm]}>
        <Text style={styles.menuTitle}>Account Actions</Text>

        <Pressable onPress={onNavigateSettings} style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>App Settings & Alerts</Text>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <Pressable onPress={onNavigateHelp} style={styles.menuItem}>
          <Text style={styles.menuIcon}>🆘</Text>
          <Text style={styles.menuText}>Help & Safety Center</Text>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <Pressable onPress={onNavigateReportIssue} style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚠️</Text>
          <Text style={styles.menuText}>Report Transport Issue</Text>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      </View>

      {/* Logout Button */}
      <SecondaryButton
        title="Sign Out of UniTransit"
        onPress={handleConfirmLogout}
        style={styles.logoutBtn}
        textStyle={styles.logoutText}
      />
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
    marginBottom: 12,
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
    marginVertical: 6,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  passTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  activePassBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activePassText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successDark,
  },
  passGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  passItem: {
    width: '46%',
  },
  passLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  passValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: 16,
    backgroundColor: colors.errorLight,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: colors.errorDark,
  },
});

export default ProfileScreen;
