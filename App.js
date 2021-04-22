import 'react-native-gesture-handler';
import React from 'react';

import Router from './src/navigation/router';
import {DiaryDataProvider} from './src/context';
import NPS from './src/services/NPS/NPS';
import VersionChecker from './src/services/versionChecker';
import {Sentry} from 'react-native-sentry';

if (!__DEV__) {
  Sentry.config(
    'https://9f0bd8f8af8444eea9f470d00a1bb411@sentry.fabrique.social.gouv.fr/54',
  ).install();
}

const App = () => (
  <DiaryDataProvider>
    <VersionChecker />
    <Router />
    <NPS />
  </DiaryDataProvider>
);

export default App;
