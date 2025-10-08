import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday } from "../../utils/date/helpers";
import Header from "../../components/Header";
// import ChartPicker from "./chartPicker";
import ChartPicker from "./chartPicker2";
import RangeDate from "./RangeDate";
import ChartPie from "./chartPie";
import Evenements from "./triggers/triggers";
import Variations from "../variation/variation";
import logEvents from "../../services/logEvents";
import localStorage from "../../utils/localStorage";
import FloatingPlusButton from "../../components/FloatingPlusButton";
import { FriseScreen } from "./correlation/Correlation";
import { colors } from "@/utils/colors";
import Legend from "./Legend";
import { useSharedValue } from "react-native-reanimated";
import JMButton from "@/components/JMButton";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { Button2 } from "@/components/Button2";
import HelpView from "@/components/HelpView";
import { analyzeScoresMapIcon, HELP_ANALYSE, TW_COLORS } from "@/utils/constants";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import DrugIcon from "@assets/svg/icon/Drug";

const Bilan = ({ navigation, startSurvey }) => {
  const [chartType, setChartType] = React.useState<"Frises" | "Statistiques" | "Déclencheurs" | "Courbes">("Statistiques");
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

  const scrollY = useSharedValue(0);
  const scrollHandler = (event) => {
    "worklet";
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  if (!toDate || !fromDate) return null;

  return (
    <>
      <View className="flex-1">
        <View style={styles.headerContainerNavigation}>
          <Header title="Mes analyses" navigation={navigation} scrollY={scrollY} />
        </View>
        <View style={styles.tabContainer}>
          <ChartPicker onChange={(e) => setChartType(e)} ongletActif={chartType} scrollY={scrollY} />
        </View>

        {/* Render all tabs but hide inactive ones to preserve state */}
        <View style={{ display: chartType === "Statistiques" ? "flex" : "none", flex: 1 }}>
          <StatistiquePage
            presetDate={presetDate}
            setPresetDate={setPresetDate}
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
          <ChartPie onScroll={scrollHandler} fromDate={fromDate} toDate={toDate} navigation={navigation} />
        </View>

        <View style={{ display: chartType === "Courbes" ? "flex" : "none", flex: 1 }}>
          <Variations onScroll={scrollHandler} navigation={navigation} />
        </View>

        <View style={{ display: chartType === "Déclencheurs" ? "flex" : "none", flex: 1 }}>
          <Evenements
            onScroll={scrollHandler}
            navigation={navigation}
            presetDate={presetDate}
            setPresetDate={setPresetDate}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        </View>

        <View style={{ display: chartType === "Frises" ? "flex" : "none", flex: 1 }}>
          <FriseScreen
            onScroll={scrollHandler}
            navigation={navigation}
            presetDate={presetDate}
            setPresetDate={setPresetDate}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            hasTreatment={aUnTraiement}
          />
        </View>
      </View>
      <FloatingPlusButton shadow onPress={startSurvey} plusPosition={0} />
    </>
  );
};

export const StatistiquePage = ({ presetDate, setPresetDate, fromDate, toDate, setFromDate, setToDate }) => {
  const { showBottomSheet } = useBottomSheet();

  return (
    <View style={styles.headerContainer}>
      <View className="w-full px-4">
        {/* <View className="flex-row items-center w-full justify-between"> */}
        {/* <View className="flex-row"> */}
        <RangeDate
          presetValue={presetDate}
          onChangePresetValue={setPresetDate}
          fromDate={fromDate}
          toDate={toDate}
          onChangeFromDate={setFromDate}
          onChangeToDate={setToDate}
          withPreset={true}
          onHelpClick={() => {
            showBottomSheet(<HelpView title={HELP_ANALYSE["bilan"]["title"]} description={HELP_ANALYSE["bilan"]["description"]} />);
          }}
        >
          {/* TODO : make it work avec les autres types d'indicateur */}
        </RangeDate>
        {/* <TouchableOpacity
              className="ml-2 border border-cnam-primary-800 rounded-full h-[40] px-4 justify-center"
              onPress={() => setIsFilterActif(!isFilterActif)}
            >
              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>Filtrer</Text>
            </TouchableOpacity>
          </View> */}
        {/* <JMButton
            onPress={() => {
              showBottomSheet(<HelpView title={HELP_ANALYSE["bilan"]["title"]} description={HELP_ANALYSE["bilan"]["description"]} />);
            }}
            variant="outline"
            width="fixed"
            icon={<CircleQuestionMark />}
            className="mr-2"
          /> */}
        {/* </View> */}
        {/* {isFilterActif && (
          <View className="flex-row space-x-2 border border-cnam-primary-800 rounded-2xl self-start px-2 py-2 mt-2">
            {[
              {
                ...analyzeScoresMapIcon[1],
              },
              {
                ...analyzeScoresMapIcon[2],
              },
              {
                ...analyzeScoresMapIcon[3],
              },
              {
                ...analyzeScoresMapIcon[4],
              },
              {
                ...analyzeScoresMapIcon[5],
              },
            ].map((item) => {
              return (
                <View
                  className="h-[32] w-[32] rounded-full justify-center items-center"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  <Text style={{ color: item.iconColor }}>{item.symbol}</Text>
                </View>
              );
            })}
            <View className="h-[32] w-[32] rounded-full bg-cnam-primary-100 justify-center items-center">
              <DrugIcon width={16} />
            </View>
          </View>
        )} */}
        <View className="h-[1] bg-cnam-primary-400 w-full mt-4"></View>
        <Legend style={{ marginTop: 14 }} />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  headerContainerNavigation: {
    padding: 5,
    paddingBottom: 0,
    backgroundColor: colors.LIGHT_BLUE,
  },
  tabContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  headerContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: TW_COLORS.CNAM_PRIMARY_400,
    borderBottomWidth: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.LIGHT_BLUE,
  },
});

export default Bilan;
