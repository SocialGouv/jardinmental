import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday } from "../../utils/date/helpers";
import Header from "../../components/Header";
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
import { useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import Animated from "react-native-reanimated";
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
          <StatistiqueHeader
            presetDate={presetDate}
            setPresetDate={setPresetDate}
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            scrollY={scrollY}
          />
          <ChartPie
            onScroll={scrollHandler}
            fromDate={fromDate}
            toDate={toDate}
            navigation={navigation}
          />
        </View>

        <View style={{ display: chartType === "Courbes" ? "flex" : "none", flex: 1 }}>
          <Variations onScroll={scrollHandler} navigation={navigation} scrollY={scrollY} />
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
            scrollY={scrollY}
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
            scrollY={scrollY}
          />
        </View>
      </View>
      <FloatingPlusButton shadow onPress={startSurvey} plusPosition={0} />
    </>
  );
};

export const StatistiqueHeader = ({ presetDate, setPresetDate, fromDate, toDate, setFromDate, setToDate, scrollY }) => {
  const { showBottomSheet } = useBottomSheet();

  const animatedShadowStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { shadowOpacity: 0, elevation: 0 };
    }

    const shadowOpacity = interpolate(scrollY.value, [0, 50], [0, 0.2], Extrapolate.CLAMP);
    const elevation = interpolate(scrollY.value, [0, 50], [0, 8], Extrapolate.CLAMP);

    return { shadowOpacity, elevation };
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        animatedShadowStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          zIndex: 10,
        },
      ]}
    >
      <View className="w-full px-4">
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
        ></RangeDate>
        {/* <View className="h-[1] bg-cnam-primary-400 w-full mt-4"></View> */}
        {/* <Legend style={{ marginTop: 14 }} /> */}
      </View>
    </Animated.View>
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
  },
  safe: {
    flex: 1,
    backgroundColor: colors.LIGHT_BLUE,
  },
});

export default Bilan;
