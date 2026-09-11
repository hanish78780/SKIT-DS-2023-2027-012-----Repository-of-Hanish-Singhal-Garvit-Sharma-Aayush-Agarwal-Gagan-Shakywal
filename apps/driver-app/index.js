/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
console.log('*** INDEX.JS EXECUTING, APPNAME:', appName);

AppRegistry.registerComponent(appName, () => App);

