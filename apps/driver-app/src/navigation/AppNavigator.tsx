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
import {useLocation} from '../hooks/useLocation';

type ScreenState = 'SPLASH' | 'AUTH' | 'MAIN';

const AppNavigator: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>('SPLASH');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [driverId, setDriverId] = useState<string>('DRV-001');
  const [tripState, setTripState] = useState<TripState>('NOT_STARTED');
  const [showTripSummaryModal, setShowTripSummaryModal] = useState<boolean>(false);

  // Active trip & driver credentials for API location upload
  const [activeTripId] = useState<string>('6ad90873078dc055e14277ee');
  const [authToken] = useState<string>('driver_dev_auth_jwt_token');

  // GPS foreground location hook – shared across Dashboard and ActiveTrip
  const {locationState, uploadState, startTracking, stopTracking} = useLocation({
    tripId: activeTripId,
    authToken,
    uploadIntervalMs: 5000,
  });

  const handleFinishSplash = () => {
    setScreenState('AUTH');
  };

  const handleLoginSuccess = (id: string) => {
    setDriverId(id);
    setScreenState('MAIN');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    // Stop GPS tracking and abort in-flight uploads when driver logs out
    stopTracking();
    setTripState('NOT_STARTED');
    setScreenState('AUTH');
    setActiveTab('dashboard');
  };

  const handleToggleTrip = () => {
    if (tripState === 'NOT_STARTED') {
      // Start trip → request GPS, initiate API upload, and navigate to ActiveTrip
      setTripState('TRIP_STARTED');
      setActiveTab('activeTrip');
      startTracking({
        tripId: activeTripId,
        authToken,
      });
    } else {
      // Stop trip → stop GPS, abort uploads, and show summary
      stopTracking();
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
            locationState={locationState}
            onToggleTrip={handleToggleTrip}
            onLogout={handleLogout}
            onNavigateTab={tab => setActiveTab(tab)}
          />
        );
      case 'activeTrip':
        return (
          <ActiveTripScreen
            tripState={tripState}
            locationState={locationState}
            uploadState={uploadState}
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
            locationState={locationState}
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
