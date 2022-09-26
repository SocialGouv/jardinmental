import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday } from "../../utils/date/helpers";
import Header from "../../components/Header";
// import ChartPicker from "./chartPicker";
import ChartPicker from "./chartPicker2";
import RangeDate from "./RangeDate";
import ChartPie from "./chartPie";
import Evenements from "./events";
import Courbes from "../calendar/calendar";
import logEvents from "../../services/logEvents";
import localStorage from "../../utils/localStorage";
import FloatingPlusButton from "../../components/FloatingPlusButton";
import { FriseScreen } from "./frise";

const Suivi = ({ navigation, startSurvey }) => {
  const [chartType, setChartType] = React.useState("Frises");
  const [presetDate, setPresetDate] = React.useState("lastDays7");
  const [fromDate, setFromDate] = React.useState(beforeToday(30));
  const [toDate, setToDate] = React.useState(beforeToday(0));
  const [aUnTraiement, setAUnTraitement] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      logEvents.logOpenPageSuivi(chartType);
    }, [chartType])
  );
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const medicalTreatmentStorage = await localStorage.getMedicalTreatment();
        if (medicalTreatmentStorage.length === 0) {
          setAUnTraitement(false);
        } else {
          setAUnTraitement(true);
        }
      })();
    }, [])
  );

  if (!toDate || !fromDate) return null;

  const renderChart = (chart) => {
    switch (chart) {
      case "Statistiques":
        return <ChartPie fromDate={fromDate} toDate={toDate} navigation={navigation} />;
      case "Courbes":
        return <Courbes navigation={navigation} />;
      case "Déclencheurs":
        return (
          <Evenements
            navigation={navigation}
            presetDate={presetDate}
            setPresetDate={setPresetDate}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        );
      case "Frises":
      default:
        return (
          <FriseScreen
            navigation={navigation}
            presetDate={presetDate}
            setPresetDate={setPresetDate}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            hasTreatment={aUnTraiement}
          />
        );
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerContainerNavigation}>
          <Header title="Mes analyses" navigation={navigation} />
        </View>
        <View style={styles.tabContainer}>
          <ChartPicker
            // onAfterPress={() => setChartType(nextChartType(chartType))}
            // onBeforePress={() => setChartType(prevChartType(chartType))}
            // title={chartType}
            onChange={(e) => setChartType(e)}
            ongletActif={chartType}
          />
        </View>
        {chartType === "Statistiques" && (
          <View style={styles.headerContainer}>
            <RangeDate
              presetValue={presetDate}
              onChangePresetValue={setPresetDate}
              fromDate={fromDate}
              toDate={toDate}
              onChangeFromDate={setFromDate}
              onChangeToDate={setToDate}
              withPreset={true}
            />
          </View>
        )}
        {renderChart(chartType)}
      </SafeAreaView>
      <FloatingPlusButton shadow onPress={startSurvey} plusPosition={0} />
    </>
  );
};

export const styles = StyleSheet.create({
  headerContainerNavigation: {
    padding: 5,
    paddingBottom: 0,
    backgroundColor: "#1FC6D5",
  },
  tabContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  safe: {
    flex: 1,
    backgroundColor: "#1FC6D5",
  },
});

export default Suivi;
