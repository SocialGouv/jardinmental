/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Notifications from './src/services/notifications';
import './src/services/date/polyfill';

Notifications.init();

AppRegistry.registerComponent(appName, () => App);
