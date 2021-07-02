import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import ArrowLeftSvg from '../../assets/svg/arrow-left.svg';
import ArrowRightSvg from '../../assets/svg/arrow-right.svg';
import {colors} from '../utils/colors';
import {months, shortMonths} from '../utils/date/helpers';
import Text from '../components/MyText';

const WeekPicker = ({onBeforePress, onAfterPress, firstDay, lastDay}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBeforePress} style={styles.button}>
        <ArrowLeftSvg />
      </TouchableOpacity>
      <Text style={styles.content}>
        {firstDay.getMonth() === lastDay.getMonth() ? (
          <>
            <Text style={styles.day}>
              {`${firstDay.getDate()} - ${lastDay.getDate()}  `}
            </Text>
            <Text style={styles.month}>{months[firstDay.getMonth()]}</Text>
          </>
        ) : (
          <>
            <Text style={styles.day}>{`${firstDay.getDate()} `}</Text>
            <Text style={styles.month}>
              {`${shortMonths[firstDay.getMonth()]} - `}
            </Text>
            <Text style={styles.day}>{`${lastDay.getDate()} `}</Text>
            <Text style={styles.month}>
              {`${shortMonths[lastDay.getMonth()]}`}
            </Text>
          </>
        )}
      </Text>
      <TouchableOpacity onPress={onAfterPress} style={styles.button}>
        <ArrowRightSvg />
      </TouchableOpacity>
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

export default WeekPicker;
