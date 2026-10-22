import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import PrimaryButton from '../../components/PrimaryButton';
import {mockBus, mockDriver, mockRoute} from '../../constants/mockData';
import colors from '../../theme/colors';
import {shadows} from '../../theme/tokens';

interface DriverProfileScreenProps {
  onLogout: () => void;
}

const DriverProfileScreen: React.FC<DriverProfileScreenProps> = ({onLogout}) => {
  const menuItems = [
    {id: '1', title: 'Change Password', icon: '🔒', detail: 'Update login credentials'},
    {id: '2', title: 'Vehicle Inspection Checklist', icon: '🔧', detail: 'Pre-trip safety check'},
    {id: '3', title: 'SKIT Transport Helpline', icon: '📞', detail: '+91 141 275 2165'},
    {id: '4', title: 'App Settings & Language', icon: '⚙️', detail: 'English (US)'},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Driver Profile" subtitle="Account Settings & Vehicle" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, shadows.medium]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>RK</Text>
          </View>

          <Text style={styles.driverName}>{mockDriver.name}</Text>
          <Text style={styles.driverIdTag}>Driver ID: {mockDriver.id}</Text>

          <View style={styles.licenseBadge}>
            <Text style={styles.licenseText}>
              License: {mockDriver.licenseNumber}
            </Text>
          </View>
        </View>

        {/* Assigned Details Summary */}
        <View style={[styles.card, shadows.soft]}>
          <Text style={styles.cardTitle}>Assigned Vehicle & Route</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned Bus</Text>
            <Text style={styles.detailValue}>{mockBus.busNumber} ({mockBus.busTag})</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned Route</Text>
            <Text style={styles.detailValue}>{mockRoute.routeName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile Contact</Text>
            <Text style={styles.detailValue}>{mockDriver.phone}</Text>
          </View>
        </View>

        {/* Settings Menu List */}
        <View style={[styles.card, shadows.soft]}>
          <Text style={styles.cardTitle}>Account & Support</Text>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <View style={styles.divider} />}
              <Pressable
                accessibilityRole="button"
                style={({pressed}) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuTextGroup}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDetail}>{item.detail}</Text>
                </View>
                <Text style={styles.menuChevron}>›</Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>

        {/* Logout Action */}
        <PrimaryButton
          title="LOGOUT SESSION"
          variant="danger"
          onPress={onLogout}
          style={styles.logoutBtn}
        />

        <Text style={styles.versionText}>UniTransit Driver Portal • v1.2.0 (Build 42)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '900',
  },
  driverName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  driverIdTag: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  licenseBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  licenseText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  menuDetail: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  menuChevron: {
    color: colors.textMuted,
    fontSize: 20,
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: 4,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 16,
  },
});

export default DriverProfileScreen;
