import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday } from "../../utils/date/helpers";
import Header from "../../components/Header";
import Text from "../../components/MyText";
// import ChartPicker from "./chartPicker";
import ChartPicker from "./chartPicker2";
import RangeDate from "./RangeDate";
import ScorePicker from "./ScorePicker";
import FriseScreen from "./frise/FriseScreen";
import ChartPie from "./chartPie";
import Evenements from "./events";
import Courbes from "../calendar/calendar";
import logEvents from "../../services/logEvents";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";
import localStorage from "../../utils/localStorage";
import FloatingPlusButton from "../../components/FloatingPlusButton";
import { FriseInfoButton } from "./frise/FriseInfoButton";

const screenHeight = Dimensions.get("window").height;

const Suivi = ({ navigation, setPlusVisible, startSurvey }) => {
  const [chartType, setChartType] = React.useState("Frises");
  const [fromDate, setFromDate] = React.useState(beforeToday(30));
  const [toDate, setToDate] = React.useState(beforeToday(0));
  const [focusedScores, setFocusedScores] = React.useState([1, 2, 3, 4, 5]);
  const [showTraitement, setShowTraitement] = React.useState(true);
  const [aUnTraiement, setAUnTraitement] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

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
          setShowTraitement(false);
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
        return <Evenements navigation={navigation} fromDate={fromDate} toDate={toDate} />;
      case "Frises":
      default:
        return (
          <FriseScreen
            navigation={navigation}
            fromDate={fromDate}
            toDate={toDate}
            focusedScores={focusedScores}
            showTraitement={showTraitement}
            showHint={showHint}
            onCloseHint={() => {
              setShowHint(false);
              logEvents.logSuiviShowLegendeInformationPriseDeTraitement(0); // 0 = masquer, 1 = afficher
            }}
            setShowHint={setShowHint}
            aUnTraiement={aUnTraiement}
            setShowTraitement={setShowTraitement}
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
        <View style={styles.headerContainer}>
          <ChartPicker
            // onAfterPress={() => setChartType(nextChartType(chartType))}
            // onBeforePress={() => setChartType(prevChartType(chartType))}
            // title={chartType}
            onChange={(e) => setChartType(e)}
            ongletActif={chartType}
          />
          {chartType !== "Courbes" ? (
            <RangeDate
              fromDate={fromDate}
              toDate={toDate}
              onChangeFromDate={setFromDate}
              onChangeToDate={setToDate}
              withPreset={chartType === "Frises" || chartType === "Statistiques"}
            >
              {chartType === "Frises" && (
                <FriseInfoButton navigation={navigation} hasTreatment={aUnTraiement} />
              )}
            </RangeDate>
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
              <View style={styles.hintContainer}>
                <TouchableOpacity
                  onPress={() => {
                    if (aUnTraiement) {
                      setShowTraitement((e) => !e);
                      logEvents.logSuiviShowPriseDeTraitement(showTraitement ? 0 : 1); // 0 = masquer, 1 = afficher
                    } else {
                      setShowHint((e) => !e);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.selectionContainer,
                      !aUnTraiement && styles.noTraitementSelectionContainer,
                      showTraitement && styles.activeSelectionContainer,
                    ]}
                  >
                    <Icon
                      icon="DrugsSvg"
                      color={!aUnTraiement || showTraitement ? "#FFFFFF" : "#58C8D2"}
                      width={20}
                      height={20}
                      styleContainer={styles.icon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
        {renderChart(chartType)}
      </SafeAreaView>
      <FloatingPlusButton shadow onPress={startSurvey} plusPosition={0} />
    </>
  );
};

const styles = StyleSheet.create({
  hintContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
  },
  infoHintContainer: {
    width: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: 15,
    marginLeft: 10,
  },
  activeInfoHintContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  infoHintText: {
    color: colors.LIGHT_BLUE,
  },
  activeInfoHintText: {
    color: "#FFFFFF",
  },
  icon: {
    width: 30,
    height: 30,
  },
  selectionContainer: {
    padding: 4,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  noTraitementSelectionContainer: {
    backgroundColor: "#E9E9E9",
    borderColor: "#DADADA",
  },
  containerScorePickerFrise: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainerNavigation: {
    padding: 5,
    paddingBottom: 0,
    backgroundColor: "#1FC6D5",
  },
  headerContainer: {
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#1FC6D5",
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
