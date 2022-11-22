import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getArrayOfDatesFromTo } from "../../../utils/date/helpers";
import { DiaryDataContext } from "../../../context/diaryData";
import Text from "../../../components/MyText";
import { displayedCategories } from "../../../utils/constants";
import { colors } from "../../../utils/colors";
import Icon from "../../../components/Icon";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import Button from "../../../components/Button";
import { FriseGraph } from "./FriseGraph";

export const FriseGraphList = ({ navigation, fromDate, toDate, focusedScores, showTraitement }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [userIndicateurs, setUserIndicateurs] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState();
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });

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
    if (!userIndicateurs) return;
    const empty = userIndicateurs.every(({ name }) => !isChartVisible(name));
    setIsEmpty(empty);
  }, [userIndicateurs, isChartVisible]);

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
    logEvents.logFeelingStart();
    if (!userIndicateurs) {
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
      if (categoryState?.value !== null || categoryState?.value !== undefined) return categoryState;

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
    <>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        {userIndicateurs
          ?.filter((ind) => isChartVisible(ind.name) && ind.active)
          ?.map(({ name }) => (
            <FriseGraph
              focusedScores={focusedScores}
              title={getTitle(name)}
              key={name}
              data={computeChartData(name)}
              showTraitement={showTraitement}
              priseDeTraitement={computeChartData("PRISE_DE_TRAITEMENT")}
              priseDeTraitementSiBesoin={computeChartData("PRISE_DE_TRAITEMENT_SI_BESOIN")}
            />
          ))}
      </ScrollView>
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
    paddingBottom: 150,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1FC6D5",
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
