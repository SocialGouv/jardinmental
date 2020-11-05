/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {StatusBar} from 'react-native';

import Router from './src/navigation/router';
import {initStorage} from './src/storage/storage';

const initialContext = {
  diaryData: [],
  setDiaryData: () => {},
};

export const AppContext = React.createContext(initialContext);

const App: () => React$Node = () => {
  const [diaryData, setDiaryData] = useState([]);
  initStorage();
  return (
    <AppContext.Provider value={{diaryData, setDiaryData}}>
      <StatusBar barStyle="dark-content" />
      <Router />
    </AppContext.Provider>
  );
};

export default App;
