import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ArrowLeftSvg from '../../assets/svg/arrow-left.svg';
import ArrowRightSvg from '../../assets/svg/arrow-right.svg';
import { colors } from '../colors';

const DayPicker = ({ onBeforePress, onAfterPress, day }) => (
  <View style={styles.container}>
    <ArrowLeftSvg onPress={onBeforePress} />
    <Text style={styles.day}>{day}</Text>
    <ArrowRightSvg onPress={onAfterPress} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  day: {
    fontSize: 19,
    fontWeight: '400',
    color: colors.DARK_BLUE,
    flexGrow: 1,
    textAlign: 'center',
  },
});

export default DayPicker;
