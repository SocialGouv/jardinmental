import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View, Image, Dimensions, Text, TouchableOpacity, Alert } from "react-native";

import { displayedCategories, HELP_ANALYSE, TAB_BAR_HEIGHT, TW_COLORS } from "@/utils/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { beforeToday, getArrayOfDates, getTodaySWeek, formatDate } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import { useContext } from "react";
import localStorage from "@/utils/localStorage";
import { LineChart } from "react-native-gifted-charts";
import Icon from "@/components/Icon";
import { colors } from "@/utils/colors";
import { INDICATEURS } from "@/utils/liste_indicateurs.1";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { useBottomSheet } from "@/context/BottomSheetContext";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import HelpView from "@/components/HelpView";
import { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import RangeDate from "../RangeDate";
import { FriseFilterBar } from "./FriseFilterBar";
import Legend from "../Legend";
import { autoLayoutAnimation } from "@/utils/autoLayoutAnimation";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import PlusIcon from "@assets/svg/icon/plus";
import EmptyCorrelationIllustration from "@assets/svg/illustrations/EmptyCorrelationIllustration";
import { IndicatorsBottomSheet } from "@/components/IndicatorsBottomSheet";
import ChevronIcon from "@assets/svg/icon/chevron";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import InfoCircle from "@assets/svg/icon/InfoCircle";
import { Indicator } from "@/entities/Indicator";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const CorrelationHeader = ({
  presetDate,
  setPresetDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  hasTreatment,
  scrollY,
  focusedScores,
  setFocusedScores,
  showTraitement,
  setShowTraitement,
  filterEnabled,
  setFilterEnabled,
  friseInfoButtonRef,
}) => {
  const { showBottomSheet } = useBottomSheet();

  const animatedShadowStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { shadowOpacity: 0, elevation: 0 };
    }

    const shadowOpacity = interpolate(scrollY.value, [0, 50], [0, 0.2], Extrapolate.CLAMP);
    const elevation = interpolate(scrollY.value, [0, 50], [0, 8], Extrapolate.CLAMP);

    return { shadowOpacity, elevation };
  });

  if (!toDate || !fromDate) return null;

  return (
    <Animated.View
      style={[
        animatedShadowStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          zIndex: 10,
        },
      ]}
    >
      <View className="w-full px-4">{/* <Legend className="mt-6" /> */}</View>
    </Animated.View>
  );
};

const generateLineSegments = (data) => {
  if (!data || data.length === 0) return [];

  const segments: Array<{
    startIndex: number;
    endIndex: number;
    color: string;
    thickness: number;
  }> = [];
  let startIndex = null;

  data.forEach((point, index) => {
    if (point.value === 1 && point.hideDataPoint) {
      // Début d'un segment
      if (startIndex === null) {
        // console.log("start index", index);
        startIndex = index;
      }
    } else {
      // Fin d'un segment
      if (startIndex !== null) {
        // console.log("end index", index - 1);
        segments.push({
          startIndex,
          endIndex: index,
          color: "transparent", // Vert
          thickness: 3,
        });
        startIndex = null;
      }
    }
  });

  // Gérer le cas où le segment se termine à la fin du tableau
  if (startIndex !== null) {
    segments.push({
      startIndex,
      endIndex: data.length - 1,
      color: "#4CAF50",
      thickness: 3,
    });
  }

  return segments;
};

const TestChart = ({ data, dataB, treatment }) => {
  const ref = useRef(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Custom data point function that can access selectedPointIndex state
  const customDataPoint = ({ color, backgroundColor, isSelected }) => {
    return (
      <View
        style={{
          width: isSelected ? 20 : 14,
          height: isSelected ? 20 : 14,
          backgroundColor: backgroundColor || "white",
          borderWidth: isSelected ? 6 : 3,
          borderRadius: 10,
          borderColor: color || "#3D6874",
          alignSelf: "center",
        }}
      />
    );
  };

  // Configurable label spacing - show 1 label every X data points
  const labelSpacing = 3; // Change this value to adjust label density (e.g., 2 = every 2nd label, 3 = every 3rd label)

  // Format date to French format (DD/MM or DD MMM)
  const formatDateToFrench = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Short format: DD/MM
    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year.toString().padStart(2, "0").slice(2, 4)}`;
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const showOrHidePointer = (ind) => {
    ref.current?.scrollTo({
      x: ind * 200 - 25,
    }); // adjust as per your UI
  };
  const lineSegments = generateLineSegments(data);
  return (
    <View className="">
      <View className="mb-4" style={{ flexDirection: "row", marginLeft: 8 }}>
        {months.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                padding: 6,
                margin: 4,
                backgroundColor: "#ebb",
                borderRadius: 8,
              }}
              onPress={() => showOrHidePointer(index)}
            >
              <Text>{months[index]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <LineChart
        spacing={50}
        yAxisSide={1}
        xAxisLabelTextStyle={{ fontSize: 10, color: "#666", width: 60, textAlign: "center" }}
        xAxisTextNumberOfLines={1}
        xAxisLabelsHeight={10}
        xAxisThickness={0}
        xAxisColor={"transparent"}
        width={screenWidth - 70}
        focusEnabled={true}
        // focusProximity={50}
        lineSegments={lineSegments}
        // onFocus={(item, index) => {
        //   console.log("focused", item, index);
        //   setSelectedPointIndex(index);
        // }}
        unFocusOnPressOut={false}
        showStripOnFocus={true}
        stripColor={TW_COLORS.CNAM_PRIMARY_700}
        stripHeight={200}
        stripWidth={2}
        showTextOnFocus={true}
        focusTogether={true}
        xAxisLabelsVerticalShift={60}
        showXAxisIndices={true}
        xAxisIndicesWidth={2}
        xAxisIndicesColor={"#999"}
        noOfSections={5}
        noOfSectionsBelowXAxis={0}
        stepValue={1}
        scrollRef={ref}
        data={(data || []).map((d, index) => ({
          ...d,
          label: index % labelSpacing === 0 ? formatDateToFrench(d.label) : "", // Show label only at intervals with French format
          focusedCustomDataPoint: () => {
            return customDataPoint({ color: "#3D6874", backgroundColor: "white", isSelected: true });
          },
          customDataPoint: () => {
            return customDataPoint({ color: "#3D6874", backgroundColor: "white", isSelected: false });
          },
        }))}
        xAxisIndicesHeight={10}
        color2={"#00A5DF"}
        color1={"#3D6874"}
        // noOfSectionsBelowXAxis={1}
        data2={
          dataB
            ? dataB.map((d, index) => ({
                ...d,
                label: index % labelSpacing === 0 ? formatDateToFrench(d.label) : "", // Show label only at intervals with French format
                focusedCustomDataPoint: () => {
                  return customDataPoint({ color: "#00A5DF", backgroundColor: "#00A5DF", isSelected: true });
                },
                customDataPoint: () => {
                  return customDataPoint({ color: "#00A5DF", backgroundColor: "#00A5DF", isSelected: false });
                },
              }))
            : null
        }
        data3={
          treatment
            ? (treatment || []).map((t, index) => ({
                ...t,
                label: index % labelSpacing === 0 ? formatDateToFrench(t.label) : "", // Show label only at intervals with French format
                customDataPoint: () => {
                  const isSelected = selectedPointIndex === index;

                  return (
                    <View
                      style={{
                        width: 14,
                        height: 30,
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          borderWidth: isSelected ? 2 : 1,
                          borderRadius: 10,
                          backgroundColor: "#134449",
                          borderColor: "#134449",
                          height: isSelected ? 14 : 10,
                          width: isSelected ? 14 : 10,
                          shadowColor: isSelected ? "#134449" : "transparent",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: isSelected ? 0.5 : 0,
                          shadowRadius: isSelected ? 8 : 0,
                          elevation: isSelected ? 8 : 0,
                        }}
                      />
                    </View>
                  );
                },
              }))
            : null
        }
        pointerConfig={{
          activatePointersOnLongPress: true,
          activatePointersDelay: 500,
          pointerColor: "transparent",
          pointerStripWidth: 2,
          width: 20,
          height: 20,
          pointerStripColor: TW_COLORS.CNAM_PRIMARY_700,
          // pointer1Color: "#00A5DF",
          // pointer2Color: "#3D6874",
          pointerStripUptoDataPoint: false,
          pointerLabelWidth: 40,
          pointerLabelHeight: 100,
          pointerComponent: (item) => {
            return customDataPoint({ color: "red", isSelected: true });
          },
          pointerLabelComponent: (items) => {
            return (
              <View
                style={{
                  height: 90,
                  width: 100,
                  justifyContent: "center",
                  marginTop: -30,
                  marginLeft: -40,
                }}
              >
                <Text style={{ color: "white", fontSize: 14, marginBottom: 6, textAlign: "center" }}>{items[0].date}</Text>

                <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: "white" }}>
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>{"$" + items[0].value + ".0"}</Text>
                </View>
              </View>
            );
          },
        }}
        overflowBottom={100} // space at the bottom of graph
        // dataPointsHeight={15}
        // dataPointsWidth={15}
        dataPointsWidth1={15}
        dataPointsHeight1={15}
        dataPointsHeight2={15}
        dataPointsWidth2={15}
        dataPointsHeight3={14}
        dataPointsWidth3={14}
        focusedDataPointHeight={20}
        focusedDataPointWidth={20}
        showDataPointLabelOnFocus={false}
        color3="transparent"
        yAxisColor={"transparent"}
        formatYLabel={(lab) => {
          if (lab === "-1" || lab === "-2" || lab === "6" || lab === "0") {
            return "";
          }
          return "";
          // return parseInt(lab, 10).toString();
        }}
        yAxisOffset={1}
        showVerticalLines={false}
        verticalLinesColor="rgba(24, 26, 26, 0.1)"
        // verticalLinesThickness={0}
        noOfVerticalLines={0}
        strokeDashArray1={[4, 4]}
        curved={true}
        curvature={0.1}
        initialSpacing={0}
      />
    </View>
  );
};

export const Correlation = ({ navigation, onScroll, scrollY, day, setDay, dynamicPaddingTop }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [diaryData] = useContext(DiaryDataContext);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>([]);
  const [showTreatment, setShowTreatment] = useState<boolean>(false);

  const onPressChooseIndicator = () => {
    showBottomSheet(
      <IndicatorsBottomSheet
        onClose={({ selectedIndicators: _selectedIndicators, showTreatment: _showShowTreatment }) => {
          setSelectedIndicators(_selectedIndicators);
          setShowTreatment(_showShowTreatment);
          closeBottomSheet();
        }}
      />
    );
  };

  const dataToDisplay = useMemo(() => {
    if (!diaryData) {
      return null;
    }
    const data = [];
    const twoYearsAgo = beforeToday(40 * 1); // Calculate date from 2 years ago
    const chartDates = getArrayOfDates({ startDate: twoYearsAgo }); // Get all dates from 2 years ago to today
    for (const indicator of selectedIndicators) {
      const newData = chartDates
        .map((date) => {
          const dayData = diaryData[date];
          if (!dayData) {
            return {
              value: 1,
              hideDataPoint: true,
              label: date,
            };
          }
          const categoryState = diaryData[date][getIndicatorKey(indicator)];
          if (!categoryState) {
            return {
              value: 1,
              hideDataPoint: true,
              label: date,
            };
          }
          if (indicator?.type === "boolean") return { value: categoryState?.value === true ? 4 : 0, label: date };
          if (indicator?.type === "gauge")
            return {
              label: date,
              value: Math.min(Math.floor(categoryState?.value * 5), 4),
            };
          if (categoryState?.value)
            return {
              value: categoryState?.value,
              label: date,
            };

          // get the name and the suffix of the category
          const [categoryName, suffix] = getIndicatorKey(indicator).split("_");
          let categoryStateIntensity = null;
          if (suffix && suffix === "FREQUENCE") {
            // if it's one category with the suffix 'FREQUENCE' :
            // add the intensity (default level is 3 - for the frequence 'never')
            categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
            return {
              value: categoryState.level + categoryStateIntensity.level - 2,
              label: date,
            };
          }
          return {
            data: categoryState.level ? categoryState.level : null,
            hideDataPoint: !categoryState.level,
            label: date,
          };
        })
        .filter((d) => d)
        .filter((d) => {
          if (!Number.isFinite(d.value)) {
            return false;
          }
          return true;
        });
      data.push(newData);
    }
    return data;
  }, [diaryData, selectedIndicators]); // 👈 recalcul dès que rawData ou filters changent

  // const computeChartData = (indicateur) => {
  //   return chartDates.map((date) => {
  //     const dayData = diaryData[date];
  //     if (!dayData) {
  //       return {
  //         value: 1,
  //         hideDataPoint: true,
  //         label: date,
  //       };
  //     }
  //     const categoryState = diaryData[date][getIndicatorKey(indicateur)];
  //     if (!categoryState) {
  //       return {
  //         value: 1,
  //         hideDataPoint: true,
  //         label: date,
  //       };
  //     }
  //     if (indicateur?.type === "boolean") return { value: categoryState?.value === true ? 4 : 0, label: date };
  //     if (indicateur?.type === "gauge")
  //       return {
  //         label: date,
  //         value: Math.min(Math.floor(categoryState?.value * 5), 4),
  //       };
  //     if (categoryState?.value)
  //       return {
  //         value: categoryState?.value,
  //         label: date,
  //       };

  //     // get the name and the suffix of the category
  //     const [categoryName, suffix] = getIndicatorKey(indicateur).split("_");
  //     let categoryStateIntensity = null;
  //     if (suffix && suffix === "FREQUENCE") {
  //       // if it's one category with the suffix 'FREQUENCE' :
  //       // add the intensity (default level is 3 - for the frequence 'never')
  //       categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
  //       return {
  //         value: categoryState.level + categoryStateIntensity.level - 2,
  //         label: date,
  //       };
  //     }
  //     return {
  //       data: categoryState.level ? categoryState.level : null,
  //       hideDataPoint: !categoryState.level,
  //       label: date,
  //     };
  //   });
  // };

  if (selectedIndicators.length === 0) {
    return (
      <ScrollView className="px-4 flex-col space-y-4 pt-60 bg-white">
        <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800")}>Explorez les liens entre vos indicateurs</Text>
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
          Observez comment vos indicateurs évoluent ensemble pour mieux comprendre ce qui influence votre état.
        </Text>
        <View className="bg-cnam-cyan-50-lighten-90 p-4 border border-dashed border-cnam-primary-500 flex-col space-y-4">
          <EmptyCorrelationIllustration width="100%" />
          <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
            Sommeil & énergie, humeur & activité physique… Les liens peuvent vous aider à mieux comprendre votre équilibre mental.
          </Text>
          <JMButton onPress={onPressChooseIndicator} variant="outline" title="Choisir mes indicateurs" icon={<PlusIcon />} />
        </View>
      </ScrollView>
    );
  } else if (!dataToDisplay) {
    return (
      <ScrollView className="px-4 flex-col space-y-4 pt-60 bg-white">
        <TouchableOpacity
          onPress={() => {
            showBottomSheet(
              <IndicatorsBottomSheet
                onClose={function ({ showTreatment, selectedIndicators }: { showTreatment: boolean; selectedIndicators: string[] }): void {
                  throw new Error("Function not implemented.");
                }}
              />
            );
          }}
          className="border border-cnam-primary-700 flex-row h-[48px] rounded-2xl items-center px-4 justify-between"
        >
          <Text className={mergeClassNames(typography.textLgMedium, "text-gray-900")}>Modifier les indicateurs ({selectedIndicators.length})</Text>
          <ArrowUpSvg
            style={{
              transform: [{ rotateX: "180deg" }],
            }}
            color={TW_COLORS.CNAM_PRIMARY_900}
          />
        </TouchableOpacity>
        <View className="border border-cnam-primary-300 rounded-2xl">
          <Image
            style={{ width: "100%", height: "230" }}
            resizeMode="contain"
            source={require("@assets/imgs/courbe.png")}
            blurRadius={20} // 👈 controls blur intensity
          />
          <View className="absolute w-full">
            <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4 mt-4")}>
              Continuez à renseigner vos indicateurs pendant quelques jours.
            </Text>
          </View>
        </View>
        <View className="bg-cnam-cyan-50-lighten-90 flex-row py-4 space-x-2 px-4 rounded-2xl">
          <View>
            <InfoCircle />
          </View>
          <View className="flex-1">
            <Text className={mergeClassNames(typography.textMdMedium, "text-primary-900")}>
              Les premières courbes apparaîtront dès qu’il y aura assez de données pour repérer des liens. Il faut en moyenne 3 semaines d’utilisation
              pour faire des corrélations.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView className="px-4 flex-col space-y-4 pt-60 bg-white">
        <TestChart data={dataToDisplay[0]} dataB={dataToDisplay[1]} treatment={undefined} />
      </ScrollView>
    );
  }
};

export const Correlation2 = ({ navigation, onScroll, scrollY, day, setDay, dynamicPaddingTop }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [customs, setCustoms] = useState([]);
  const [oldCustoms, setOldCustoms] = useState([]);
  const [calendarIsEmpty, setCalendarIsEmpty] = useState(false);
  let mounted = useRef(true);
  const [userIndicateurs, setUserIndicateurs] = React.useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      if (c && mounted) setCustoms(c);

      //retrocompatibility
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t && mounted) setOldCustoms(t);
    })();
    return () => (mounted = false);
  }, [diaryData]);

  useEffect(() => {
    (async () => {
      const user_indicateurs = await localStorage.getIndicateurs();
      if (user_indicateurs) {
        setUserIndicateurs(user_indicateurs);
      }
    })();
  }, []);

  useEffect(() => {
    const emptyCalendar = !userIndicateurs
      .concat(INDICATEURS)
      .reduce((acc, curr) => {
        if (!acc.find((a) => a === getIndicatorKey(curr))) {
          acc.push(getIndicatorKey(curr));
        }
        return acc;
      }, [])
      .reduce((showing, categoryId) => {
        return Boolean(isChartVisible(categoryId)) || showing;
      }, false);
    setCalendarIsEmpty(emptyCalendar);
  }, [day, customs, oldCustoms, isChartVisible, userIndicateurs]);

  const twoYearsAgo = beforeToday(40 * 1); // Calculate date from 2 years ago
  const chartDates = getArrayOfDates({ startDate: twoYearsAgo }); // Get all dates from 2 years ago to today

  const computeChartData = (indicateur) => {
    return chartDates.map((date) => {
      const dayData = diaryData[date];
      if (!dayData) {
        return {
          value: 1,
          hideDataPoint: true,
          label: date,
        };
      }
      const categoryState = diaryData[date][getIndicatorKey(indicateur)];
      if (!categoryState) {
        return {
          value: 1,
          hideDataPoint: true,
          label: date,
        };
      }
      if (indicateur?.type === "boolean") return { value: categoryState?.value === true ? 4 : 0, label: date };
      if (indicateur?.type === "gauge")
        return {
          label: date,
          value: Math.min(Math.floor(categoryState?.value * 5), 4),
        };
      if (categoryState?.value)
        return {
          value: categoryState?.value,
          label: date,
        };

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      const [categoryName, suffix] = getIndicatorKey(indicateur).split("_");
      let categoryStateIntensity = null;
      if (suffix && suffix === "FREQUENCE") {
        // if it's one category with the suffix 'FREQUENCE' :
        // add the intensity (default level is 3 - for the frequence 'never')
        categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
        return {
          value: categoryState.level + categoryStateIntensity.level - 2,
          label: date,
        };
      }
      return {
        data: categoryState.level ? categoryState.level : null,
        hideDataPoint: !categoryState.level,
        label: date,
      };
    });
  };

  const isChartVisible = useCallback(
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

  let dataA, dataB, treatment;
  if (userIndicateurs.length !== 0) {
    const activeIndicators = userIndicateurs.concat(INDICATEURS).filter((ind) => ind.active);
    const indicatorA = activeIndicators[0];
    const indicatorB = activeIndicators[1];
    dataA = computeChartData(indicatorA)
      .filter((d) => d)
      .filter((d) => {
        if (!Number.isFinite(d.value)) {
          return false;
        }
        return true;
      });
    dataB = computeChartData(indicatorB)
      .filter((d) => d)
      .filter((d) => {
        if (!Number.isFinite(d.value)) {
          return false;
        }
        return true;
      });
    treatment = dataB.map((d) => {
      const value = Math.random() < 0.5 ? 1 : 0;
      return {
        ...d,
        hideDataPoint: value === 1,
        value,
      };
    });
  }

  return (
    <View className="flex-1 bg-white">
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
            paddingTop: 260,
          },
        ]}
        onScroll={onScroll}
      >
        {!calendarIsEmpty ? (
          <>
            <TestChart data={dataA} dataB={dataB} treatment={treatment} />
          </>
        ) : (
          <>
            <View style={styles.subtitleContainer}>
              <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
              <Text style={styles.subtitle}>
                Des <Text style={styles.bold}>courbes d'évolution</Text> apparaîtront au fur et à mesure de vos saisies quotidiennes.
              </Text>
            </View>
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    minHeight: screenHeight * 0.7,
  },
  title: {
    fontWeight: "700",
    fontSize: 22,
  },
});
