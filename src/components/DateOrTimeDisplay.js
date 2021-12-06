/* eslint-disable quotes */
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {makeSureDate, makeSureTimestamp} from '../utils/date/helpers';
import Text from './MyText';
import {isToday} from 'date-fns';
import {colors} from '../utils/colors';

const DateOrTimeDisplay = ({date, onPress, mode}) => {
  if (!date) return null;

  return (
    <View style={styles.datesContainer}>
      {Boolean(date) && (
        <TouchableOpacity onPress={() => onPress(mode)}>
          <View style={styles.currentDateContainer}>
            {mode === 'date' && (
              <Text style={styles.currentDate}>
                {isToday(makeSureTimestamp(date))
                  ? "Aujourd'hui"
                  : makeSureDate(date).getLocaleDate('fr')}
              </Text>
            )}
            {mode === 'time' && (
              <Text style={styles.currentDate}>
                {makeSureDate(date).getLocaleTime('fr')}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  datesContainer: {
    flexDirection: 'row',
    margin: 6,
  },
  currentDateContainer: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  currentDate: {
    color: '#f9f9f9',
  },
});

export default DateOrTimeDisplay;
