import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getArrayOfDatesFromTo } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import { displayedCategories, scoresMapIcon, TAB_BAR_HEIGHT, yesNoMapIcon } from "@/utils/constants";
import { colors } from "@/utils/colors";
import Icon from "@/components/Icon";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import { GoalsChartPie } from "../goals/suivi/GoalsChartPie";
import JMButton from "@/components/JMButton";
import { TW_COLORS } from "@/utils/constants";
import { Indicator } from "@/entities/Indicator";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { Pie } from "./Pie";
import { PieYesNo } from "./PieYesNo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CircledIcon from "@/components/CircledIcon";
import Animated from "react-native-reanimated";

const screenHeight = Dimensions.get("window").height;

const ChartPie = ({ navigation, fromDate, toDate, onScroll, header, dynamicPaddingTop }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState([]);
  const [userIndicateurs, setUserIndicateurs] = React.useState<Indicator[]>([]);
  const [chartDates, setChartDates] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState();
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

  React.useEffect(() => {
    if (!fromDate || !toDate) return;
    setChartDates(getArrayOfDatesFromTo({ fromDate, toDate }));
  }, [fromDate, toDate]);

  React.useEffect(() => {
    if (!userIndicateurs || userIndicateurs.length === 0) return;
    const empty = userIndicateurs.every((ind) => {
      const isVisible = !isChartVisible(getIndicatorKey(ind));
      return isVisible;
    });
    setIsEmpty(empty);
  }, [userIndicateurs, isChartVisible]);

  const isChartVisible = React.useCallback(
    (indicatorId) => {
      let visible = false;
      chartDates.forEach((date) => {
        if (!diaryData[date]) {
          return;
        }
        if (!diaryData[date][indicatorId]) {
          return;
        }
        visible = true;
      });
      return visible;
    },
    [diaryData, chartDates]
  );

  const startSurvey = () => {
    logEvents._deprecatedLogFeelingStart();
    if (!userIndicateurs) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day", {
        origin: "no_data_statistique",
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

  const computeChartData = (categoryId) => {
    return chartDates.map((date) => {
      const dayData = diaryData[date];
      if (!dayData) {
        return 0;
      }
      const categoryState = diaryData[date][categoryId];
      if (!categoryState) {
        return 0;
      }
      if (categoryState?.value) return categoryState.value;
      if (categoryState?.value === false) return categoryState.value;

      // -------
      // the following code is for the retrocompatibility
      // -------
      if (!categoryState.value && !categoryState.level) {
        // fix black portion in chartpie
        // if level does not exist don't try to compute anything with
        // it results in Nan
        return 0;
      }
      // get the name and the suffix of the category
      const [categoryName, suffix] = categoryId.split("_");
      let categoryStateIntensity = null;
      if (suffix && suffix === "FREQUENCE") {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
        return categoryState.level + categoryStateIntensity.level - 2;
      }
      return categoryState.level - 1;
    });
  };

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.subtitleContainer}>
          <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
          <Text style={styles.subtitle}>
            Des <Text style={styles.bold}>statistiques</Text> apparaîtront au fur et à mesure de vos saisies quotidiennes.
          </Text>
        </View>
        <JMButton title="Commencer à saisir" onPress={startSurvey} />
      </View>
    );
  }

  return (
    <Animated.ScrollView
      style={styles.scrollView}
      scrollEventThrottle={16}
      className={"flex-1"}
      StickyHeaderComponent={header}
      contentContainerStyle={[
        styles.scrollContainer,
        {
          paddingTop: 180 + dynamicPaddingTop,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
        },
      ]}
      // stickyHeaderIndices={[0]}
      // stickyHeaderHiddenOnScroll={true}
      // StickyHeaderComponent={() => [header]}
      onScroll={onScroll}
      showsVerticalScrollIndicator={false}
    >
      {/* {header} */}
      {userIndicateurs
        ?.filter((ind) => isChartVisible(getIndicatorKey(ind)) && ind.active)
        ?.map((_indicateur, index) => {
          const isReverse = _indicateur?.order === "DESC";
          if (_indicateur?.type === "boolean")
            return (
              <PieYesNo
                key={index}
                indicateur={_indicateur}
                title={getTitle(_indicateur.name)}
                data={computeChartData(getIndicatorKey(_indicateur))}
                parialsColors={[
                  { color: "#f3f3f3" },
                  {
                    color: isReverse ? yesNoMapIcon["false"].color : yesNoMapIcon["true"].color,
                    symbol: isReverse ? yesNoMapIcon["false"].symbol : yesNoMapIcon["true"].symbol,
                  },
                  {
                    color: isReverse ? yesNoMapIcon["true"].color : yesNoMapIcon["false"].color,
                    symbol: isReverse ? yesNoMapIcon["true"].symbol : yesNoMapIcon["false"].symbol,
                  },
                ]}
              />
            );
          return (
            <View className="border-b border-cnam-primary-400 py-4">
              <Pie
                indicateur={_indicateur}
                title={getTitle(_indicateur.name)}
                key={_indicateur.name}
                data={computeChartData(getIndicatorKey(_indicateur))}
              />
            </View>
          );
        })}
      <GoalsChartPie chartDates={chartDates} />
      <PieYesNo title="Ai-je pris correctement mon traitement quotidien ?" data={computeChartData("PRISE_DE_TRAITEMENT")} />
      <PieYesNo title='Ai-je pris un "si besoin" ?' data={computeChartData("PRISE_DE_TRAITEMENT_SI_BESOIN")} />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  yesLabel: {
    color: "#5956E8",
    fontSize: 15,
  },
  noLabel: {
    fontSize: 15,
    color: "#E575F8",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 30,
    width: "50%",
    alignSelf: "center",
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
  },
  bold: {
    fontWeight: "bold",
  },
  averageIconsContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    flex: 1,
    alignItems: "stretch",
    display: "flex",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  contentCategoryContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  pieContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  averageContainer: {
    display: "flex",
    alignItems: "center",
  },
  legendText: {
    fontSize: 14,
    color: colors.BLUE,
    marginVertical: 5,
  },
  pourcentageStyle: {
    fontSize: 12,
    color: colors.BLUE,
    marginVertical: 5,
    fontStyle: "italic",
  },
  /// old
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
    marginRight: 5,
    flexShrink: 1,
  },
  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 15,
  },
  scrollContainer: {
    minHeight: screenHeight * 1.2,
  },
});

export default ChartPie;
