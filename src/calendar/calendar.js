import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {displayedCategories} from '../common/constants';
import {
  beforeToday,
  getArrayOfDates,
  getTodaySWeek,
} from '../services/date/helpers';
import Header from '../common/header';
import Chart from './chart';
import WeekPicker from './week-picker';
import {DiaryDataContext} from '../context';
import {useContext} from 'react';

const Calendar = ({navigation}) => {
  const [day, setDay] = useState(new Date());
  const [diaryData] = useContext(DiaryDataContext);

  const {firstDay, lastDay} = getTodaySWeek(day);

  const chartDates = getArrayOfDates({startDate: firstDay, numberOfDays: 6});

  const displayOnlyRequest = (categoryId, dayIndex) => {
    navigation.navigate('chart-day', {
      day: chartDates[dayIndex],
      categoryId,
      dayIndex,
    });
  };

  const computeChartData = (categoryId) => {
    return chartDates.map((date) => {
      const dayData = diaryData[date];
      if (!dayData) {
        return null;
      }
      const categoryState = diaryData[date][categoryId];
      if (!categoryState) {
        return null;
      }
      return categoryState.level - 1;
    });
  };

  const isChartVisible = (categoryId) => {
    let visible = false;
    chartDates.forEach((date) => {
      if (!diaryData[date]) return;
      if (!diaryData[date][categoryId]) return;
      visible = true;
    });
    return visible;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <Header>Calendrier</Header>
        <WeekPicker
          firstDay={firstDay}
          lastDay={lastDay}
          onAfterPress={() => setDay(beforeToday(-7, day))}
          onBeforePress={() => setDay(beforeToday(7, day))}
        />
        {Object.keys(displayedCategories).map(
          (categoryId) =>
            isChartVisible(categoryId) && (
              <Chart
                title={displayedCategories[categoryId]}
                key={categoryId}
                data={computeChartData(categoryId)}
                onPress={(dayIndex) => displayOnlyRequest(categoryId, dayIndex)}
              />
            ),
        )}
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
