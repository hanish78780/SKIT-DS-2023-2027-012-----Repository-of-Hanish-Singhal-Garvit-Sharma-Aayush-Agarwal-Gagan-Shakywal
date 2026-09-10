import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
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


