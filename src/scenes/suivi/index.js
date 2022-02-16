import React, { useEffect, useState, useRef, useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Image, Dimensions } from "react-native";
import { displayedCategories } from "../../utils/constants";
import { beforeToday, getArrayOfDates, getTodaySWeek, formatDate } from "../../utils/date/helpers";
import Header from "../../components/Header";
import ChartPicker from "./chartPicker";
import { DiaryDataContext } from "../../context/diaryData";
import { useContext } from "react";
import logEvents from "../../services/logEvents";
import localStorage from "../../utils/localStorage";
import Text from "../../components/MyText";
import Icon from "../../components/Icon";
import { colors } from "../../utils/colors";
const screenHeight = Dimensions.get("window").height;
import DateRange from "./dateRange";

import Frises from "./chartFrise";
import Courbes from "../calendar/calendar";

// const CHART_TYPES = ["Frises", "Diagrammes", "Courbes", "Évènements"];
const CHART_TYPES = ["Frises", "Courbes"];

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

const Suivi = ({ navigation }) => {
  const [chartType, setChartType] = useState(CHART_TYPES[0]);

  const renderChart = (chart) => {
    switch (chart) {
      case "Frises":
        return <Frises />;
      // case "Diagrammes":
      //   return <Diagrammes />;
      case "Courbes":
        return <Courbes navigation={navigation} />;
      // case "Évènements":
      //   return <Evenements />;
      default:
        return <Frises />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <Header title="Mon suivi" navigation={navigation} />
        <ChartPicker
          onAfterPress={() => setChartType(nextChartType(chartType))}
          onBeforePress={() => setChartType(prevChartType(chartType))}
          title={chartType}
        />
      </View>
      <DateRange />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        {renderChart(chartType)}
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

export default Suivi;
