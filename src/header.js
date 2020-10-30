import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {colors} from './colors';

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon journal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    paddingBottom: 30,
    color: colors.BLUE,
    fontWeight: '700',
  },
});

export default Header;
