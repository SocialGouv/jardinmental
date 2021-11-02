import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from 'react-native';
import {displayedCategories} from '../../utils/constants';
import {
  beforeToday,
  getArrayOfDates,
  getTodaySWeek,
  formatDate,
} from '../../utils/date/helpers';
import Header from '../../components/Header';
import Chart from './chart';
import WeekPicker from './week-picker';
import {DiaryDataContext} from '../../context';
import {useContext} from 'react';
import logEvents from '../../services/logEvents';
import localStorage from '../../utils/localStorage';
import Text from '../../components/MyText';
import Icon from '../../components/Icon';
import {colors} from '../../utils/colors';
const screenHeight = Dimensions.get('window').height;

const Calendar = ({navigation}) => {
  const [day, setDay] = useState(new Date());
  const [diaryData] = useContext(DiaryDataContext);
  const [customs, setCustoms] = useState([]);
  const [oldCustoms, setOldCustoms] = useState([]);
  const [calendarIsEmpty, setCalendarIsEmpty] = useState(true);
  let mounted = useRef(true);

  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      if (c && mounted) setCustoms(c);

      //retrocompatibility
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t && mounted) setOldCustoms(t);
    })();
    return () => (mounted = false);
  }, [diaryData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      logEvents.logCalendarOpen();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const emptyCalendar = !Object.keys(displayedCategories)
      .concat(customs)
      .concat(oldCustoms)
      .reduce((showing, categoryId) => {
        return Boolean(isChartVisible(categoryId)) || showing;
      }, false);
    setCalendarIsEmpty(emptyCalendar);
  }, [day, customs, oldCustoms, isChartVisible]);

  const {firstDay, lastDay} = getTodaySWeek(day);

  const chartDates = getArrayOfDates({startDate: firstDay, numberOfDays: 6});

  const displayOnlyRequest = (categoryId, dayIndex) => {
    if (Date.parse(new Date(chartDates[dayIndex])) > Date.now()) return; // if clicked day is in the future, don't display it
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
      if (typeof categoryState === 'number') return categoryState - 1;

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

  const isChartVisible = useCallback(
    (categoryId) => {
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
    },
    [diaryData, chartDates],
  );

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
        <Header title="Courbes" navigation={navigation} />

        <WeekPicker
          firstDay={firstDay}
          lastDay={lastDay}
          onAfterPress={() => setDay(beforeToday(-7, day))}
          onBeforePress={() => setDay(beforeToday(7, day))}
          setDay={setDay}
        />
        {!calendarIsEmpty ? (
          <>
            <View style={styles.subtitleContainer}>
              <Icon
                icon="InfoSvg"
                width={25}
                height={25}
                color={colors.LIGHT_BLUE}
              />
              <Text style={styles.subtitle}>
                Tapez sur un jour ou un point pour retrouver une{' '}
                <Text style={styles.bold}>vue détaillée</Text>.
              </Text>
            </View>
            {Object.keys(displayedCategories)
              .concat(customs)
              .concat(oldCustoms)
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
          </>
        ) : (
          <>
            <View style={styles.subtitleContainer}>
              <Icon
                icon="InfoSvg"
                width={25}
                height={25}
                color={colors.LIGHT_BLUE}
              />
              <Text style={styles.subtitle}>
                Des <Text style={styles.bold}>courbes d'évolution</Text> de vos
                symptômes apparaîtront au fur et à mesure de vos saisies
                quotidiennes.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require('../../../assets/imgs/calendar.png')}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    height: screenHeight * 0.5,
    resizeMode: 'contain',
  },
  subtitle: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    fontWeight: 'normal',
  },
  subtitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
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
