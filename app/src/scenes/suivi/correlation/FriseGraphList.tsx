import React from "react";
import { StyleSheet, View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getArrayOfDatesFromTo } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import Text from "@/components/MyText";
import { displayedCategories, TAB_BAR_HEIGHT } from "@/utils/constants";
import { colors } from "@/utils/colors";
import Icon from "@/components/Icon";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import { FriseGraph } from "./FriseGraph";
import JMButton from "@/components/JMButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoalsFriseGraph } from "@/scenes/goals/suivi/GoalsFriseGraph";

import { getIndicatorKey } from "../../../utils/indicatorUtils";
import { SCROLL_THRESHOLD } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import Animated from "react-native-reanimated";

const screenHeight = Dimensions.get("window").height;

// Async wrapper component for FriseGraph with loading state
const AsyncFriseGraph = React.memo(
  ({ title, categoryId, focusedScores, showTraitement, computeChartDataAsync, loadingStates, chartDataCache, cacheKey }: any) => {
    // Initialize data from cache if available to avoid showing loading on remount
    const [data, setData] = React.useState(() => chartDataCache[categoryId] || null);
    const [treatmentData, setTreatmentData] = React.useState(() => (showTraitement ? chartDataCache["PRISE_DE_TRAITEMENT"] || null : null));
    const [treatmentSiBesoinData, setTreatmentSiBesoinData] = React.useState(() =>
      showTraitement ? chartDataCache["PRISE_DE_TRAITEMENT_SI_BESOIN"] || null : null
    );

    // Track if we've loaded data for this category to prevent refetching
    const hasLoadedRef = React.useRef(false);
    const prevShowTraitementRef = React.useRef(showTraitement);
    const prevFocusedScoresRef = React.useRef(focusedScores);
    const prevCacheKeyRef = React.useRef(cacheKey);

    // Reset hasLoadedRef and clear state when cache key changes (date range changed)
    React.useEffect(() => {
      if (prevCacheKeyRef.current !== cacheKey) {
        hasLoadedRef.current = false;
        prevCacheKeyRef.current = cacheKey;
        // Clear local state so stale data isn't shown
        setData(null);
        setTreatmentData(null);
        setTreatmentSiBesoinData(null);
      }
    }, [cacheKey]);

    // Reset hasLoadedRef when filters change
    React.useEffect(() => {
      if (prevShowTraitementRef.current !== showTraitement || prevFocusedScoresRef.current !== focusedScores) {
        hasLoadedRef.current = false;
        prevShowTraitementRef.current = showTraitement;
        prevFocusedScoresRef.current = focusedScores;
      }
    }, [showTraitement, focusedScores]);

    React.useEffect(() => {
      const loadData = async () => {
        // Skip if we've already loaded data for this component instance
        if (hasLoadedRef.current) {
          return;
        }

        // Skip if data is already available from cache initialization
        const hasMainData = chartDataCache[categoryId];
        const hasTreatmentData = !showTraitement || chartDataCache["PRISE_DE_TRAITEMENT"];
        const hasSiBesoinData = !showTraitement || chartDataCache["PRISE_DE_TRAITEMENT_SI_BESOIN"];

        if (hasMainData && hasTreatmentData && hasSiBesoinData) {
          // Data already loaded from cache, mark as loaded
          hasLoadedRef.current = true;
          return;
        }

        try {
          const [mainData, priseDeTraitement, priseDeTraitementSiBesoin] = await Promise.all([
            computeChartDataAsync(categoryId),
            showTraitement ? computeChartDataAsync("PRISE_DE_TRAITEMENT") : Promise.resolve([]),
            showTraitement ? computeChartDataAsync("PRISE_DE_TRAITEMENT_SI_BESOIN") : Promise.resolve([]),
          ]);
          console.log("lCS SET MAIN DATA");
          setData(mainData);
          setTreatmentData(priseDeTraitement);
          setTreatmentSiBesoinData(priseDeTraitementSiBesoin);
          hasLoadedRef.current = true;
        } catch (error) {
          console.error("Error loading chart data:", error);
        }
      };

      loadData();
    }, [categoryId, showTraitement, computeChartDataAsync, chartDataCache]);

    const isLoading =
      loadingStates[categoryId] || (showTraitement && (loadingStates["PRISE_DE_TRAITEMENT"] || loadingStates["PRISE_DE_TRAITEMENT_SI_BESOIN"]));

    if (isLoading || !data) {
      return (
        <View style={styles.friseContainer}>
          {title ? <Text style={styles.friseTitle}>{title}</Text> : null}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.LIGHT_BLUE} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        </View>
      );
    }

    return (
      <FriseGraph
        focusedScores={focusedScores}
        title={title}
        data={data}
        showTraitement={showTraitement}
        priseDeTraitement={treatmentData}
        priseDeTraitementSiBesoin={treatmentSiBesoinData}
      />
    );
  }
);

const FriseGraphList = ({ navigation, fromDate, toDate, focusedScores, showTraitement, onScroll, dynamicPaddingTop }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [userIndicateurs, setUserIndicateurs] = React.useState<any[]>([]);
  const [isEmpty, setIsEmpty] = React.useState<boolean>(false);
  const [goalsIsEmpty, setGoalsIsEmpty] = React.useState<boolean>(false);

  // Use refs for cache to avoid unnecessary rerenders
  const chartDataCacheRef = React.useRef<Record<string, any[]>>({});
  const loadingStatesRef = React.useRef<Record<string, boolean>>({});

  // Keep a minimal state just to trigger UI updates when loading changes
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const chartDates = React.useMemo(() => getArrayOfDatesFromTo({ fromDate, toDate }), [fromDate, toDate]);
  const insets = useSafeAreaInsets();

  // Create a stable cache key based on date range
  const cacheKey = React.useMemo(() => `${fromDate}_${toDate}`, [fromDate, toDate]);
  const previousCacheKeyRef = React.useRef(cacheKey);

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

  React.useEffect(() => {
    if (!userIndicateurs) return;
    const empty = userIndicateurs.every((ind) => !isChartVisible(getIndicatorKey(ind)));
    setIsEmpty(empty);
  }, [userIndicateurs, isChartVisible]);

  const startSurvey = async () => {
    logEvents._deprecatedLogFeelingStart();
    if (!userIndicateurs) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day", {
        origin: "no_data_frises",
      });
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

  const computeChartData = React.useCallback(
    (categoryId) => {
      return chartDates.map((date) => {
        const dayData = diaryData[date];
        if (!dayData) {
          return {};
        }
        const categoryState = diaryData[date][categoryId];
        if (!categoryState) {
          return {};
        }
        if (categoryState?.value !== null && categoryState?.value !== undefined) return categoryState;

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
          return { value: (categoryState as any).level + ((categoryStateIntensity as any)?.level || 3) - 2 };
        }
        return { value: (categoryState as any).level - 1 };
      });
    },
    [chartDates, diaryData]
  );

  const computeChartDataAsync = React.useCallback(
    async (categoryId) => {
      // Return cached data if available
      if (chartDataCacheRef.current[categoryId]) {
        return chartDataCacheRef.current[categoryId];
      }

      // Set loading state
      loadingStatesRef.current = { ...loadingStatesRef.current, [categoryId]: true };
      forceUpdate(); // Trigger UI update for loading indicator

      // Add initial delay to allow UI interactions to complete (like modal closing)
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Process data in chunks to avoid blocking the UI
      return new Promise((resolve) => {
        const processInChunks = async () => {
          const data: any[] = [];
          const chunkSize = 5; // Smaller chunks for better responsiveness

          for (let i = 0; i < chartDates.length; i += chunkSize) {
            const chunk = chartDates.slice(i, i + chunkSize);

            // Process each chunk
            const chunkData = chunk.map((date) => {
              const dayData = diaryData[date];
              if (!dayData) {
                return {};
              }
              const categoryState = diaryData[date][categoryId];
              if (!categoryState) {
                return {};
              }
              if (categoryState?.value !== null && categoryState?.value !== undefined) return categoryState;

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
                return { value: (categoryState as any).level + ((categoryStateIntensity as any)?.level || 3) - 2 };
              }
              return { value: (categoryState as any).level - 1 };
            });

            data.push(...(chunkData as any[]));

            // Yield control back to the main thread after each chunk with longer delays
            await new Promise((resolveChunk) => setTimeout(resolveChunk, 16)); // ~60fps
          }

          // Cache the result
          chartDataCacheRef.current = { ...chartDataCacheRef.current, [categoryId]: data };

          // Clear loading state
          loadingStatesRef.current = { ...loadingStatesRef.current, [categoryId]: false };
          forceUpdate(); // Trigger UI update to remove loading indicator

          resolve(data);
        };

        processInChunks().catch((error) => {
          console.error("Error processing chart data:", error);
          loadingStatesRef.current = { ...loadingStatesRef.current, [categoryId]: false };
          forceUpdate();
          resolve([]);
        });
      });
    },
    [chartDates, diaryData]
  );

  // Clear cache only when date range actually changes
  React.useEffect(() => {
    if (cacheKey !== previousCacheKeyRef.current) {
      chartDataCacheRef.current = {};
      loadingStatesRef.current = {};
      previousCacheKeyRef.current = cacheKey;
    }
  }, [cacheKey]);

  if (isEmpty && goalsIsEmpty) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
            paddingTop: 220,
          },
        ]}
      >
        <View style={styles.subtitleContainer}>
          <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} styleContainer={{}} spin={false} onPress={() => {}} />
          <Text style={styles.subtitle}>
            Des <Text style={styles.bold}>frises</Text> apparaîtront au fur et à mesure de vos saisies quotidiennes.
          </Text>
        </View>
        <JMButton title="Commencer à saisir" onPress={startSurvey} />
      </View>
    );
  }

  return (
    <>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 150,
            paddingTop: 200 + dynamicPaddingTop,
          },
        ]}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
      >
        {userIndicateurs
          ?.filter((ind) => isChartVisible(getIndicatorKey(ind)) && ind.active)
          ?.map((ind) => (
            <AsyncFriseGraph
              key={ind.name}
              title={getTitle(ind.name)}
              categoryId={getIndicatorKey(ind)}
              focusedScores={focusedScores}
              showTraitement={showTraitement}
              computeChartDataAsync={computeChartDataAsync}
              loadingStates={loadingStatesRef.current}
              chartDataCache={chartDataCacheRef.current}
              cacheKey={cacheKey}
            />
          ))}
        <GoalsFriseGraph
          {...{ chartDates, focusedScores }}
          showTraitement={showTraitement}
          priseDeTraitement={computeChartData("PRISE_DE_TRAITEMENT")}
          priseDeTraitementSiBesoin={computeChartData("PRISE_DE_TRAITEMENT_SI_BESOIN")}
          onIsEmptyChanged={setGoalsIsEmpty}
        />
      </Animated.ScrollView>
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
    minHeight: screenHeight,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT_BLUE,
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
  friseContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  friseTitle: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
    marginBottom: 5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.BLUE,
  },
});

export default FriseGraphList;
