import React from "react";
import { StyleSheet, View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getArrayOfDatesFromTo } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import Text from "@/components/MyText";
import { displayedCategories } from "@/utils/constants";
import { colors } from "@/utils/colors";
import Icon from "@/components/Icon";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import { FriseGraph } from "./FriseGraph";
import JMButton from "@/components/JMButton";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { GoalsFriseGraph } from "@/scenes/goals/suivi/GoalsFriseGraph";

const screenHeight = Dimensions.get("window").height;

// Async wrapper component for FriseGraph with loading state
const AsyncFriseGraph = React.memo(
  ({ title, categoryId, focusedScores, showTraitement, computeChartDataAsync, loadingStates, chartDataCache }: any) => {
    const [data, setData] = React.useState(null);
    const [treatmentData, setTreatmentData] = React.useState(null);
    const [treatmentSiBesoinData, setTreatmentSiBesoinData] = React.useState(null);

    React.useEffect(() => {
      const loadData = async () => {
        try {
          const [mainData, priseDeTraitement, priseDeTraitementSiBesoin] = await Promise.all([
            computeChartDataAsync(categoryId),
            showTraitement ? computeChartDataAsync("PRISE_DE_TRAITEMENT") : Promise.resolve([]),
            showTraitement ? computeChartDataAsync("PRISE_DE_TRAITEMENT_SI_BESOIN") : Promise.resolve([]),
          ]);

          setData(mainData);
          setTreatmentData(priseDeTraitement);
          setTreatmentSiBesoinData(priseDeTraitementSiBesoin);
        } catch (error) {
          console.error("Error loading chart data:", error);
        }
      };

      loadData();
    }, [categoryId, showTraitement, computeChartDataAsync]);

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

const FriseGraphList = ({ navigation, fromDate, toDate, focusedScores, showTraitement, onScroll }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [userIndicateurs, setUserIndicateurs] = React.useState<any[]>([]);
  const [isEmpty, setIsEmpty] = React.useState<boolean>(false);
  const [goalsIsEmpty, setGoalsIsEmpty] = React.useState<boolean>(false);
  const [chartDataCache, setChartDataCache] = React.useState<Record<string, any[]>>({});
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});
  const chartDates = React.useMemo(() => getArrayOfDatesFromTo({ fromDate, toDate }), [fromDate, toDate]);

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
      if (chartDataCache[categoryId]) {
        return chartDataCache[categoryId];
      }

      // Set loading state
      setLoadingStates((prev) => ({ ...prev, [categoryId]: true }));

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
          setChartDataCache((prev) => ({ ...prev, [categoryId]: data }));

          // Clear loading state
          setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));

          resolve(data);
        };

        processInChunks().catch((error) => {
          console.error("Error processing chart data:", error);
          setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));
          resolve([]);
        });
      });
    },
    [chartDates, diaryData, chartDataCache]
  );

  // Clear cache when date range or diary data changes
  React.useEffect(() => {
    setChartDataCache({});
    setLoadingStates({});
  }, [chartDates, diaryData]);

  if (isEmpty && goalsIsEmpty) {
    return (
      <View style={styles.emptyContainer}>
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
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
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
              loadingStates={loadingStates}
              chartDataCache={chartDataCache}
            />
          ))}
        <GoalsFriseGraph
          {...{ chartDates, focusedScores }}
          showTraitement={showTraitement}
          priseDeTraitement={computeChartData("PRISE_DE_TRAITEMENT")}
          priseDeTraitementSiBesoin={computeChartData("PRISE_DE_TRAITEMENT_SI_BESOIN")}
          onIsEmptyChanged={setGoalsIsEmpty}
        />
      </ScrollView>
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
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 150,
    minHeight: screenHeight * 0.7,
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
