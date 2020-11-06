import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {displayedCategories} from '../common/constants';
import {beforeToday, getTodaySWeek} from '../services/date/helpers';
import Header from '../common/header';
import Chart from './chart';
import WeekPicker from './week-picker';
import {fakeDiaryData} from '../diary/fake-diary-data';

const Calendar = () => {
  const [day, setDay] = useState(new Date());
  const computeChartData = (category) => {
    return fakeDiaryData.map((diaryItem) => {
      if (!diaryItem.patientState) {
        return null;
      }
      const categoryState = diaryItem.patientState[category];
      if (!categoryState) {
        return null;
      }
      return categoryState.level;
    });
  };

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
        {Object.keys(displayedCategories).map((key) => (
          <Chart
            title={displayedCategories[key]}
            key={key}
            data={computeChartData(key)}
          />
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
