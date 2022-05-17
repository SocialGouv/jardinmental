import React from "react";
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getArrayOfDatesFromTo } from "../../utils/date/helpers";
import { DiaryDataContext } from "../../context/diaryData";
import Text from "../../components/MyText";
import { displayedCategories, scoresMapIcon } from "../../utils/constants";
import { colors } from "../../utils/colors";
import { buildSurveyData } from "../../scenes/survey/survey-data";
import Icon from "../../components/Icon";
import localStorage from "../../utils/localStorage";
import logEvents from "../../services/logEvents";
import Button from "../../components/Button";

const ChartFrise = ({
  navigation,
  fromDate,
  toDate,
  focusedScores,
  showTraitement,
  showHint,
  onCloseHint,
}) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState();
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
    if (!activeCategories) return;
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
      {showHint ? (
        <View style={styles.hintContainer}>
          <View style={styles.hintTitleContainer}>
            <Text style={styles.hintTitle}>Corrélez la prise de votre traitement avec vos frises</Text>
            <TouchableOpacity style={styles.close} onPress={onCloseHint}>
              <Icon icon="CrossSvg" width={8} height={8} color={colors.BLUE} />
            </TouchableOpacity>
          </View>
          <Frise
            focusedScores={[]}
            data={[
              { value: 1 },
              { value: 2 },
              { value: 3 },
              { value: 1 },
              { value: 3 },
              { value: 1 },
              { value: 4 },
              { value: 5 },
              { value: 5 },
              { value: 4 },
              { value: 4 },
              { value: 3 },
              { value: 4 },
              { value: 4 },
            ]}
            showTraitement
            priseDeTraitement={[
              {},
              { value: false },
              {},
              { value: true },
              { value: true },
              { value: true },
              { value: true },
              { value: true },
              { value: true },
              { value: true },
              { value: true },
              {},
              { value: false },
              {},
            ]}
            priseDeTraitementSiBesoin={[
              {},
              { value: false },
              {},
              { value: false },
              { value: false },
              { value: true },
              { value: true },
              { value: false },
              { value: false },
              { value: true },
              { value: true },
              {},
              { value: false },
              {},
            ]}
          />
          <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
              <View style={[styles.hintSquare, { backgroundColor: "#5956E8", marginRight: 15 }]} />
              <Text style={styles.hintLegend}>Prise correcte du traitement</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
              <View style={[styles.hintSquare, { backgroundColor: "#E575F8", marginRight: 15 }]} />
              <Text style={styles.hintLegend}>Prise incomplète/oubli du traitement</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
              <View
                style={[
                  {
                    height: 4,
                    width: 4,
                    borderRadius: 2,
                    backgroundColor: "#5956E8",
                    marginRight: 21,
                    marginLeft: 5,
                  },
                ]}
              />
              <Text style={styles.hintLegend}>Prise d’un "si besoin"</Text>
            </View>
          </View>
        </View>
      ) : null}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        {activeCategories?.map((categoryId) => (
          <Frise
            focusedScores={focusedScores}
            title={getTitle(categoryId)}
            key={categoryId}
            data={computeChartData(categoryId)}
            showTraitement={showTraitement}
            priseDeTraitement={computeChartData("PRISE_DE_TRAITEMENT")}
            priseDeTraitementSiBesoin={computeChartData("PRISE_DE_TRAITEMENT_SI_BESOIN")}
          />
        ))}
      </ScrollView>
    </>
  );
};

const Frise = ({
  title,
  data,
  focusedScores,
  showTraitement,
  priseDeTraitement,
  priseDeTraitementSiBesoin,
}) => {
  return (
    <View style={styles.friseContainer}>
      {title ? <Text style={styles.friseTitle}>{title}</Text> : null}
      <View style={styles.squareContainer}>
        {data?.map((e, i) => {
          let color = scoresMapIcon[e?.value]?.color || "#f5f5f5";

          let opacity = 1;
          if (focusedScores.length && !focusedScores.includes(e?.value)) {
            // cet élément n'est pas focused
            opacity = e?.value ? 0.1 : 0.5; // on reduit moins l'opacité si c'est une frise vide
          }

          const isFocused =
            e?.value &&
            focusedScores.length > 0 &&
            focusedScores.length < 5 &&
            focusedScores.includes(e?.value);

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

          const borderBottom = isFocused
            ? {
                borderColor: scoresMapIcon[e?.value]?.borderColor,
                borderBottomWidth: 2,
              }
            : {};

          const firstSquare = i === 0;
          const lastSquare = i === data.length - 1;
          return (
            <View key={`${title}-${i}`} style={styles.squareItemContainer}>
              <View
                style={[
                  styles.square,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: color,
                    opacity,
                    borderBottomStartRadius: !isFocused && firstSquare ? 5 : 0,
                    borderTopStartRadius: firstSquare ? 5 : 0,
                    borderBottomEndRadius: !isFocused && lastSquare ? 5 : 0,
                    borderTopEndRadius: lastSquare ? 5 : 0,
                    ...borderBottom,
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
      {showTraitement ? (
        <View style={styles.squareContainerTraitement}>
          {priseDeTraitement?.map((e, i) => {
            let color = "#D7D3D3";
            if (e?.value === true) color = "#5956E8";
            if (e?.value === false) color = "#E575F8";

            const firstSquare = i === 0;
            const lastSquare = i === data.length - 1;
            return (
              <View key={`${title}-${i}`} style={styles.squareItemContainerTraitement}>
                <View
                  style={[
                    styles.square,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor: color,
                      borderBottomStartRadius: firstSquare ? 5 : 0,
                      borderTopStartRadius: firstSquare ? 5 : 0,
                      borderBottomEndRadius: lastSquare ? 5 : 0,
                      borderTopEndRadius: lastSquare ? 5 : 0,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      ) : null}
      {showTraitement ? (
        <View style={styles.squareContainerTraitement}>
          {priseDeTraitementSiBesoin?.map((e, i) => {
            let color = "#5956E8";
            if (e?.value !== true) color = "transparent";
            return (
              <View key={`${title}-${i}`} style={styles.squareItemContainerTraitementSiBesoin}>
                <View
                  style={[
                    styles.dot,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  close: {
    // position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    right: 0,
    // borderRadius: 16,
    // borderColor: "#D4F0F2",
    // borderWidth: 1,
    zIndex: 2,
    width: 18,
    height: 18,
  },
  hintTitleContainer: {
    display: "flex",
    flexDirection: "row",
  },
  hintContainer: {
    marginHorizontal: 15,
    padding: 10,
    borderColor: "#AEEDF8",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F8FDFE",
  },
  hintTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
  },
  hintLegend: {
    flex: 1,
  },
  hintSquare: {
    height: 4,
    width: 15,
  },
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
    marginBottom: 5,
  },
  squareContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  squareContainerTraitement: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  squareItemContainerTraitementSiBesoin: {
    marginTop: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 4,
  },
  square: {
    flex: 1,
    height: 10,
  },
  dot: {
    flex: 1,
    height: 4,
    width: 4,
    borderRadius: 2,
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
