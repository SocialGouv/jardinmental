import React, { useEffect, useState, useRef, useCallback } from "react";
import { ScrollView, StyleSheet, View, Image, Dimensions, Text, TouchableOpacity, Alert } from "react-native";

import { displayedCategories, HELP_ANALYSE, TAB_BAR_HEIGHT, TW_COLORS } from "@/utils/constants";
import Chart from "./chart";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { beforeToday, getArrayOfDates, getTodaySWeek, formatDate } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import { useContext } from "react";
import localStorage from "@/utils/localStorage";
import { LineChart } from "react-native-gifted-charts";
import Icon from "@/components/Icon";
import { colors } from "@/utils/colors";
import { INDICATEURS } from "@/utils/liste_indicateurs.1";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { useBottomSheet } from "@/context/BottomSheetContext";
import WeekPicker from "./week-picker";
import Legend from "../suivi/Legend";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import HelpView from "@/components/HelpView";
import { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const VariationsHeader = ({ day, setDay, scrollY }) => {
  const { showBottomSheet } = useBottomSheet();
  const { firstDay, lastDay } = getTodaySWeek(day);

  const animatedShadowStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { shadowOpacity: 0, elevation: 0 };
    }

    const shadowOpacity = interpolate(scrollY.value, [0, 50], [0, 0.2], Extrapolate.CLAMP);
    const elevation = interpolate(scrollY.value, [0, 50], [0, 8], Extrapolate.CLAMP);

    return { shadowOpacity, elevation };
  });

  return (
    <Animated.View
      style={[
        { paddingHorizontal: 16, backgroundColor: "#FFF" },
        animatedShadowStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          zIndex: 10,
        },
      ]}
    >
      {/* <WeekPicker
        firstDay={firstDay}
        lastDay={lastDay}
        onAfterPress={() => setDay(beforeToday(-7, day))}
        onBeforePress={() => setDay(beforeToday(7, day))}
        setDay={setDay}
      /> */}
      <TouchableOpacity
        onPress={() => {
          showBottomSheet(
            <HelpView isMd={true} title={HELP_ANALYSE["variations"]["title"]} description={HELP_ANALYSE["variations"]["description"]} />
          );
        }}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          elevation: 3,
        }}
        className="self-start bg-cnam-primary-100 p-2 rounded-full mr-2 absolute top-20 right-2"
      >
        <CircleQuestionMark color={TW_COLORS.CNAM_PRIMARY_800} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const TestChart = ({ data }) => {
  const ref = useRef(null);
  const lineData = [
    { value: 1, label: "1 Jan" },
    { value: 5, label: "10 Jan" },
    { value: 5, label: "20 Jan" },
    { value: 2, label: "30 Jan" },
    { value: 4, label: "1 Feb" },
    { value: 1, label: "10 Feb" },
    { value: 3, label: "20 Feb" },
    { value: 3, label: "28 Feb" },
    { value: 1, label: "1 Mar" },
    { value: 1, label: "10 Mar" },
    { value: 1, label: "20 Mar" },
    { value: 0, label: "30 Mar" },
    { value: 4, label: "1 Apr" },
    { value: 3, label: "10 Apr" },
    { value: 2, label: "20 Apr" },
    { value: 2, label: "30 Apr" },
    { value: 2, label: "1 May" },
    { value: 5, label: "10 May" },
    { value: 5, label: "20 May" },
    { value: 1, label: "30 May" },
    { value: 1, label: "1 Jun" },
    { value: 5, label: "10 Jun" },
    { value: 5, label: "20 Jun" },
    { value: 4, label: "30 Jun" },
    { value: 4, label: "1 Jul" },
    { value: 1, label: "10 Jul" },
    { value: 4, label: "20 Jul" },
    { value: 1, label: "30 Jul" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const showOrHidePointer = (ind) => {
    ref.current?.scrollTo({
      x: ind * 200 - 25,
    }); // adjust as per your UI
  };

  return (
    <View className="">
      <View className="mb-4" style={{ flexDirection: "row", marginLeft: 8 }}>
        {months.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                padding: 6,
                margin: 4,
                backgroundColor: "#ebb",
                borderRadius: 8,
              }}
              onPress={() => showOrHidePointer(index)}
            >
              <Text>{months[index]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <LineChart
        yAxisSide={1}
        width={screenWidth - 70}
        focusEnabled={true}
        focusProximity={50}
        // strokeDashArray={[4, 4]}
        // lineSegments={[
        //   { startIndex: 0, endIndex: 1, color: "red", strokeDashArray: [4, 1] },
        //   // { startIndex: 1, endIndex: 2, color: "green" },
        //   // { startIndex: 2, endIndex: 3, color: "orange" },
        // ]}
        onFocus={(item, index) => {
          console.log("focused", item, index);
          // Alert.alert("Value", `Value: ${item.value}, Index: ${index}`);
        }}
        noOfSections={6}
        stepValue={1}
        scrollRef={ref}
        data={data}
        data2={lineData}
        strokeDashArray1={[4, 4]}
        curved={false}
        curvature={0.1}
        initialSpacing={0}
      />
    </View>
  );
};

const Variations = ({ navigation, onScroll, scrollY, day, setDay, dynamicPaddingTop }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [customs, setCustoms] = useState([]);
  const [oldCustoms, setOldCustoms] = useState([]);
  const [calendarIsEmpty, setCalendarIsEmpty] = useState(false);
  const { showBottomSheet } = useBottomSheet();
  let mounted = useRef(true);
  const [userIndicateurs, setUserIndicateurs] = React.useState([]);
  const insets = useSafeAreaInsets();

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

  const twoYearsAgo = beforeToday(40 * 1); // Calculate date from 2 years ago
  const chartDates = getArrayOfDates({ startDate: twoYearsAgo }); // Get all dates from 2 years ago to today

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
        return {
          value: 0,
          hideDataPoint: true,
          label: date,
        };
      }
      const categoryState = diaryData[date][getIndicatorKey(indicateur)];
      if (!categoryState) {
        return {
          value: 0,
          hideDataPoint: true,
          label: date,
        };
      }
      if (indicateur?.type === "boolean") return { value: categoryState?.value === true ? 4 : 0, label: date };
      if (indicateur?.type === "gauge")
        return {
          label: date,
          value: Math.min(Math.floor(categoryState?.value * 5), 4),
        };
      if (categoryState?.value)
        return {
          value: categoryState?.value - 1,
          label: date,
        };

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
        return {
          value: categoryState.level + categoryStateIntensity.level - 2,
          label: date,
        };
      }
      return {
        data: categoryState.level ? categoryState.level - 1 : null,
        label: date,
      };
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
    <View className="flex-1 bg-white">
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
            paddingTop: 260,
          },
        ]}
        onScroll={onScroll}
      >
        {!calendarIsEmpty ? (
          <>
            {userIndicateurs
              .concat(INDICATEURS)
              .filter((ind) => ind.active)
              .splice(2, 1)
              .map((indicateur) => {
                const data = computeChartData(indicateur)
                  .filter((d) => d)
                  .filter((d) => {
                    if (!Number.isFinite(d.value)) {
                      return false;
                    }
                    return true;
                  });
                return isChartVisible(getIndicatorKey(indicateur)) && <TestChart data={data} key={indicateur.name} />;

                // isChartVisible(getIndicatorKey(indicateur)) && (
                //   <Chart
                //     indicateur={indicateur}
                //     title={getTitle(indicateur.name)}
                //     key={indicateur.name}
                //     data={computeChartData(indicateur)}
                //     onPress={(dayIndex) => displayOnlyRequest(indicateur, dayIndex)}
                //   />
                // )
              })}
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
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    minHeight: screenHeight * 0.7,
  },
  title: {
    fontWeight: "700",
    fontSize: 22,
  },
});

export default Variations;
