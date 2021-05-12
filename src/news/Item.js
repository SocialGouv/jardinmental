import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../common/colors';
import Text from '../components/MyText';

export default ({children}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dot}>• </Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
  },
  content: {flex: 1},
  dot: {color: colors.LIGHT_BLUE},
});
