/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.log('*** INDEX.JS EXECUTING, APPNAME:', appName);

AppRegistry.registerComponent(appName, () => App);

