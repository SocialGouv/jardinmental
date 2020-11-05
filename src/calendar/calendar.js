import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {categories} from '../common/constants';
import {getTodaySWeek, beforeToday} from '../services/date/helpers';
import Header from '../common/header';
import Chart from './chart';
import WeekPicker from './week-picker';

const Calendar = () => {
  const [day, setDay] = useState(new Date());

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <Header>Calendrier</Header>
        <WeekPicker
          {...getTodaySWeek(day)}
          onAfterPress={() => setDay(beforeToday(-7, day))}
          onBeforePress={() => setDay(beforeToday(7, day))}
        />
        {Object.keys(categories).map((key) => (
          <Chart title={categories[key]} key={key} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    padding: 20,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 150,
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
  },
});

export default Calendar;
