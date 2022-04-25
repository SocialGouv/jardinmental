import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday } from "../../utils/date/helpers";
import Header from "../../components/Header";
import ChartPicker from "./chartPicker";
import RangeDate from "./RangeDate";
import ScorePicker from "./ScorePicker";
import ChartFrise from "./chartFrise";
import ChartPie from "./chartPie";
import Evenements from "./events";
import Courbes from "../calendar/calendar";
import logEvents from "../../services/logEvents";

const screenHeight = Dimensions.get("window").height;
const CHART_TYPES = ["Frises", "Statistiques", "Courbes", "Analyse des notes"];

const nextChartType = (chartType) => {
  const i = CHART_TYPES.indexOf(chartType);
  const nextIndex = (i + 1) % CHART_TYPES.length;
  return CHART_TYPES[nextIndex];
};
const prevChartType = (chartType) => {
  const i = CHART_TYPES.indexOf(chartType);
  const nextIndex = (i + CHART_TYPES.length - 1) % CHART_TYPES.length;
  return CHART_TYPES[nextIndex];
};

const Suivi = ({ navigation, setPlusVisible }) => {
  const [chartType, setChartType] = React.useState(CHART_TYPES[0]);
  const [fromDate, setFromDate] = React.useState(beforeToday(30));
  const [toDate, setToDate] = React.useState(beforeToday(0));
  const [focusedScores, setFocusedScores] = React.useState([1, 2, 3, 4, 5]);

  useFocusEffect(
    React.useCallback(() => {
      setPlusVisible(true);
      logEvents.logOpenPageSuivi(chartType);
    }, [chartType, setPlusVisible])
  );

  if (!toDate || !fromDate) return null;

  const renderChart = (chart) => {
    switch (chart) {
      case "Statistiques":
        return <ChartPie fromDate={fromDate} toDate={toDate} navigation={navigation} />;
      case "Courbes":
        return <Courbes navigation={navigation} />;
      case "Analyse des notes":
        return <Evenements navigation={navigation} fromDate={fromDate} toDate={toDate} />;
      case "Frises":
      default:
        return (
          <ChartFrise
            navigation={navigation}
            fromDate={fromDate}
            toDate={toDate}
            focusedScores={focusedScores}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <Header title="Mes analyses" navigation={navigation} />
        <ChartPicker
          onAfterPress={() => setChartType(nextChartType(chartType))}
          onBeforePress={() => setChartType(prevChartType(chartType))}
          title={chartType}
        />
        {chartType !== "Courbes" ? (
          <RangeDate
            fromDate={fromDate}
            toDate={toDate}
            onChangeFromDate={setFromDate}
            onChangeToDate={setToDate}
          />
        ) : null}
        {chartType === "Frises" ? (
          <ScorePicker
            focusedScores={focusedScores}
            onPress={(i) => {
              if (focusedScores.includes(i)) {
                setFocusedScores((e) => e.filter((x) => x !== i));
              } else {
                setFocusedScores((e) => [...e, i]);
              }
              //events
              logEvents.logSuiviEditScoreFrise(i);
            }}
          />
        ) : null}
      </View>
      {renderChart(chartType)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 5,
    paddingBottom: 15,
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
  title: {
    fontWeight: "700",
    fontSize: 22,
  },
});

export default Suivi;
