import React, {useState} from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';

interface UserState {
  driverId: string;
}

const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<UserState | null>(null);

  const handleLoginSuccess = (driverId: string) => {
    setUser({driverId});
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <DriverDashboardScreen
      driverId={user.driverId}
      onLogout={handleLogout}
    />
  );
};

export default AppNavigator;
