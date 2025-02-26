import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {displayedCategories} from '../../utils/constants';
import {getArrayOfDates, getTodaySWeek} from '../../utils/date/helpers';
import Chart from './chart';
import {DiaryDataContext} from '../../context/diaryData';
import {useContext} from 'react';
import DayTitle from './day-title';
import DiaryItem from '../status/status-item';

const DailyChart = ({
  route: {
    params: {day, indicateur, dayIndex},
  },
  navigation,
}) => {
  const [focused, setFocused] = useState(dayIndex);
  const [diaryDay, setDiaryDay] = useState(day);
  const [diaryData] = useContext(DiaryDataContext);

  const {firstDay} = getTodaySWeek(new Date(day));
  const chartDates = getArrayOfDates({startDate: firstDay, numberOfDays: 6});

  const setFocusedRequest = index => {
    setFocused(index);
    setDiaryDay(chartDates[index]);
  };

  const computeChartData = _indicateur => {
    return chartDates.map(date => {
      const dayData = diaryData[date];
      if (!dayData) {
        return null;
      }
      const categoryState = diaryData[date][_indicateur.name];
      if (!categoryState) {
        return null;
      }
      if (_indicateur?.type === 'boolean') return categoryState?.value === true ? 4 : 0;
      if (indicateur?.type === 'gauge') return Math.min(Math.floor(categoryState?.value * 5), 4);
      if (categoryState?.value) return categoryState?.value - 1;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = _indicateur.name.split('_');
      let categoryStateIntensity = null;
      if (suffix && suffix === 'FREQUENCE') {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || {level: 3};
        return categoryState.level + categoryStateIntensity.level - 2;
      }
      return categoryState.level ? categoryState.level - 1 : null;
    });
  };

  const displayTitle = () => {
    const [categoryName] = indicateur.name.split('_');
    return displayedCategories[indicateur.name] || categoryName;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <DayTitle day={diaryDay} onBackPress={navigation.goBack} />
        <Chart indicateur={indicateur} title={displayTitle()} data={computeChartData(indicateur)} withFocus focused={focused} onPress={setFocusedRequest} />
        <View style={styles.spacer} />
        <DiaryItem date={diaryDay} patientState={diaryData[diaryDay]} navigation={navigation} />
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
