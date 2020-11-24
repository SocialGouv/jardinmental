import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {displayedCategories} from '../common/constants';
import {getArrayOfDates, getTodaySWeek} from '../services/date/helpers';
import Chart from './chart';
import {DiaryDataContext} from '../context';
import {useContext} from 'react';
import DayTitle from './day-title';
import DiaryItem from '../diary/diary-item';

const DailyChart = ({
  route: {
    params: {day, categoryId, dayIndex},
  },
  navigation,
}) => {
  const [focused, setFocused] = useState(dayIndex);
  const [diaryDay, setDiaryDay] = useState(day);
  const [diaryData] = useContext(DiaryDataContext);

  const {firstDay} = getTodaySWeek(new Date(day));
  const chartDates = getArrayOfDates({startDate: firstDay, numberOfDays: 6});

  const setFocusedRequest = (index) => {
    setFocused(index);
    setDiaryDay(chartDates[index]);
  };

  const computeChartData = () => {
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <DayTitle day={new Date(diaryDay)} onBackPress={navigation.goBack} />
        <Chart
          title={displayedCategories[categoryId]}
          data={computeChartData()}
          withFocus
          focused={focused}
          onPress={setFocusedRequest}
        />
        <View style={styles.spacer} />
        <DiaryItem date={diaryDay} patientState={diaryData[diaryDay]} />
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
  spacer: {
    height: 30,
  },
  scrollContainer: {
    paddingBottom: 150,
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
  },
});

export default DailyChart;
