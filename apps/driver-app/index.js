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
 * locationProvider: 'android'   → Use Android's fused location provider
 *                                 (more reliable than raw GPS on emulators)
 */
Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: 'whenInUse',
  locationProvider: 'android',
});

AppRegistry.registerComponent(appName, () => App);
