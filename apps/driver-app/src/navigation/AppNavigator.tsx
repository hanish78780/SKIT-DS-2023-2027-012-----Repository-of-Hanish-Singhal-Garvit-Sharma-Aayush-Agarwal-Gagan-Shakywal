import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import BottomNavigation, {NavTab} from '../components/BottomNavigation';
import LoginScreen from '../screens/auth/LoginScreen';
import DriverDashboardScreen from '../screens/dashboard/DriverDashboardScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import DriverProfileScreen from '../screens/profile/DriverProfileScreen';
import RouteStudentsScreen from '../screens/route/RouteStudentsScreen';
import SplashScreen from '../screens/splash/SplashScreen';
import ActiveTripScreen from '../screens/trip/ActiveTripScreen';
import TripSummaryModal from '../screens/trip/TripSummaryModal';
import {TripState} from '../types/driver';
import colors from '../theme/colors';

type ScreenState = 'SPLASH' | 'AUTH' | 'MAIN';

const AppNavigator: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>('SPLASH');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [driverId, setDriverId] = useState<string>('DRV-001');
  const [tripState, setTripState] = useState<TripState>('NOT_STARTED');
  const [showTripSummaryModal, setShowTripSummaryModal] = useState<boolean>(false);

  const handleFinishSplash = () => {
    setScreenState('AUTH');
  };

  const handleLoginSuccess = (id: string) => {
    setDriverId(id);
    setScreenState('MAIN');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setTripState('NOT_STARTED');
    setScreenState('AUTH');
    setActiveTab('dashboard');
  };

  const handleToggleTrip = () => {
    if (tripState === 'NOT_STARTED') {
      setTripState('TRIP_STARTED');
      setActiveTab('activeTrip');
    } else {
      setTripState('NOT_STARTED');
      setShowTripSummaryModal(true);
    }
  };

  const renderActiveTabScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DriverDashboardScreen
            driverId={driverId}
            tripState={tripState}
            onToggleTrip={handleToggleTrip}
            onLogout={handleLogout}
            onNavigateTab={tab => setActiveTab(tab)}
          />
        );
      case 'activeTrip':
        return (
          <ActiveTripScreen
            tripState={tripState}
            onStopTrip={handleToggleTrip}
            onNavigateToStudents={() => setActiveTab('students')}
          />
        );
      case 'students':
        return <RouteStudentsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <DriverProfileScreen onLogout={handleLogout} />;
      default:
        return (
          <DriverDashboardScreen
            driverId={driverId}
            tripState={tripState}
            onToggleTrip={handleToggleTrip}
            onLogout={handleLogout}
            onNavigateTab={tab => setActiveTab(tab)}
          />
        );
    }
  };

  if (screenState === 'SPLASH') {
    return <SplashScreen onFinishSplash={handleFinishSplash} />;
  }

  if (screenState === 'AUTH') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderActiveTabScreen()}</View>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        unreadCount={2}
      />

      <TripSummaryModal
        visible={showTripSummaryModal}
        onClose={() => setShowTripSummaryModal(false)}
        onViewDetails={() => setActiveTab('students')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});

export default AppNavigator;
