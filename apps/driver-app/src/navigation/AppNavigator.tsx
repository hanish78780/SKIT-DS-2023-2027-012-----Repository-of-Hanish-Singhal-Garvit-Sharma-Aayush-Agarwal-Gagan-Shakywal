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
import {AuthSession} from '../services/authApi';
import colors from '../theme/colors';
import {useLocation} from '../hooks/useLocation';

type ScreenState = 'SPLASH' | 'AUTH' | 'MAIN';

const AppNavigator: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>('SPLASH');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [driverId, setDriverId] = useState<string>('');
  const [authToken, setAuthToken] = useState<string>('');
  const [tripState, setTripState] = useState<TripState>('NOT_STARTED');
  const [showTripSummaryModal, setShowTripSummaryModal] =
    useState<boolean>(false);

  // Temporary trip ID. We will replace this with the driver's actual assigned trip.
  const [activeTripId] = useState<string>('6ad90873078dc055e14277ee');

  const {
    locationState,
    uploadState,
    startTracking,
    stopTracking,
  } = useLocation({
    tripId: activeTripId,
    authToken,
    uploadIntervalMs: 5000,
  });

  const handleFinishSplash = () => {
    setScreenState('AUTH');
  };

  const handleLoginSuccess = (session: AuthSession) => {
    setDriverId(session.user.id);
    setAuthToken(session.token);
    setTripState('NOT_STARTED');
    setActiveTab('dashboard');
    setScreenState('MAIN');
  };

  const handleLogout = () => {
    stopTracking();

    setTripState('NOT_STARTED');
    setAuthToken('');
    setDriverId('');
    setShowTripSummaryModal(false);
    setActiveTab('dashboard');
    setScreenState('AUTH');
  };

  const handleToggleTrip = () => {
    if (tripState === 'NOT_STARTED') {
      if (!authToken) {
        setScreenState('AUTH');
        return;
      }

      setTripState('TRIP_STARTED');
      setActiveTab('activeTrip');

      startTracking({
        tripId: activeTripId,
        authToken,
      });
    } else {
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
      <View style={styles.screenContainer}>
        {renderActiveTabScreen()}
      </View>

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