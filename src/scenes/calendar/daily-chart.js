import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {displayedCategories} from '../../utils/constants';
import {getArrayOfDates, getTodaySWeek} from '../../utils/date/helpers';
import Chart from './chart';
import {DiaryDataContext} from '../../context/diaryData';
import {useContext} from 'react';
import DayTitle from './day-title';
import DiaryItem from '../status/status-item';

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
      if (categoryState?.value) return categoryState?.value - 1;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = categoryId.split('_');
      let categoryStateIntensity = null;
      if (suffix && suffix === 'FREQUENCE') {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][
          `${categoryName}_INTENSITY`
        ] || {level: 3};
        return categoryState.level + categoryStateIntensity.level - 2;
      }
      return categoryState.level - 1;
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <DayTitle day={diaryDay} onBackPress={navigation.goBack} />
        <Chart
          title={displayedCategories[categoryId]}
          data={computeChartData(categoryId)}
          withFocus
          focused={focused}
          onPress={setFocusedRequest}
        />
        <View style={styles.spacer} />
        <DiaryItem
          date={diaryDay}
          patientState={diaryData[diaryDay]}
          navigation={navigation}
        />
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
