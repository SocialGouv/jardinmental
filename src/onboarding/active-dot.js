import React from 'react';
import {View, StyleSheet} from 'react-native';

const ActiveDot = () => <View style={styles.activeDot} />;

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: '#1FC6D5',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});

export default ActiveDot;
