/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import NavigationMenu from './src/navigation/navigation-menu';
import Diary from './src/diary/diary';
import Header from './src/header';

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
  },
});

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Header />
          <View style={styles.body}>
            <Diary />
          </View>
        </ScrollView>
      </SafeAreaView>
      <NavigationMenu />
    </>
  );
};

export default App;
