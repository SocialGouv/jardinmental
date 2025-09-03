import React, { useEffect, useState, useRef, useCallback } from "react";
import { ScrollView, StyleSheet, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { displayedCategories } from "../../utils/constants";
import { beforeToday, getArrayOfDates, getTodaySWeek, formatDate } from "../../utils/date/helpers";
import Header from "../../components/Header";
import Chart from "./chart";
import WeekPicker from "./week-picker";
import { DiaryDataContext } from "../../context/diaryData";
import { useContext } from "react";
import logEvents from "../../services/logEvents";
import localStorage from "../../utils/localStorage";
import Text from "../../components/MyText";
import Icon from "../../components/Icon";
import { colors } from "../../utils/colors";
const screenHeight = Dimensions.get("window").height;
import { INDICATEURS } from "../../utils/liste_indicateurs.1";
import { getIndicatorKey } from "../../utils/indicatorUtils";
import Legend from "../suivi/Legend";

const Calendar = ({ navigation }) => {
  const [day, setDay] = useState(new Date());
  const [diaryData] = useContext(DiaryDataContext);
  const [customs, setCustoms] = useState([]);
  const [oldCustoms, setOldCustoms] = useState([]);
  const [calendarIsEmpty, setCalendarIsEmpty] = useState(false);
  let mounted = useRef(true);
  const [userIndicateurs, setUserIndicateurs] = React.useState([]);

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
    (async () => {
      const user_indicateurs = await localStorage.getIndicateurs();
      if (user_indicateurs) {
        setUserIndicateurs(user_indicateurs);
      }
    })();
  }, []);

  useEffect(() => {
    const emptyCalendar = !userIndicateurs
      .concat(INDICATEURS)
      .reduce((acc, curr) => {
        if (!acc.find((a) => a === getIndicatorKey(curr))) {
          acc.push(getIndicatorKey(curr));
        }
        return acc;
      }, [])
      .reduce((showing, categoryId) => {
        return Boolean(isChartVisible(categoryId)) || showing;
      }, false);
    setCalendarIsEmpty(emptyCalendar);
  }, [day, customs, oldCustoms, isChartVisible, userIndicateurs]);

  const { firstDay, lastDay } = getTodaySWeek(day);

  const chartDates = getArrayOfDates({ startDate: firstDay, numberOfDays: 6 });

  const displayOnlyRequest = (indicateur, dayIndex) => {
    if (Date.parse(new Date(chartDates[dayIndex])) > Date.now()) return; // if clicked day is in the future, don't display it
    navigation.navigate("chart-day", {
      day: chartDates[dayIndex],
      indicateur,
      dayIndex,
    });
  };

  const computeChartData = (indicateur) => {
    return chartDates.map((date) => {
      const dayData = diaryData[date];
      if (!dayData) {
        return null;
      }
      const categoryState = diaryData[date][getIndicatorKey(indicateur)];
      if (!categoryState) {
        return null;
      }
      if (indicateur?.type === "boolean") return categoryState?.value === true ? 4 : 0;
      if (indicateur?.type === "gauge") return Math.min(Math.floor(categoryState?.value * 5), 4);
      if (categoryState?.value) return categoryState?.value - 1;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = getIndicatorKey(indicateur).split("_");
      let categoryStateIntensity = null;
      if (suffix && suffix === "FREQUENCE") {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
        return categoryState.level + categoryStateIntensity.level - 2;
      }
      return categoryState.level ? categoryState.level - 1 : null;
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
    [diaryData, chartDates]
  );

  const getTitle = (cat) => {
    const category = displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split("_");
    if (suffix && suffix === "FREQUENCE") {
      return categoryName;
    }
    return category;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        {/* <Header title="Mon suivi" navigation={navigation} /> */}
        <WeekPicker
          firstDay={firstDay}
          lastDay={lastDay}
          onAfterPress={() => setDay(beforeToday(-7, day))}
          onBeforePress={() => setDay(beforeToday(7, day))}
          setDay={setDay}
        />
        <Legend />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        {!calendarIsEmpty ? (
          <>
            <View style={styles.subtitleContainer}>
              <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
              <Text style={styles.subtitle}>
                Tapez sur un jour ou un point pour retrouver une <Text style={styles.bold}>vue détaillée</Text>.
              </Text>
            </View>
            {userIndicateurs
              .concat(INDICATEURS)
              .filter((ind) => ind.active)
              .map(
                (indicateur) =>
                  isChartVisible(getIndicatorKey(indicateur)) && (
                    <Chart
                      indicateur={indicateur}
                      title={getTitle(indicateur.name)}
                      key={indicateur.name}
                      data={computeChartData(indicateur)}
                      onPress={(dayIndex) => displayOnlyRequest(indicateur, dayIndex)}
                    />
                  )
              )}
          </>
        ) : (
          <>
            <View style={styles.subtitleContainer}>
              <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
              <Text style={styles.subtitle}>
                Des <Text style={styles.bold}>courbes d'évolution</Text> apparaîtront au fur et à mesure de vos saisies quotidiennes.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={require("../../../assets/imgs/calendar.png")} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 5,
    paddingBottom: 0,
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    height: screenHeight * 0.5,
    resizeMode: "contain",
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  scrollContainer: {},
  title: {
    fontWeight: "700",
    fontSize: 22,
  },
});

export default Calendar;
