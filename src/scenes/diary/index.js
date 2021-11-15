import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import Text from '../../components/MyText';

export default () => {
  return (
    <SafeAreaView style={styles.safe}>
      <Text>Bientôt disponible !</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
