import React from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getArrayOfDatesFromTo } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import Text from "@/components/MyText";
import { displayedCategories, TAB_BAR_HEIGHT } from "@/utils/constants";
import { colors } from "@/utils/colors";
import Icon from "@/components/Icon";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import { FriseGraph } from "./FriseGraph";
import JMButton from "@/components/JMButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoalsFriseGraph } from "@/scenes/goals/suivi/GoalsFriseGraph";

import { getIndicatorKey } from "../../../utils/indicatorUtils";
import Animated from "react-native-reanimated";

const screenHeight = Dimensions.get("window").height;

// Simple wrapper for FriseGraph - no async, no caching, just direct data processing
const SimpleFriseGraph = React.memo(
  ({
    title,
    categoryId,
    focusedScores,
    showTraitement,
    chartDates,
    diaryData,
  }: {
    title: string;
    categoryId: string;
    focusedScores: any[];
    showTraitement: boolean;
    chartDates: string[];
    diaryData: any;
  }) => {
    // Simple synchronous data processing - no chunking, no async
    const data = React.useMemo(() => {
      return chartDates.map((date) => {
        const dayData = diaryData[date];
        if (!dayData || !dayData[categoryId]) {
          return {};
        }
        const categoryState = dayData[categoryId];

        // Simple value extraction
        if (categoryState?.value !== null && categoryState?.value !== undefined) {
          return categoryState;
        }

        // Simplified retrocompatibility
        const [categoryName, suffix] = categoryId.split("_");
        if (suffix === "FREQUENCE") {
          const intensity = dayData[`${categoryName}_INTENSITY`] || { level: 3 };
          return { value: (categoryState as any).level + (intensity as any).level - 2 };
        }
        return { value: (categoryState as any).level - 1 };
      });
    }, [chartDates, diaryData, categoryId]);

    // Simple treatment data processing
    const treatmentData = React.useMemo(() => {
      if (!showTraitement) return [];
      return chartDates.map((date) => {
        const dayData = diaryData[date];
        return dayData?.["PRISE_DE_TRAITEMENT"] || {};
      });
    }, [chartDates, diaryData, showTraitement]);

    const treatmentSiBesoinData = React.useMemo(() => {
      if (!showTraitement) return [];
      return chartDates.map((date) => {
        const dayData = diaryData[date];
        return dayData?.["PRISE_DE_TRAITEMENT_SI_BESOIN"] || {};
      });
    }, [chartDates, diaryData, showTraitement]);

    return (
      <FriseGraph
        title={title}
        data={data}
        focusedScores={focusedScores}
        showTraitement={showTraitement}
        priseDeTraitement={treatmentData}
        priseDeTraitementSiBesoin={treatmentSiBesoinData}
      />
    );
  }
);

const FriseGraphList = ({ navigation, fromDate, toDate, focusedScores, showTraitement, onScroll, dynamicPaddingTop }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [userIndicateurs, setUserIndicateurs] = React.useState<any[]>([]);
  const [isEmpty, setIsEmpty] = React.useState<boolean>(false);
  const [goalsIsEmpty, setGoalsIsEmpty] = React.useState<boolean>(false);

  const chartDates = React.useMemo(() => getArrayOfDatesFromTo({ fromDate, toDate }), [fromDate, toDate]);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, [])
  );

  const isChartVisible = React.useCallback(
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

  React.useEffect(() => {
    if (!userIndicateurs) return;
    const empty = userIndicateurs.every((ind) => !isChartVisible(getIndicatorKey(ind)));
    setIsEmpty(empty);
  }, [userIndicateurs, isChartVisible]);

  const startSurvey = async () => {
    logEvents._deprecatedLogFeelingStart();
    if (!userIndicateurs) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day", {
        origin: "no_data_frises",
      });
    }
  };

  const getTitle = (cat) => {
    const category = displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split("_");
    if (suffix && suffix === "FREQUENCE") {
      return categoryName;
    }
    return category;
  };

  // Simple synchronous data processing for goals
  const computeChartData = React.useCallback(
    (categoryId) => {
      return chartDates.map((date) => {
        const dayData = diaryData[date];
        if (!dayData || !dayData[categoryId]) {
          return {};
        }
        const categoryState = dayData[categoryId];

        if (categoryState?.value !== null && categoryState?.value !== undefined) {
          return categoryState;
        }

        // Simplified retrocompatibility
        const [categoryName, suffix] = categoryId.split("_");
        if (suffix === "FREQUENCE") {
          const intensity = dayData[`${categoryName}_INTENSITY`] || { level: 3 };
          return { value: (categoryState as any).level + (intensity as any).level - 2 };
        }
        return { value: (categoryState as any).level - 1 };
      });
    },
    [chartDates, diaryData]
  );

  if (isEmpty && goalsIsEmpty) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
            paddingTop: 120,
          },
        ]}
      >
        <View style={styles.subtitleContainer}>
          <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} styleContainer={{}} spin={false} onPress={() => {}} />
          <Text style={styles.subtitle}>
            Des <Text style={styles.bold}>frises</Text> apparaîtront au fur et à mesure de vos saisies quotidiennes.
          </Text>
        </View>
        <JMButton title="Commencer à saisir" onPress={startSurvey} />
      </View>
    );
  }

  return (
    <>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 150,
            paddingTop: 170 + dynamicPaddingTop,
          },
        ]}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
      >
        {userIndicateurs
          ?.filter((ind) => isChartVisible(getIndicatorKey(ind)) && ind.active)
          ?.map((ind) => (
            <SimpleFriseGraph
              key={ind.name}
              title={getTitle(ind.name)}
              categoryId={getIndicatorKey(ind)}
              focusedScores={focusedScores}
              showTraitement={showTraitement}
              chartDates={chartDates}
              diaryData={diaryData}
            />
          ))}
        <GoalsFriseGraph
          {...{ chartDates, focusedScores }}
          showTraitement={showTraitement}
          priseDeTraitement={computeChartData("PRISE_DE_TRAITEMENT")}
          priseDeTraitementSiBesoin={computeChartData("PRISE_DE_TRAITEMENT_SI_BESOIN")}
          onIsEmptyChanged={setGoalsIsEmpty}
        />
      </Animated.ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  triangle: {
    color: "#F8FDFE",
  },
  close: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderColor: "#D4F0F2",
    borderWidth: 1,
    zIndex: 2,
    width: 32,
    height: 32,
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  squareItemContainer: {
    display: "flex",
    flex: 1,
    height: 10,
  },
  squareItemContainerTraitement: {
    marginTop: 5,
    display: "flex",
    flex: 1,
    height: 4,
  },
  square: {
    flex: 1,
    height: 10,
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
    backgroundColor: "white",
  },
  scrollContainer: {
    minHeight: screenHeight,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT_BLUE,
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    shadowColor: "#0A215C",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});

export default FriseGraphList;
