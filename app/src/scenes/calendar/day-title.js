import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {formatDate} from '../../utils/date/helpers';
import Text from '../../components/MyText';
import BackButton from '../../components/BackButton';

const DayTitle = ({onBackPress, day}) => {
  return (
    <View style={styles.container}>
      <BackButton onPress={onBackPress} />
      <Text style={styles.content}>
        <Text style={styles.day}>{formatDate(day)}</Text>
      </Text>
      <View style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    color: colors.DARK_BLUE,
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '400',
  },
  day: {
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  month: {
    textTransform: 'lowercase',
    fontStyle: 'italic',
  },
  button: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DayTitle;
