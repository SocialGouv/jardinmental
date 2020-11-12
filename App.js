import 'react-native-gesture-handler';
import React from 'react';

import Router from './src/navigation/router';
import {DiaryDataProvider} from './src/context';

const App = () => (
  <DiaryDataProvider>
    <Router />
  </DiaryDataProvider>
);

export default App;
