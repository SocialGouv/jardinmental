import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../utils/colors';
import Text from '../../components/MyText';

export default ({showDot = true, children}) => {
  return (
    <View style={styles.container}>
      {showDot ? <Text style={styles.dot}>• </Text> : null}
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
