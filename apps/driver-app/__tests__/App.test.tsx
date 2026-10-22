/**
 * @format
 *
 * App.test.tsx – top-level rendering smoke test.
 *
 * Mounts the full App (which renders AppNavigator → SplashScreen)
 * and verifies no uncaught errors during mount / unmount.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock @react-native-community/geolocation so it doesn't try to call native
jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(() => 0),
    clearWatch: jest.fn(),
    stopObserving: jest.fn(),
  },
}));

test('App renders and unmounts without errors', async () => {
  let component: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    component = ReactTestRenderer.create(<App />);
  });

  // Unmount cleanly (ensures GPS watcher cleanup runs)
  await ReactTestRenderer.act(async () => {
    component.unmount();
  });
});
