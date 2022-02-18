import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { formatDate, formatDay, getArrayOfDatesFromTo } from "../../utils/date/helpers";
import { DiaryDataContext } from "../../context/diaryData";
import Text from "../../components/MyText";
import { displayedCategories, scoresMapIcon } from "../../utils/constants";
import { colors } from "../../utils/colors";
import { buildSurveyData } from "../../scenes/survey/survey-data";
import Icon from "../../components/Icon";
import localStorage from "../../utils/localStorage";
import logEvents from "../../services/logEvents";
import Button from "../../components/Button";

const ChartFrise = ({ navigation, fromDate, toDate, focusedScores }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState();
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const q = await buildSurveyData();
        if (q) {
          setActiveCategories(q.map((e) => e.id));
        }
      })();
    }, [])
  );

  React.useEffect(() => {
    const empty = !activeCategories.reduce((showing, categoryId) => {
      return Boolean(isChartVisible(categoryId)) || showing;
    }, false);
    setIsEmpty(empty);
  }, [activeCategories, isChartVisible]);

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

  const startSurvey = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents.logFeelingStart();
    if (!symptoms) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day");
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
        return {};
      }
      const categoryState = diaryData[date][categoryId];
      if (!categoryState) {
        return {};
      }
      if (categoryState?.value) return categoryState;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = categoryId.split("_");
      let categoryStateIntensity = null;
      if (suffix && suffix === "FREQUENCE") {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
        return { value: categoryState.level + categoryStateIntensity.level - 2 };
      }
      return { value: categoryState.level - 1 };
    });
  };

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.subtitleContainer}>
          <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
          <Text style={styles.subtitle}>
            Des <Text style={styles.bold}>frises</Text> apparaîtront au fur et à mesure de vos saisies
            quotidiennes.
          </Text>
        </View>
        <Button title="Commencer à saisir" onPress={startSurvey} />
      </View>
    );
  }
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
      {activeCategories.map((categoryId) => (
        <Frise
          focusedScores={focusedScores}
          title={getTitle(categoryId)}
          key={categoryId}
          data={computeChartData(categoryId)}
          fromDate={fromDate}
          toDate={toDate}
        />
      ))}
    </ScrollView>
  );
};

const Frise = ({ title, data, fromDate, toDate, focusedScores }) => {
  return (
    <View style={styles.friseContainer}>
      <Text style={styles.friseTitle}>{title}</Text>
      <View style={styles.squareContainer}>
        {data?.map((e, i) => {
          let color = scoresMapIcon[e?.value]?.color || "#f5f5f5";

          const isVisible =
            (focusedScores.length && focusedScores.includes(e?.value)) || focusedScores.length === 0;
          const isFocused = focusedScores.length && focusedScores.includes(e?.value);

          const shadow = isFocused
            ? {
                shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.5,
                shadowRadius: 2.5,
                elevation: 1,
              }
            : {};

          const firstSquare = i === 0;
          const lastSquare = i === data.length - 1;
          return (
            <View style={styles.squareItemContainer}>
              <View
                style={[
                  styles.square,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: color,
                    opacity: isVisible ? 1 : 0.15,
                    borderBottomStartRadius: firstSquare ? 5 : 0,
                    borderTopStartRadius: firstSquare ? 5 : 0,
                    borderBottomEndRadius: lastSquare ? 5 : 0,
                    borderTopEndRadius: lastSquare ? 5 : 0,
                  },
                ]}
              />
              <View
                style={[
                  // eslint-disable-next-line react-native/no-inline-styles
                  { borderColor: isFocused ? color : "transparent", borderTopWidth: 0.5, ...shadow },
                ]}
              />
            </View>
          );
        })}
      </View>
      {fromDate && toDate ? (
        <View style={styles.legend}>
          <Text style={styles.legendText}>{formatDate(formatDay(fromDate))}</Text>
          <Text style={styles.legendText}>{formatDate(formatDay(toDate))}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  friseContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  friseTitle: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
  },
  squareContainer: {
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  squareItemContainer: {
    display: "flex",
    flex: 1,
    height: 10,
  },
  square: {
    flex: 1,
    height: 10,
  },
  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendText: {
    fontSize: 12,
    color: colors.BLUE,
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
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  setupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 350 ? 19 : 15,
    flexWrap: "wrap",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    // flex: 1,
  },
});

export default ChartFrise;
