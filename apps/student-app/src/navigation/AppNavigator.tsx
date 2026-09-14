import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../theme/colors';
import shadows from '../theme/shadows';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import LiveTrackingScreen from '../screens/tracking/LiveTrackingScreen';
import MyRouteScreen from '../screens/route/MyRouteScreen';
import BusDetailsScreen from '../screens/bus/BusDetailsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ReportIssueScreen from '../screens/issue/ReportIssueScreen';
import HelpSafetyScreen from '../screens/help/HelpSafetyScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

export type MainTab = 'Home' | 'Track' | 'Route' | 'Notifications' | 'Profile';
export type ActiveScreen = MainTab | 'BusDetails' | 'ReportIssue' | 'Help' | 'Settings';

export const AppNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('Home');
  const [activeTab, setActiveTab] = useState<MainTab>('Home');

  const handleSelectTab = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveScreen(tab);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen('Home');
    setActiveTab('Home');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return (
          <HomeScreen
            onNavigateTrack={() => handleSelectTab('Track')}
            onNavigateRoute={() => handleSelectTab('Route')}
            onNavigateBusDetails={() => setActiveScreen('BusDetails')}
            onNavigateNotifications={() => handleSelectTab('Notifications')}
            onNavigateReportIssue={() => setActiveScreen('ReportIssue')}
            onNavigateHelp={() => setActiveScreen('Help')}
            onNavigateProfile={() => handleSelectTab('Profile')}
          />
        );
      case 'Track':
        return (
          <LiveTrackingScreen
            onNavigateRoute={() => handleSelectTab('Route')}
          />
        );
      case 'Route':
        return <MyRouteScreen />;
      case 'BusDetails':
        return <BusDetailsScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      case 'ReportIssue':
        return <ReportIssueScreen />;
      case 'Help':
        return <HelpSafetyScreen />;
      case 'Profile':
        return (
          <ProfileScreen
            onNavigateSettings={() => setActiveScreen('Settings')}
            onNavigateHelp={() => setActiveScreen('Help')}
            onNavigateReportIssue={() => setActiveScreen('ReportIssue')}
            onLogout={handleLogout}
          />
        );
      case 'Settings':
        return <SettingsScreen onLogout={handleLogout} />;
      default:
        return (
          <HomeScreen
            onNavigateTrack={() => handleSelectTab('Track')}
            onNavigateRoute={() => handleSelectTab('Route')}
            onNavigateBusDetails={() => setActiveScreen('BusDetails')}
            onNavigateNotifications={() => handleSelectTab('Notifications')}
            onNavigateReportIssue={() => setActiveScreen('ReportIssue')}
            onNavigateHelp={() => setActiveScreen('Help')}
            onNavigateProfile={() => handleSelectTab('Profile')}
          />
        );
    }
  };

  const isMainTab = ['Home', 'Track', 'Route', 'Notifications', 'Profile'].includes(
    activeScreen
  );

  return (
    <View style={styles.container}>
      {/* Top Secondary Header Bar for Stack Screens */}
      {!isMainTab && (
        <View style={styles.backHeader}>
          <Pressable
            onPress={() => setActiveScreen(activeTab)}
            style={styles.backButton}>
            <Text style={styles.backChevron}>←</Text>
            <Text style={styles.backText}>Back to {activeTab}</Text>
          </Pressable>
        </View>
      )}

      {/* Main Screen Body */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomTabBar, shadows.lg]}>
        <TabItem
          icon="🏠"
          label="Home"
          isActive={activeTab === 'Home' && isMainTab}
          onPress={() => handleSelectTab('Home')}
        />
        <TabItem
          icon="🗺️"
          label="Track"
          isActive={activeTab === 'Track' && isMainTab}
          onPress={() => handleSelectTab('Track')}
        />
        <TabItem
          icon="📍"
          label="Route"
          isActive={activeTab === 'Route' && isMainTab}
          onPress={() => handleSelectTab('Route')}
        />
        <TabItem
          icon="🔔"
          label="Alerts"
          isActive={activeTab === 'Notifications' && isMainTab}
          onPress={() => handleSelectTab('Notifications')}
        />
        <TabItem
          icon="👤"
          label="Profile"
          isActive={activeTab === 'Profile' && isMainTab}
          onPress={() => handleSelectTab('Profile')}
        />
      </View>
    </View>
  );
};

interface TabItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, isActive, onPress }) => (
  <Pressable onPress={onPress} style={styles.tabItem}>
    <View style={[styles.tabIconBadge, isActive && styles.tabIconBadgeActive]}>
      <Text style={styles.tabIcon}>{icon}</Text>
    </View>
    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backChevron: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  screenContainer: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIconBadge: {
    width: 36,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconBadgeActive: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});

export default AppNavigator;
