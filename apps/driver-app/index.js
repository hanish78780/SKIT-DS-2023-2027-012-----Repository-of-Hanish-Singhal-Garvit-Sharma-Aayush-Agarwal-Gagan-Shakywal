/**
 * @format
 *
 * index.js — Application entry point for UniTransit Driver App
 */

import {AppRegistry} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import App from './App';
import {name as appName} from './app.json';

/**
 * Initialize @react-native-community/geolocation before the app mounts.
 *
 * skipPermissionRequests: true  → We handle Android permissions ourselves
 *                                 via PermissionsAndroid in locationService.ts
 * locationProvider: 'android'   → Use the Android platform location API.
 *                                 Emulator GPS injection reaches this provider.
 */
Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: 'whenInUse',
  locationProvider: 'android',
});

AppRegistry.registerComponent(appName, () => App);
