import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
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
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";

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
  const [showTraitement, setShowTraitement] = React.useState(false);

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
            showTraitement={showTraitement}
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
          <View style={styles.containerScorePickerFrise}>
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
            <View style={styles.verticalDivider} />
            <TouchableOpacity onPress={() => setShowTraitement((e) => !e)}>
              <View style={[styles.selectionContainer, showTraitement && styles.activeSelectionContainer]}>
                <Icon
                  icon="DrugsSvg"
                  color={showTraitement ? "#FFFFFF" : "#58C8D2"}
                  width={20}
                  height={20}
                  styleContainer={styles.icon}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {renderChart(chartType)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
  selectionContainer: {
    padding: 4,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  containerScorePickerFrise: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  verticalDivider: {
    height: "50%",
    backgroundColor: "#E0E0E0",
    width: 1,
    alignSelf: "center",
  },
});

export default Suivi;
