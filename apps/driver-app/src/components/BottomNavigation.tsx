import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../theme/colors';

export type NavTab = 'dashboard' | 'activeTrip' | 'students' | 'notifications' | 'profile';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount?: number;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 2,
}) => {
  const tabs: {id: NavTab; label: string; icon: string}[] = [
    {id: 'dashboard', label: 'Home', icon: '🏠'},
    {id: 'activeTrip', label: 'Trip', icon: '🚌'},
    {id: 'students', label: 'Students', icon: '👥'},
    {id: 'notifications', label: 'Alerts', icon: '🔔'},
    {id: 'profile', label: 'Profile', icon: '👤'},
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{selected: isActive}}
            onPress={() => onTabChange(tab.id)}
            style={styles.tabItem}>
            <View style={styles.iconWrapper}>
              <Text style={[styles.iconText, isActive && styles.iconActive]}>
                {tab.icon}
              </Text>
              {tab.id === 'notifications' && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 2,
  },
  iconText: {
    fontSize: 18,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
    transform: [{scale: 1.1}],
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
});

export default BottomNavigation;
