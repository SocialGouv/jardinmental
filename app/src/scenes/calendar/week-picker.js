import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import ArrowLeftSvg from '../../../assets/svg/arrow-left.js';
import ArrowRightSvg from '../../../assets/svg/arrow-right.js';
import {colors} from '../../utils/colors';
import {months, shortMonths, isAfterToday} from '../../utils/date/helpers';
import Text from '../../components/MyText';

const WeekPicker = ({
  onBeforePress,
  onAfterPress,
  firstDay,
  lastDay,
  setDay,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBeforePress} style={styles.button}>
        <ArrowLeftSvg />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setDay(new Date())}
        style={styles.contentContainer}>
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
      </TouchableOpacity>
      {/* if it is in the futur, we hide and disabled the button */}
      <TouchableOpacity
        onPress={(e) => !isAfterToday(lastDay) && onAfterPress(e)}
        style={styles.button}>
        <ArrowRightSvg
          color={isAfterToday(lastDay) ? 'transparent' : colors.LIGHT_BLUE}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexGrow: 0,
  },
  content: {
    color: colors.DARK_BLUE,
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
