import React, { useEffect, useState, useRef, useCallback } from "react";
import { ScrollView, StyleSheet, View, Image, Dimensions, Text, TouchableOpacity } from "react-native";

import { displayedCategories, HELP_ANALYSE, TAB_BAR_HEIGHT, TW_COLORS } from "@/utils/constants";
import Chart from "./chart";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { beforeToday, getArrayOfDates, getTodaySWeek, formatDate } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import { useContext } from "react";
import localStorage from "@/utils/localStorage";

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
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

const screenHeight = Dimensions.get("window").height;

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
        { paddingHorizontal: 16, backgroundColor: TW_COLORS.CNAM_PRIMARY_25 },
        animatedShadowStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          zIndex: 10,
        },
      ]}
    >
      <WeekPicker
        firstDay={firstDay}
        lastDay={lastDay}
        onAfterPress={() => setDay(beforeToday(-7, day))}
        onBeforePress={() => setDay(beforeToday(7, day))}
        setDay={setDay}
      />
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
    <View className="flex-1 bg-cnam-primary-25">
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
            paddingTop: 260,
            backgroundColor: TW_COLORS.CNAM_PRIMARY_25,
          },
        ]}
        onScroll={onScroll}
      >
        {!calendarIsEmpty ? (
          <>
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
            <View
              className="bg-cnam-primary-25"
              style={{
                position: "relative",
                paddingTop: 35,
                paddingBottom: 200,
              }}
            >
              <View>
                <View className="absolute z-1 w-full items-center">
                  <View className={"bg-cnam-primary-100 h-[150] w-[150] rounded-full items-center justify-center"} style={{ top: 20 }}></View>
                </View>
              </View>
              <View className="px-4 z-20">
                <Image
                  style={{ width: 80, height: 80, right: -150, top: 60, resizeMode: "contain" }}
                  source={require("../../../assets/imgs/illustration-no-note.png")}
                />
              </View>
              <View className={mergeClassNames("border border-cnam-primary-200 rounded-2xl p-4 py-6 bg-white", "mt-12")} style={{ borderWidth: 0.5 }}>
                <>
                  <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
                    Il n’y a pas de données à afficher pour cette période.
                  </Text>
                  <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-center px-4 mt-4")}>
                    Des courbes d’évolutions apparaîtront au fur et à mesure de vos saisies.
                  </Text>
                </>
              </View>
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
