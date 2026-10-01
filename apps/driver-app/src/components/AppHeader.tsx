import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogout?: boolean;
  onLogout?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'UniTransit',
  subtitle = 'SKIT Jaipur • Driver Portal',
  showLogout = false,
  onLogout,
  showBack = false,
  onBack,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {showBack && onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.skitBadge}>
            <Text style={styles.skitBadgeText}>SKIT</Text>
          </View>
        )}
        <View style={styles.titleGroup}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      </View>

      {showLogout && onLogout && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Logout"
          onPress={onLogout}
          style={({pressed}) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 22,
    color: colors.text,
    fontWeight: '700',
  },
  skitBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.skitMaroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: colors.skitGold,
  },
  skitBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleGroup: {
    justifyContent: 'center',
  },
  titleText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitleText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: -1,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorBg,
  },
  logoutButtonPressed: {
    backgroundColor: colors.error,
  },
  logoutText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default AppHeader;
