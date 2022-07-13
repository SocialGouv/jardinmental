import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { APP_ENV } from '../config';

const EnvironmentIndicator = () => {
  if (APP_ENV === 'production') return null;

  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} allow style={styles.text}>
        {APP_ENV}
      </Text>
    </View>
  );
};

export default EnvironmentIndicator;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    right: 20,
    zIndex: 9999,
    color: 'red',
    fontSize: 16,
  },
  text: {
    color: 'red',
  },
});
