import React from 'react';
import {StyleSheet, View} from 'react-native';

export default ({style}) => <View style={[styles.separator, style]} />;

const styles = StyleSheet.create({
  separator: {
    borderColor: '#eee',
    borderTopWidth: 1,
    marginHorizontal: 30,
  },
});
