import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function App() {
  console.log('*** APP IS RENDERING ***');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>UniTransit Driver App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#000000',
  },
});

export default App;
