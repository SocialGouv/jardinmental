import React, { use, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, FlatList } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { DiaryDataContext } from "@/context/diaryData";
import { Indicator } from "@/entities/Indicator";
import { beforeToday, formatDate, formatDay, formatRelativeDate, getArrayOfDates } from "@/utils/date/helpers";
import { computeIndicatorLabel, getIndicatorKey } from "@/utils/indicatorUtils";
import { IndicatorsBottomSheet } from "@/components/IndicatorsBottomSheet";
import { TW_COLORS } from "@/utils/constants";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import InfoCircle from "@assets/svg/icon/InfoCircle";
import { LineChart } from "react-native-gifted-charts";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useBottomSheet } from "@/context/BottomSheetContext";
import Svg, { Line } from "react-native-svg";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";
import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { DEFAULT_INDICATOR_LABELS, INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";
import EyeIcon from "@assets/svg/icon/Eye";
import EyeOffIcon from "@assets/svg/icon/EyeOff";
import TestChart from "./CorrelationChart";
import { da } from "date-fns/locale";
import { firstLetterUppercase } from "@/utils/string-util";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDevCorrelationConfig } from "@/hooks/useDevCorrelationConfig";
import HelpView from "@/components/HelpView";
import DataMonitoringPeriodHelpView from "./DataMonitoringPeriodHelpView";
import ChevronIcon from "@assets/svg/icon/chevron";
import { Goal } from "@/entities/Goal";
import { getGoalsAndRecords } from "@/utils/localStorage/goals";

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

function formatDateFR(dateString) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Remove the trailing dot after the month (e.g. "oct." → "oct")
  return formatter.format(date).replace(/\./g, "");
}

function getSubArray<T>(array: T[], index: number, x: number): (T | undefined)[] {
  if (!array) {
    return;
  }
  const result: (T | undefined)[] = [];

  for (let i = index - x; i <= index + x; i++) {
    if (i < 0 || i >= array.length) {
      result.push({
        noValue: true,
        hideDataPoint: true,
        value: -10, // a fake value that is outside of the graph
      }); // fill if out of bounds
    } else {
      result.push(array[i]);
    }
  }

  return result;
}

function groupBy(array, keyOrFn) {
  return array.reduce((acc, item) => {
    const key = typeof keyOrFn === "function" ? keyOrFn(item) : item[keyOrFn];

    if (!acc[key]) acc[key] = [];
    acc[key] = item;
    return acc;
  }, {});
}

export const ModalCorrelationScreen: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const { config } = useDevCorrelationConfig();
  const MAX_NUNBER_OF_DAYS = config.maxDays;
  const MIN_DAYS_FOR_CORRELATION = 21;

  const [diaryData] = useContext(DiaryDataContext);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [showTreatment, setShowTreatment] = useState<boolean>();
  const [displayItem, setDisplayItem] = useState<null>();
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState("7days");
  const [isPending, startTransition] = useTransition();
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>();
  const [firstVisible, setFirstVisible] = useState();
  const [lastVisible, setLastVisible] = useState();
  const [goalsAndRecord, setGoalsAndRecord] = useState<{ goal: Goal; records: any[] }[] | undefined>();
  const chartRef = useRef();

  const onClose = ({
    showTreatment: _showTreatment,
    selectedIndicators: _selectedIndicators,
    selectedGoals: _selectedGoals,
  }: {
    showTreatment: boolean;
    selectedIndicators: Indicator[];
    selectedGoals: Goal[];
  }) => {
    closeBottomSheet();
    setSelectedIndicators(_selectedIndicators);
    setSelectedGoals(_selectedGoals);
    setShowTreatment(_showTreatment);
  };

  const openIndicatorBottomSheet = () => {
    showBottomSheet(
      <IndicatorsBottomSheet
        onClose={onClose}
        initialSelectedGoals={selectedGoals}
        initialSelectedIndicators={selectedIndicators}
        initialShowTreatment={showTreatment}
      />
    );
  };

  useEffect(() => {
    if (!selectedIndicators.length) {
      openIndicatorBottomSheet();
    }
  }, []);

  const previousSpacing = useRef(20); // Default spacing for "1month"

  // Animation values for popup
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  // Animated styles for popup
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Handle period selection
  const handlePeriodChange = (period: string) => {
    startTransition(() => {
      setActive(period);
    });
  };

  // Handle animation when displayItem changes
  useEffect(() => {
    if (displayItem) {
      // Apparition
      setIsVisible(true);
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    } else if (isVisible) {
      // Disparition
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(-20, { duration: 300 });
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [displayItem]);

  useEffect(() => {
    const cb = async () => {
      const goalsAndRecord = await getGoalsAndRecords();
      setGoalsAndRecord(goalsAndRecord || []);
    };
    cb();
  }, []);

  const goalsByDate = useMemo(() => {
    if (!goalsAndRecord) {
      return;
    }
    const goalsByDate = goalsAndRecord.map(({ goal, records }, index) => {
      console.log("lcs goalsAndRecord", records);
      console.log(groupBy(records, "date"));
      return groupBy(records, "date");
    });
    return goalsByDate;
  }, [goalsAndRecord]);

  const oneBoolean =
    (selectedIndicators.filter((ind) => ind.type === "boolean").length === 1 && selectedIndicators.length === 2) ||
    (selectedGoals.length === 1 && selectedIndicators.length === 1);
  const twoBoolean =
    selectedIndicators.filter((ind) => ind.type === "boolean").length === 2 ||
    selectedGoals.length === 2 ||
    (selectedIndicators.filter((ind) => ind.type === "boolean").length === 1 && selectedGoals.length === 1) ||
    (selectedGoals.length === 1 && selectedIndicators.length === 0) ||
    (selectedIndicators.filter((ind) => ind.type === "boolean").length === 1 && selectedIndicators.length === 1);

  const booleanIndicatorIndex = oneBoolean ? selectedIndicators.findIndex((ind) => ind.type === "boolean") || selectedGoals[0] : undefined;

  const dataToDisplay = useMemo(() => {
    if (!diaryData || (selectedIndicators.length === 0 && selectedGoals.length) || !goalsAndRecord || !goalsByDate) {
      return null;
    }
    // if (!selectedIndicators) {
    //   return null;
    // }
    const data = [];
    const startDate = beforeToday(MAX_NUNBER_OF_DAYS); // Calculate date from 2 years ago
    const chartDates = getArrayOfDates({ startDate }); // Get all dates from 2 years ago to today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    chartDates.push(formatDay(tomorrow));

    for (const indicator of selectedIndicators) {
      const newData = chartDates
        .map((date) => {
          const dayData = diaryData[date];
          if (!dayData) {
            return {
              value: 1,
              hideDataPoint: false,
              noValue: true,
              date: date,
              indicator,
              label: date,
            };
          }
          const categoryState = diaryData[date][getIndicatorKey(indicator)];
          if (!categoryState) {
            return {
              value: 1,
              hideDataPoint: false,
              noValue: true,
              date: date,
              label: date,
              indicator,
            };
          }
          if (indicator?.type === "boolean")
            return {
              value: oneBoolean ? 0 : categoryState?.value === true ? 2 : 1,
              //value: categoryState?.value === true ? 2 : 1,
              noValue: (oneBoolean && categoryState?.value === false) || false,
              date: date,
              label: date,
              isBoolean: oneBoolean, // we setup isBoolean true only when oneBoolean
            };

          if (indicator?.type === "gauge")
            return {
              label: date,
              date: date,
              indicator,
              value: Math.min(Math.floor(categoryState?.value * 5), 4) + 1,
            };
          if (categoryState?.value)
            return {
              value: categoryState?.value,
              label: date,
              date: date,
              indicator,
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
              date: date,
              indicator,
            };
          }
          return {
            data: categoryState.level ? categoryState.level : null,
            hideDataPoint: false,
            noValue: !categoryState.level,
            label: date,
            date: date,
            indicator,
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

    for (const goal of selectedGoals) {
      const goalIndex = goalsAndRecord.findIndex((g) => g.goal.id === goal.id);
      const newData = chartDates
        .map((date) => {
          const dayData = goalsByDate[goalIndex][date];
          console.log(dayData);
          if (!dayData) {
            return {
              value: 1,
              hideDataPoint: false,
              noValue: true,
              date: date,
              indicator: goal,
              label: date,
            };
          }
          // console.log("dayData", dayData);
          return {
            value: oneBoolean ? 0 : dayData.value === true ? 2 : 1,
            //value: categoryState?.value === true ? 2 : 1,
            noValue: (oneBoolean && dayData?.value === false) || false,
            date: date,
            label: date,
            isBoolean: oneBoolean, // we setup isBoolean true only when oneBoolean
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
    if ((selectedIndicators.length === 1 && selectedGoals.length === 0) || (selectedIndicators.length === 0 && selectedGoals.length === 1)) {
      data.push(undefined);
    }
    const treatment = true;
    if (treatment) {
      const newData = chartDates.map((date) => {
        const dayData = diaryData[date];
        if (!dayData || dayData["PRISE_DE_TRAITEMENT"] === undefined) {
          return {
            value: oneBoolean ? -1 : 0, // value just to display point at axix 0 but it does no represent treatment value
            hideDataPoint: false,
            noValue: true,
            date: date,
            label: date,
          };
        }
        return {
          value: oneBoolean ? -1 : 0,
          hideDataPoint: false,
          treatmentValue: dayData["PRISE_DE_TRAITEMENT"].value,
          date: date,
          label: date,
        };
      });
      data.push(newData);
    }
    const treatmentSiBesoin = true;
    if (treatmentSiBesoin) {
      const newData = chartDates.map((date) => {
        const dayData = diaryData[date];
        if (!dayData || !dayData["PRISE_DE_TRAITEMENT_SI_BESOIN"] || !dayData["PRISE_DE_TRAITEMENT_SI_BESOIN"].value) {
          return {
            value: oneBoolean ? -2 : -1, // value just to display point at axix -1 but it does no represent treatment value
            hideDataPoint: false,
            noValue: true,
            date: date,
            label: date,
          };
        }
        return {
          value: oneBoolean ? -2 : -1, // value just to display point at axix -1 but it does no represent treatment value
          hideDataPoint: false,
          treatmentValue: dayData["PRISE_DE_TRAITEMENT_SI_BESOIN"].value,
          date: date,
          label: date,
        };
      });
      data.push(newData);
    }
    return data;
  }, [diaryData, selectedIndicators, goalsAndRecord, goalsByDate]); // 👈 recalcul dès que rawData ou filters changent

  const handleVisibleRangeChange = (first, last) => {
    setFirstVisible(dataToDisplay[0][first + 1]?.date);
    setLastVisible(dataToDisplay[0][last - 1]?.date);
  };
  const validDataCount0 = dataToDisplay?.[0]?.filter((v) => !v["noValue"]).length ?? 0;
  const validDataCount1 = dataToDisplay?.[1]?.filter((v) => !v["noValue"]).length ?? 0;

  if (!dataToDisplay || (validDataCount0 < MIN_DAYS_FOR_CORRELATION && dataToDisplay?.[1] && validDataCount1 < MIN_DAYS_FOR_CORRELATION)) {
    const maxDays = dataToDisplay ? Math.max(validDataCount0, validDataCount1) : 0;
    return (
      <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
        <View className="flex-row justify-between top-0 w-full bg-cnam-primary-800 p-4 items-center h-[96]">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>Tendances & liens</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="w-16 justify-end flex-row items-center"
          >
            <CrossIcon color={"white"} width={25} height={25} strokeWidth={1.2} />
          </TouchableOpacity>
        </View>
        <ScrollView className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25" showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => {
              openIndicatorBottomSheet();
            }}
            className="border border-cnam-primary-700 flex-row h-[48px] rounded-2xl items-center px-4 justify-between"
          >
            <Text className={mergeClassNames(typography.textLgMedium, "text-gray-900")}>
              Modifier les indicateurs ({selectedIndicators.length + selectedGoals.length})
            </Text>
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
            <View className="absolute bottom-0 -z-2">
              <Image
                style={{ width: 150, height: 150, left: 5, bottom: -47, resizeMode: "contain", zIndex: 1 }}
                source={require("../../../../assets/imgs/correlation.png")}
              />
            </View>
            <View className="absolute w-full">
              {dataToDisplay ? (
                <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800 text-center px-4 mt-4")}>
                  Continuez à renseigner vos observations sur ces indicateurs pendant {MIN_DAYS_FOR_CORRELATION - maxDays} jours.
                </Text>
              ) : (
                <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800 text-center px-4 mt-4")}>
                  Sélectionnez au moins un indicateur.
                </Text>
              )}
            </View>
          </View>
          <View className="bg-cnam-cyan-50-lighten-90 flex-row py-4 space-x-2 px-4 rounded-2xl">
            <View>
              <InfoCircle />
            </View>
            <View className="flex-1">
              <Text className={mergeClassNames(typography.textMdMedium, "text-primary-900")}>
                Les premières courbes apparaîtront dès qu’il y aura assez de données pour repérer des liens. Il faut en moyenne 3 semaines
                d’utilisation pour faire des corrélations.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
        <View className="flex-row justify-between top-0 w-full bg-cnam-primary-800 p-4 items-center h-[96]">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>Tendances & liens</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="w-16 justify-end flex-row items-center"
          >
            <CrossIcon color={"white"} width={25} height={25} strokeWidth={1.2} />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-col pt-4 bg-cnam-primary-25">
          <View className="py-4 pb-6">
            <View className="bg-cnam-primary-25 flex-column space-y-4 px-4">
              <TouchableOpacity
                onPress={openIndicatorBottomSheet}
                className="border border-cnam-primary-700 flex-row h-[48px] rounded-2xl items-center px-4 justify-between"
              >
                <Text className={mergeClassNames(typography.textLgMedium, "text-gray-900")}>
                  Modifier les indicateurs ({selectedIndicators.length + selectedGoals.length})
                </Text>
                <ArrowUpSvg
                  style={{
                    transform: [{ rotateX: "180deg" }],
                  }}
                  color={TW_COLORS.CNAM_PRIMARY_900}
                />
              </TouchableOpacity>
              <View className="border border-cnam-cyan-lighten-80 p-4 rounded-2xl bg-white">
                <View className="bg-cnam-primary-100 w-full h-[36] rounded-full flex-row justify-around">
                  <TouchableOpacity
                    onPress={() => handlePeriodChange("7days")}
                    disabled={isPending}
                    className={mergeClassNames(
                      active === "7days" ? "bg-cnam-primary-300" : "",
                      "flex-1 h-full px-4 rounded-full items-center justify-center"
                    )}
                  >
                    <Text
                      className={mergeClassNames(typography.textSmMedium, active === "7days" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                    >
                      7 jours
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePeriodChange("1month")}
                    disabled={isPending}
                    className={mergeClassNames(
                      active === "1month" ? "bg-cnam-primary-300" : "",
                      "flex-1 h-full px-4 rounded-full items-center justify-center"
                    )}
                  >
                    <Text
                      className={mergeClassNames(typography.textSmMedium, active === "1month" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                    >
                      1 mois
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePeriodChange("3months")}
                    disabled={isPending}
                    className={mergeClassNames(
                      active === "3months" ? "bg-cnam-primary-300" : "",
                      "flex-1 h-full px-4 rounded-full items-center justify-center"
                    )}
                  >
                    <Text
                      className={mergeClassNames(typography.textSmMedium, active === "3months" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                    >
                      3 mois
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={() => handlePeriodChange("6months")}
                    disabled={isPending}
                    className={mergeClassNames(
                      active === "6months" ? "bg-cnam-primary-300" : "",
                      "flex-1 h-full px-4 rounded-full items-center justify-center"
                    )}
                  >
                    <Text
                      className={mergeClassNames(typography.textSmMedium, active === "6months" ? "text-cnam-primary-900" : "text-cnam-primary-700")}
                    >
                      6 mois
                    </Text>
                  </TouchableOpacity> */}
                </View>
                <View className={mergeClassNames("w-full", showTreatment || oneBoolean ? "h-64" : "h-48")}>
                  {isVisible && displayItem && displayItem?.date && (
                    <Animated.View
                      // style={[animatedStyle]}
                      className="flex-col border border-cnam-primary-300 bg-white rounded-2xl space-y-2 p-4 mb-4 mt-4 flex-1"
                    >
                      <View className="flex-row justify-between items-center">
                        <Text className={mergeClassNames(typography.textXsBold, "bg-cnam-primary-800 text-white rounded-lg p-2")}>
                          {firstLetterUppercase(formatDate(displayItem?.date, true))}
                        </Text>
                        {/* <TouchableOpacity
                          onPress={() => {
                            setDisplayItem(null);
                          }}
                        >
                          <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800")}>✕</Text>
                        </TouchableOpacity> */}
                      </View>
                      {displayItem &&
                        selectedIndicators.map((indicator, index) => {
                          let value;
                          try {
                            value = diaryData[displayItem.date][getIndicatorKey(indicator)].value;
                          } catch (e) {}
                          return (
                            <View key={indicator.uuid} className="flex-row items-center space-x-2">
                              {oneBoolean && booleanIndicatorIndex === index ? (
                                <View className="items-center" style={{ width: 30 }}>
                                  <View
                                    className="w-4 h-4 bg-white rounded-full"
                                    style={{
                                      borderColor: index === 0 ? "#00A5DF" : "#3D6874",
                                      borderWidth: 4,
                                      backgroundColor: index === 0 ? "#00A5DF" : "white",
                                    }}
                                  ></View>
                                </View>
                              ) : (
                                <Svg height="2" width="30">
                                  <Line
                                    x1="0"
                                    y1="1"
                                    x2="100%"
                                    y2="1"
                                    stroke={index === 0 ? "#00A5DF" : "#3D6874"} // your color
                                    strokeWidth="2"
                                    strokeDasharray={index === 0 ? "" : "4 4"} // pattern: 4px dash, 4px gap
                                  />
                                </Svg>
                              )}
                              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                                <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>{indicator.name} : </Text>
                                {computeIndicatorLabel(indicator, value) || "Pas de donnée"}
                              </Text>
                            </View>
                          );
                        })}
                      {displayItem &&
                        selectedGoals.map((goal, index) => {
                          let value;
                          try {
                            value = goalsByDate[index][displayItem.date].value;
                          } catch (e) {}
                          return (
                            <View key={goal.id} className="flex-row items-center space-x-2">
                              {oneBoolean && booleanIndicatorIndex === index ? (
                                <View className="items-center" style={{ width: 30 }}>
                                  <View
                                    className="w-4 h-4 bg-white rounded-full"
                                    style={{
                                      borderColor: index === 0 ? "#00A5DF" : "#3D6874",
                                      borderWidth: 4,
                                      backgroundColor: index === 0 ? "#00A5DF" : "white",
                                    }}
                                  ></View>
                                </View>
                              ) : (
                                <Svg height="2" width="30">
                                  <Line
                                    x1="0"
                                    y1="1"
                                    x2="100%"
                                    y2="1"
                                    stroke={index === 0 ? "#00A5DF" : "#3D6874"} // your color
                                    strokeWidth="2"
                                    strokeDasharray={index === 0 ? "" : "4 4"} // pattern: 4px dash, 4px gap
                                  />
                                </Svg>
                              )}
                              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                                <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>{goal.label} : </Text>
                                {value === true ? "Réalisé" : value === false ? "Non réalisé" : "Pas de donnée"}
                              </Text>
                            </View>
                          );
                        })}
                      {showTreatment &&
                        displayItem &&
                        diaryData[displayItem.date] &&
                        (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT"] || {}).value === true && (
                          <View className="flex-row items-center space-x-2">
                            <View className="w-[30] items-center justify-center">
                              <CheckMarkIcon width={15} height={15} color={"#134449"} />
                            </View>
                            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                              <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Traitement : </Text>Oui
                            </Text>
                          </View>
                        )}
                      {showTreatment &&
                        displayItem &&
                        diaryData[displayItem.date] &&
                        (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT"] || {}).value === false && (
                          <View className="flex-row items-center space-x-2">
                            <View className="w-[30] items-center justify-center">
                              <CrossIcon color={"#518B9A"} />
                            </View>
                            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                              <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Traitement : </Text>Non
                            </Text>
                          </View>
                        )}
                      {showTreatment &&
                        displayItem &&
                        diaryData[displayItem.date] &&
                        (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT_SI_BESOIN"] || {}).value === true && (
                          <View className="flex-row items-center space-x-2">
                            <View className="w-[30] items-center justify-center">
                              <View className="w-2 h-2 rounded-full bg-cnam-primary-800"></View>
                            </View>
                            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                              <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Si besoin : </Text>Oui
                            </Text>
                          </View>
                        )}

                      {diaryData[displayItem.date] && (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("detail-correlation-modal", {
                              selectedIndicators,
                              diaryDataForDate: diaryData[displayItem.date],
                              date: displayItem.date,
                              data: getSubArray(dataToDisplay[0], selectedPointIndex, 4),
                              dataB: getSubArray(dataToDisplay[1], selectedPointIndex, 4),
                              treatment: getSubArray(dataToDisplay[2], selectedPointIndex, 4),
                              treatmentSiBesoin: getSubArray(dataToDisplay[3], selectedPointIndex, 4),
                              diaryData,
                              showTreatment,
                              selectedPointIndex: 4,
                              oneBoolean,
                              booleanIndicatorIndex,
                              twoBoolean,
                            });
                          }}
                          className="flex-row items-center justify-end"
                        >
                          <EyeIcon />
                          <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-800 ml-2")}>Voir le détail</Text>
                        </TouchableOpacity>
                      )}
                    </Animated.View>
                  )}
                  {!(isVisible && displayItem && displayItem?.date) && (
                    <View
                      style={[animatedStyle]}
                      className="border border-cnam-primary-300 bg-white rounded-2xl flex-col space-y-2 p-4 mb-6 mt-4 items-center justify-center h-[80] flex-1"
                    >
                      <Text
                        className="mt-6"
                        style={{
                          fontStyle: "italic",
                          fontWeight: 400,
                          color: TW_COLORS.GRAY_700,
                        }}
                      >
                        Sélectionnez un point pour afficher le détail
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row w-full items-center justify-end z-10 mt-2">
                  <TouchableOpacity
                    hitSlop={20}
                    className="w-6 items-center justify-center h-6"
                    onPress={() => {
                      chartRef?.current.scrollLeft();
                    }}
                  >
                    <ChevronIcon direction="left" color={TW_COLORS.CNAM_PRIMARY_900} />
                  </TouchableOpacity>
                  {firstVisible && (
                    <Text className={mergeClassNames(" text-cnam-primary-900", typography.textXsSemibold, "")}>{formatDateFR(firstVisible)}</Text>
                  )}
                  {lastVisible && (
                    <Text className={mergeClassNames(" text-cnam-primary-900", typography.textXsSemibold)}> - {formatDateFR(lastVisible)}</Text>
                  )}
                  <TouchableOpacity
                    hitSlop={20}
                    className="w-6 items-center justify-center h-6"
                    onPress={() => {
                      chartRef?.current.scrollRight();
                    }}
                  >
                    <ChevronIcon direction="right" color={TW_COLORS.CNAM_PRIMARY_900} />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingTop: showTreatment ? 10 : 20, paddingBottom: 20 }}>
                  <TestChart
                    ref={chartRef}
                    setDisplayItem={setDisplayItem}
                    spacingFormat={active}
                    data={dataToDisplay[0]}
                    dataB={dataToDisplay[1]}
                    treatment={dataToDisplay[2]}
                    treatmentSiBesoin={dataToDisplay[3]}
                    diaryData={diaryData}
                    navigation={navigation}
                    showTreatment={showTreatment}
                    oneBoolean={oneBoolean}
                    twoBoolean={twoBoolean}
                    booleanIndicatorIndex={booleanIndicatorIndex}
                    selectedIndicators={selectedIndicators}
                    setSelectedPointIndex={setSelectedPointIndex}
                    openIndicatorBottomSheet={openIndicatorBottomSheet}
                    selectedPointIndex={selectedPointIndex}
                    enablePagination={config.enablePagination}
                    onVisibleRangeChange={handleVisibleRangeChange} // 👈 tu passes ta fonction
                  />
                </View>
                <View className="bg-cnam-primary-25 p-4 -mt-2 rounded-2xl flex-col space-y-2">
                  <View className="flex-row items-center justify-center space-x-4">
                    {selectedIndicators.map((indicator, index) => (
                      <View key={getIndicatorKey(indicator)}>
                        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800")}>{indicator.name}</Text>
                        <Svg height="2" width="100%">
                          <Line
                            x1="0"
                            y1="1"
                            x2="100%"
                            y2="1"
                            stroke={index === 0 ? "#00A5DF" : "#3D6874"} // your color
                            strokeWidth="2"
                            strokeDasharray={index === 0 ? "" : "4 4"} // pattern: 4px dash, 4px gap
                          />
                        </Svg>
                      </View>
                    ))}
                  </View>
                  {showTreatment && (
                    <View className="flex-row space-x-6 items-center justify-center">
                      <View className="flex-row space-x-2">
                        <View className="flex-row">
                          <CheckMarkIcon width={15} height={15} color={"#134449"} />
                          <Text className="text-cnam-primary-950">/</Text>
                          <CrossIcon color={"#518B9A"} />
                        </View>
                        <Text className="text-primary-900">Traitement</Text>
                      </View>
                      <View className="flex-row items-center justify-center space-x-2">
                        <View className="bg-cnam-primary-950 rounded-full h-2 w-2" />
                        <Text className="text-primary-900">Prise d'un "si besoin"</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View className="bg-cnam-primary-50 p-4">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
              Recherchez des moments où les indicateurs évoluent ensemble ou dans des directions opposées.
            </Text>
          </View>
          <View className="bg-cnam-primary-100 pt-4 pb-20">
            <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-900 py-4 pl-4")}>Explorez notre guide</Text>
            <FlatList
              horizontal={true}
              className="mt-4"
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item.type === "dataMonitoringPeriod") {
                      showBottomSheet(<DataMonitoringPeriodHelpView isMd={true} title={item.title} description={item.content} />);
                    } else showBottomSheet(<HelpView isMd={true} title={item.title} description={item.content} />);
                  }}
                  className="bg-white border border-cnam-primary-400 rounded-2xl w-[227] h-[109] p-4 flex-row flex-1 ml-4"
                >
                  {/* <View
                    className="h-[107] w-[83] rounded-2xl"
                    style={{
                      backgroundColor: "#EAE8E8",
                    }}
                  ></View> */}
                  <View className="flex-1 ml-2">
                    <Text className={mergeClassNames("text-cnam-primary-950", typography.textMdMedium)}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              )}
              data={[
                {
                  title: "Pourquoi analyser mes données ?",
                  content: `Prendre un moment chaque jour pour faire le point aide à mieux comprendre ce qui influence votre équilibre mental.

**Observer vos indicateurs permet de :**
- repérer des schémas récurrents ;
- identifier les causes possibles de vos variations ;
- découvrir ce qui soutient ou fragilise votre bien-être.


L’objectif est de tirer des enseignements pour mieux vous connaître et analyser vos données à votre échelle. 
`,
                },
                {
                  title: "Sur quelle période regarder mes données ?",
                  type: "dataMonitoringPeriod",
                },
                {
                  title: "Conseils pour votre analyse",
                  content: `- Notez vos observations dans l’application ou un carnet pour suivre l’évolution de vos réflexions.
- Revenez régulièrement sur vos données : certains schémas apparaissent plus clairement avec le temps.

- Soyez patient·e avec vous-même. L’objectif est d’essayer de comprendre vos tendances, pas de tout expliquer immédiatement.`,
                },
              ]}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};
