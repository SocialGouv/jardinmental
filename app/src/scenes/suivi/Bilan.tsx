import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday } from "../../utils/date/helpers";
import Header from "../../components/Header";
import ChartPicker from "./chartPicker2";
import RangeDate from "./RangeDate";
import ChartPie from "./chartPie";
import Evenements from "./triggers/triggers";
import Variations, { VariationsHeader } from "../variation/variation";
import { Correlation, CorrelationHeader } from "./correlation/Correlation";
import { EventFilterHeader } from "./triggers/EventFilterHeader";
import logEvents from "../../services/logEvents";
import localStorage from "../../utils/localStorage";
import { getIndicatorKey } from "../../utils/indicatorUtils";
import FloatingPlusButton from "../../components/FloatingPlusButton";
import { colors } from "@/utils/colors";
import Legend from "./Legend";
import { useSharedValue, useAnimatedStyle, interpolate, Extrapolate, useAnimatedScrollHandler } from "react-native-reanimated";
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
  // bug on correlation when data is import so set up a special filter
  const [presetDateCorrelation, setPresetDateCorrelation] = React.useState("lastDays7");
  const [fromDateCorrelation, setFromDateCorrelation] = React.useState(beforeToday(30));
  const [toDateCorrelation, setToDateCorrelation] = React.useState(beforeToday(0));

  const [aUnTraiement, setAUnTraitement] = React.useState(false);
  const [day, setDay] = React.useState(new Date());
  const [focusedScores, setFocusedScores] = React.useState([]);
  const [showTraitement, setShowTraitement] = React.useState(true);
  const [filterEnabled, setFilterEnabled] = React.useState(false);
  const friseInfoButtonRef = React.useRef();
  const [indicateur, setIndicateur] = React.useState();
  const [indicateurId, setIndicateurId] = React.useState();
  const [level, setLevel] = React.useState([5]);
  const [userIndicateurs, setUserIndicateurs] = React.useState([]);
  const [dynamicPaddingTop, setDynamicPaddingTop] = useState(null); // Default fallback
  const measuredHeight = useSharedValue(0); // Store the measured natural height

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
          setIndicateur(user_indicateurs[0]?.name);
          setIndicateurId(getIndicatorKey(user_indicateurs[0]));
        }
      })();
    }, [])
  );
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

  const handleBannerLayout = (event) => {
    // Only measure once
    const bannerHeight = event.nativeEvent.layout.height;
    measuredHeight.value = bannerHeight;

    // Calculate total header height including safe area insets
    const totalHeaderHeight = bannerHeight + 40;
    setDynamicPaddingTop(totalHeaderHeight);
  };

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!toDate || !fromDate) return null;

  return (
    <>
      <View className="flex-1">
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <View style={styles.headerContainerNavigation}>
            <Header title="Mes analyses" navigation={navigation} scrollY={scrollY} />
          </View>
          <View style={styles.tabContainer}>
            <ChartPicker onChange={(e) => setChartType(e)} ongletActif={chartType} scrollY={scrollY} />
          </View>
          <View onLayout={handleBannerLayout}>
            {chartType === "Statistiques" && (
              <StatistiqueHeader
                presetDate={presetDate}
                setPresetDate={setPresetDate}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                scrollY={scrollY}
              />
            )}
            {chartType === "Courbes" && <VariationsHeader day={day} setDay={setDay} scrollY={scrollY} />}
            {chartType === "Frises" && (
              <CorrelationHeader
                presetDate={presetDateCorrelation}
                setPresetDate={setPresetDateCorrelation}
                fromDate={fromDateCorrelation}
                setFromDate={setFromDateCorrelation}
                toDate={toDateCorrelation}
                setToDate={setToDate}
                hasTreatment={aUnTraiement}
                scrollY={scrollY}
                focusedScores={focusedScores}
                setFocusedScores={setFocusedScores}
                showTraitement={showTraitement}
                setShowTraitement={setShowTraitement}
                filterEnabled={filterEnabled}
                setFilterEnabled={setFilterEnabled}
                friseInfoButtonRef={friseInfoButtonRef}
              />
            )}
            {chartType === "Déclencheurs" && (
              <EventFilterHeader
                presetDate={presetDate}
                setPresetDate={setPresetDate}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                indicateur={indicateur}
                setIndicateur={(indicatorName) => {
                  setIndicateur(indicatorName);
                  const _indicator = userIndicateurs.find((ind) => ind.name === indicatorName);
                  setIndicateurId(getIndicatorKey(_indicator));
                }}
                level={level}
                setLevel={setLevel}
                userIndicateurs={userIndicateurs.filter(({ active }) => active)}
                scrollY={scrollY}
              />
            )}
          </View>
        </View>
        {/* Render all tabs but hide inactive ones to preserve state */}
        {chartType === "Statistiques" && (
          <View style={{ display: chartType === "Statistiques" ? "flex" : "none", flex: 1, position: "relative" }}>
            <ChartPie dynamicPaddingTop={dynamicPaddingTop} onScroll={scrollHandler} fromDate={fromDate} toDate={toDate} navigation={navigation} />
          </View>
        )}

        {chartType === "Courbes" && (
          <View style={{ display: chartType === "Courbes" ? "flex" : "none", flex: 1 }}>
            <Variations
              dynamicPaddingTop={dynamicPaddingTop}
              onScroll={scrollHandler}
              navigation={navigation}
              scrollY={scrollY}
              day={day}
              setDay={setDay}
            />
          </View>
        )}

        {chartType === "Déclencheurs" && (
          <View style={{ display: chartType === "Déclencheurs" ? "flex" : "none", flex: 1 }}>
            <Evenements
              dynamicPaddingTop={dynamicPaddingTop}
              onScroll={scrollHandler}
              navigation={navigation}
              presetDate={presetDate}
              setPresetDate={setPresetDate}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              scrollY={scrollY}
              indicateur={indicateur}
              setIndicateur={setIndicateur}
              indicateurId={indicateurId}
              setIndicateurId={setIndicateurId}
              level={level}
              setLevel={setLevel}
              userIndicateurs={userIndicateurs}
              setUserIndicateurs={setUserIndicateurs}
            />
          </View>
        )}

        {chartType === "Frises" && (
          <View style={{ display: chartType === "Frises" ? "flex" : "none", flex: 1 }}>
            <Correlation
              dynamicPaddingTop={dynamicPaddingTop}
              onScroll={scrollHandler}
              navigation={navigation}
              presetDate={presetDateCorrelation}
              setPresetDate={setPresetDateCorrelation}
              fromDate={fromDateCorrelation}
              setFromDate={setFromDateCorrelation}
              toDate={toDateCorrelation}
              setToDate={setToDateCorrelation}
              hasTreatment={aUnTraiement}
              scrollY={scrollY}
              focusedScores={focusedScores}
              setFocusedScores={setFocusedScores}
              showTraitement={showTraitement}
              setShowTraitement={setShowTraitement}
              filterEnabled={filterEnabled}
              setFilterEnabled={setFilterEnabled}
              friseInfoButtonRef={friseInfoButtonRef}
            />
          </View>
        )}
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
