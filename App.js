import 'react-native-gesture-handler';
import React from 'react';

import Router from './src/navigation/router';
import {DiaryDataProvider} from './src/context';
import NPS from './src/services/NPS/NPS';

const App = () => (
  <DiaryDataProvider>
    <Router />
    <NPS />
  </DiaryDataProvider>
);

export default App;
