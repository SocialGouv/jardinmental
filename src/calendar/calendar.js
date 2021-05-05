import React, {useEffect, useState, useRef} from 'react';
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
import logEvents from '../services/logEvents';
import localStorage from '../utils/localStorage';
import Text from '../components/MyText';

const Calendar = ({navigation}) => {
  const [day, setDay] = useState(new Date());
  const [diaryData] = useContext(DiaryDataContext);
  const [customs, setCustoms] = useState([]);
  let mounted = useRef(true);

  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t && mounted) setCustoms(t);
    })();
    return () => (mounted = false);
  }, [diaryData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      logEvents.logCalendarOpen();
    });

    return unsubscribe;
  }, [navigation]);

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

  const isChartVisible = (categoryId) => {
    let visible = false;
    chartDates.forEach((date) => {
      if (!diaryData[date]) {
        return;
      }
      if (!diaryData[date][categoryId]) {
        return;
      }
      visible = true;
    });
    return visible;
  };

  const getTitle = (cat) => {
    const category = displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split('_');
    if (suffix && suffix === 'FREQUENCE') {
      return categoryName;
    }
    return category;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <Header title="Calendrier" navigation={navigation} />

        <WeekPicker
          firstDay={firstDay}
          lastDay={lastDay}
          onAfterPress={() => setDay(beforeToday(-7, day))}
          onBeforePress={() => setDay(beforeToday(7, day))}
        />
        {Object.keys(displayedCategories)
          .concat(customs)
          .map(
            (categoryId) =>
              isChartVisible(categoryId) && (
                <Chart
                  title={getTitle(categoryId)}
                  key={categoryId}
                  data={computeChartData(categoryId)}
                  onPress={(dayIndex) =>
                    displayOnlyRequest(categoryId, dayIndex)
                  }
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
