import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import LoginScreen from './src/screens/auth/LoginScreen';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
});

export default App;


