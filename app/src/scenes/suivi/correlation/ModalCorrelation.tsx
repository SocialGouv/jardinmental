import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, FlatList } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { DiaryDataContext } from "@/context/diaryData";
import { Indicator } from "@/entities/Indicator";
import { beforeToday, formatDay, formatRelativeDate, getArrayOfDates } from "@/utils/date/helpers";
import { getIndicatorKey } from "@/utils/indicatorUtils";
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

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const computeIndicatorLabel = (indicator, value): string => {
  if (value === null || value === undefined) return "Pas de donnée";
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) : value;

  // For smiley-type indicators sorted in DESC order, invert the label index.
  if (indicator.order === "DESC" && indicator.type === INDICATOR_TYPE.smiley) {
    index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
  }
  if (Object.keys(INDICATOR_LABELS).includes(indicator.uuid)) {
    return INDICATOR_LABELS[indicator.uuid][index - 1];
  } else {
    return DEFAULT_INDICATOR_LABELS[index - 1];
  }
};

export const ModalCorrelationScreen: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>(route.params.selectedIndicators || []);
  const { showBottomSheet } = useBottomSheet();

  const dataToDisplay = useMemo(() => {
    if (!diaryData) {
      return null;
    }
    const data = [];
    const twoYearsAgo = beforeToday(40 * 1); // Calculate date from 2 years ago
    const chartDates = getArrayOfDates({ startDate: twoYearsAgo }); // Get all dates from 2 years ago to today
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
          if (indicator?.type === "boolean") return { value: categoryState?.value === true ? 4 : 0, label: date };
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
    const treatment = true;
    if (treatment) {
      const newData = chartDates.map((date) => {
        const dayData = diaryData[date];
        if (!dayData || dayData["PRISE_DE_TRAITEMENT"] === undefined) {
          return {
            value: 0, // value just to display point at axix 0 but it does no represent treatment value
            hideDataPoint: false,
            noValue: true,
            date: date,
            label: date,
          };
        }
        return {
          value: 0,
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
            value: -1, // value just to display point at axix -1 but it does no represent treatment value
            hideDataPoint: false,
            noValue: true,
            date: date,
            label: date,
          };
        }
        return {
          value: -1, // value just to display point at axix -1 but it does no represent treatment value
          hideDataPoint: false,
          treatmentValue: dayData["PRISE_DE_TRAITEMENT_SI_BESOIN"].value,
          date: date,
          label: date,
        };
      });
      data.push(newData);
    }
    return data;
  }, [diaryData, selectedIndicators]); // 👈 recalcul dès que rawData ou filters changent

  if (!dataToDisplay) {
    return (
      <View className="flex-1 bg-cnam-primary-25">
        <View className="flex-row justify-between top-0 w-full bg-cnam-primary-800 p-4 items-center h-[96]">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>Correlation</Text>
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>x</Text>
        </View>
        <ScrollView className="px-4 flex-col space-y-4 pt-4 bg-cnam-primary-25" showsHorizontalScrollIndicator={false}>
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
                Les premières courbes apparaîtront dès qu’il y aura assez de données pour repérer des liens. Il faut en moyenne 3 semaines
                d’utilisation pour faire des corrélations.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View className="flex-1 bg-cnam-primary-25">
        <View className="flex-row justify-between top-0 w-full bg-cnam-primary-800 p-4 items-center h-[96]">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>Correlation</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="flex-row items-center justify-end"
          >
            <CrossIcon color={"white"} />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-col pt-4 bg-cnam-primary-25">
          <View className="py-4 pb-6">
            <TestChart
              data={dataToDisplay[0]}
              dataB={dataToDisplay[1]}
              treatment={dataToDisplay[2]}
              treatmentSiBesoin={dataToDisplay[3]}
              diaryData={diaryData}
              navigation={navigation}
              selectedIndicators={selectedIndicators}
            />
          </View>
          <View className="bg-cnam-primary-50 p-4">
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>
              Recherchez des moments où les indicateurs évoluent ensemble ou dans des directions opposées.
            </Text>
          </View>
          <View className="bg-cnam-primary-100 pl-4 pt-4 pb-20">
            <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-900 py-4")}>Explorez notre guide</Text>
            <FlatList
              horizontal={true}
              className="mt-4"
              showsHorizontalScrollIndicator={false}
              renderItem={() => (
                <View className="bg-white border border-cnam-primary-400 rounded-2xl w-[297] h-[139] p-4 mr-2 flex-row flex-1">
                  <View
                    className="h-[107] w-[83] rounded-2xl"
                    style={{
                      backgroundColor: "#EAE8E8",
                    }}
                  ></View>
                  <View className="flex-1 ml-2">
                    <Text className={mergeClassNames("text-cnam-primary-950", typography.textMdMedium)}>Pourquoi analyser mes données ?</Text>
                  </View>
                </View>
              )}
              data={[
                {
                  title: "Pourquoi analyser mes données ?",
                },
                {
                  title: "Pourquoi analyser mes données ?",
                },
              ]}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
};

const TestChart = ({ data, dataB, treatment, treatmentSiBesoin, diaryData, selectedIndicators, navigation }) => {
  const ref = useRef(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [displayItem, setDisplayItem] = useState<null>();
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState("1month");
  const { showBottomSheet } = useBottomSheet();
  const pointerItemRef = useRef(null);
  const hasScrolledToEnd = useRef(false);
  const currentScrollX = useRef(0);
  const previousSpacing = useRef(20); // Default spacing for "1month"

  // Animation values for popup
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  // Animation values for period buttons
  const animScale7days = useSharedValue(active === "7days" ? 1 : 0.98);
  const animScale1month = useSharedValue(active === "1month" ? 1 : 0.98);
  const animScale3months = useSharedValue(active === "3months" ? 1 : 0.98);
  const animScale6months = useSharedValue(active === "6months" ? 1 : 0.98);

  // Animated styles for popup
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Animated styles for period buttons
  const animatedStyle7days = useAnimatedStyle(() => ({
    transform: [{ scale: animScale7days.value }],
  }));
  const animatedStyle1month = useAnimatedStyle(() => ({
    transform: [{ scale: animScale1month.value }],
  }));
  const animatedStyle3months = useAnimatedStyle(() => ({
    transform: [{ scale: animScale3months.value }],
  }));
  const animatedStyle6months = useAnimatedStyle(() => ({
    transform: [{ scale: animScale6months.value }],
  }));

  // Handle period selection with animation
  const handlePeriodChange = (period: string) => {
    setActive(period);

    // Animate all buttons
    animScale7days.value = withTiming(period === "7days" ? 1 : 0.98, { duration: 200 });
    animScale1month.value = withTiming(period === "1month" ? 1 : 0.98, { duration: 200 });
    animScale3months.value = withTiming(period === "3months" ? 1 : 0.98, { duration: 200 });
    animScale6months.value = withTiming(period === "6months" ? 1 : 0.98, { duration: 200 });
  };

  // Calculate spacing based on active period
  const chartSpacing = useMemo(() => {
    switch (active) {
      case "7days":
        return 70;
      case "1month":
        return 20;
      case "3months":
        return 10;
      case "6months":
        return 1;
      default:
        return 50;
    }
  }, [active]);

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

  // Auto-scroll to the end of the chart only on first load
  useEffect(() => {
    if (ref.current && data && data.length > 0 && !hasScrolledToEnd.current) {
      // Small delay to ensure the chart is rendered
      setTimeout(() => {
        const scrollX = (data.length - 1) * chartSpacing;
        ref.current?.scrollTo({ x: scrollX, animated: false });
        currentScrollX.current = scrollX;
        previousSpacing.current = chartSpacing;
        hasScrolledToEnd.current = true;
      }, 100);
    }
  }, [data, chartSpacing]);

  // Maintain relative scroll position when spacing changes (time period changes)
  useEffect(() => {
    if (ref.current && hasScrolledToEnd.current && previousSpacing.current !== chartSpacing) {
      // Calculate which data point index we're currently viewing
      const currentDataIndex = (currentScrollX.current + (screenWidth - 72) / 2) / previousSpacing.current;

      // Calculate the new scroll position for the same data point with new spacing
      const newScrollX = currentDataIndex * chartSpacing;

      setTimeout(() => {
        ref.current?.scrollTo({ x: newScrollX, animated: false });
        currentScrollX.current = newScrollX;
        previousSpacing.current = chartSpacing;
      }, 200);
    }
  }, [chartSpacing]);

  // Custom data point function that can access selectedPointIndex state
  const customDataPoint = ({ color, backgroundColor, isSelected, noValue, needShift }) => {
    if (noValue) return null;

    return (
      <View
        style={{
          width: isSelected ? 20 : 14,
          height: isSelected ? 20 : 14,
          backgroundColor: backgroundColor || "white",
          borderWidth: isSelected ? 6 : 3,
          borderRadius: 10,
          borderColor: color || "#3D6874",
          top: needShift ? -10 : 0,
          opacity: 1,
          alignSelf: "center",
        }}
      />
    );
  };

  const customDataPointTreatment = ({ color, backgroundColor, isSelected, noValue, value, needShift }) => {
    if (noValue) return null;

    return (
      <View
        style={{
          width: isSelected ? 20 : 14,
          height: isSelected ? 20 : 14,
          top: needShift ? -10 : 0,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value === true ? (
          <CheckMarkIcon width={isSelected ? 20 : 15} height={isSelected ? 20 : 15} color={"#134449"} />
        ) : (
          <CrossIcon width={isSelected ? 20 : 15} height={isSelected ? 20 : 15} color={"#518B9A"} />
        )}
      </View>
    );
  };

  // Dynamic label spacing based on active period
  const labelSpacing = useMemo(() => {
    if (active === "7days") {
      return 1;
    } else if (active === "1month") {
      return 3;
    } else if (active === "3months") {
      return 10;
    } else {
      return 20;
    } // Show all labels for 7 days, skip for others
  }, [active]);

  // Get day initial (L, M, M, J, V, S, D)
  const getDayInitial = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayInitials = ["D", "L", "M", "M", "J", "V", "S"]; // Dimanche, Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi
    return dayInitials[dayOfWeek];
  };

  // Format date to French format (DD/MM/YY)
  const formatDateToFrench = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Short format: DD/MM/YY
    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year.toString().padStart(2, "0").slice(2, 4)}`;
  };

  // Format label based on active period
  const formatLabel = (dateString) => {
    if (active === "7days") {
      return getDayInitial(dateString);
    }
    return formatDateToFrench(dateString);
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const showOrHidePointer = (ind) => {
    ref.current?.scrollTo({
      x: ind * 200 - 25,
    }); // adjust as per your UI
  };
  const lineSegments = null; //generateLineSegments(data);
  const lineSegments2 = null; //generateLineSegments(dataB);
  return (
    <View className="bg-cnam-primary-25 flex-column space-y-4 px-4">
      {/* <View className="mb-4" style={{ flexDirection: "row", marginLeft: 8 }}>
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
      </View> */}
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
      <View className="border border-cnam-cyan-lighten-80 p-4 rounded-2xl bg-white">
        <View className="bg-cnam-primary-100 w-full h-[36] rounded-full flex-row justify-around">
          <Animated.View style={[animatedStyle7days]} className="flex-1">
            <TouchableOpacity
              onPress={() => handlePeriodChange("7days")}
              className={mergeClassNames(
                active === "7days" ? "bg-cnam-primary-300" : "",
                "flex-1 h-full px-4 rounded-full items-center justify-center"
              )}
            >
              <Text className={mergeClassNames(typography.textSmMedium, active === "7days" ? "text-cnam-primary-900" : "text-cnam-primary-700")}>
                7 jours
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[animatedStyle1month]} className="flex-1">
            <TouchableOpacity
              onPress={() => handlePeriodChange("1month")}
              className={mergeClassNames(
                active === "1month" ? "bg-cnam-primary-300" : "",
                "flex-1 h-full px-4 rounded-full items-center justify-center"
              )}
            >
              <Text className={mergeClassNames(typography.textSmMedium, active === "1month" ? "text-cnam-primary-900" : "text-cnam-primary-700")}>
                1 mois
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[animatedStyle3months]} className="flex-1">
            <TouchableOpacity
              onPress={() => handlePeriodChange("3months")}
              className={mergeClassNames(
                active === "3months" ? "bg-cnam-primary-300" : "",
                "flex-1 h-full px-4 rounded-full items-center justify-center"
              )}
            >
              <Text className={mergeClassNames(typography.textSmMedium, active === "3months" ? "text-cnam-primary-900" : "text-cnam-primary-700")}>
                3 mois
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[animatedStyle6months]} className="flex-1">
            <TouchableOpacity
              onPress={() => handlePeriodChange("6months")}
              className={mergeClassNames(
                active === "6months" ? "bg-cnam-primary-300" : "",
                "flex-1 h-full px-4 rounded-full items-center justify-center"
              )}
            >
              <Text className={mergeClassNames(typography.textSmMedium, active === "6months" ? "text-cnam-primary-900" : "text-cnam-primary-700")}>
                6 mois
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        {isVisible && (
          <Animated.View style={[animatedStyle]} className="border border-cnam-primary-300 bg-white rounded-2xl flex-col space-y-2 p-4 mb-4 mt-4">
            <View className="flex-row justify-between items-center">
              <Text className={mergeClassNames(typography.textXsBold, "bg-cnam-primary-800 text-white rounded-lg p-2")}>
                {formatRelativeDate(displayItem?.date)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setDisplayItem(null);
                }}
              >
                <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-800")}>✕</Text>
              </TouchableOpacity>
            </View>
            {displayItem &&
              selectedIndicators.map((indicator, index) => {
                let value;
                try {
                  value = diaryData[displayItem.date][getIndicatorKey(indicator)].value;
                } catch (e) {}
                return (
                  <View key={indicator.uuid} className="flex-row items-center space-x-2">
                    <Svg height="2" width="30">
                      <Line
                        x1="0"
                        y1="1"
                        x2="100%"
                        y2="1"
                        stroke={index === 0 ? "#00A5DF" : "#3D6874"} // your color
                        strokeWidth="2"
                        strokeDasharray={index === 0 ? [] : ["4,4"]} // pattern: 4px dash, 4px gap
                      />
                    </Svg>
                    <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                      <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>{indicator.name} : </Text>
                      {computeIndicatorLabel(indicator, value)}
                    </Text>
                  </View>
                );
              })}
            {displayItem && diaryData[displayItem.date] && (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT"] || {}).value === true && (
              <View className="flex-row items-center space-x-2">
                <View className="w-[30] items-center justify-center">
                  <CheckMarkIcon width={15} height={15} color={"#134449"} />
                </View>
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Traitement : </Text>pris
                </Text>
              </View>
            )}
            {displayItem && diaryData[displayItem.date] && (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT"] || {}).value === false && (
              <View className="flex-row items-center space-x-2">
                <View className="w-[30] items-center justify-center">
                  <CrossIcon color={"#518B9A"} />
                </View>
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Traitement : </Text> pas pris
                </Text>
              </View>
            )}
            {displayItem && diaryData[displayItem.date] && (diaryData[displayItem.date]["PRISE_DE_TRAITEMENT_SI_BESOIN"] || {}).value === true && (
              <View className="flex-row items-center space-x-2">
                <View className="w-[30] items-center justify-center">
                  <View className="w-4 h-4 rounded-full bg-cnam-primary-800"></View>
                </View>
                <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 ")}>
                  <Text className={mergeClassNames(typography.textMdSemibold, "text-primary-900")}>Si besoin : </Text> pris
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("detail-correlation-modal", {
                  selectedIndicators,
                  displayItem,
                });
              }}
              className="flex-row items-center justify-end"
            >
              <EyeIcon />
              <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-800 ml-2")}>Voir le détail</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <View style={{ paddingTop: 10, paddingBottom: 50 }}>
          <LineChart
            spacing={chartSpacing}
            yAxisSide={1}
            adjustToWidth={true}
            xAxisLabelTextStyle={
              active === "7days"
                ? { paddingLeft: 15, height: 20, marginTop: 10, fontWeight: "bold", color: TW_COLORS.CNAM_PRIMARY_700 }
                : { fontSize: 10, color: "#666", width: 60, textAlign: "center" }
            }
            // scrollToIndex={data.length - 1}
            xAxisTextNumberOfLines={1}
            xAxisLabelsHeight={20}
            xAxisThickness={0}
            xAxisColor={"transparent"}
            width={screenWidth - 72}
            focusEnabled={true}
            // focusProximity={50}
            lineSegments={lineSegments}
            lineSegments2={lineSegments2}
            onFocus={(item, index) => {
              // console.log("focused", item, index);
              setDisplayItem(item);
              setSelectedPointIndex(index);
            }}
            focusedDataPointIndex={selectedPointIndex}
            unFocusOnPressOut={false}
            showStripOnFocus={true}
            stripColor={TW_COLORS.CNAM_PRIMARY_700}
            stripHeight={400}
            stripWidth={2}
            showTextOnFocus={true}
            focusTogether={true}
            xAxisLabelsVerticalShift={0}
            // showXAxisIndices={true}
            showYAxisIndices={false}
            yAxisLabelWidth={0}
            yAxisIndicesWidth={0}
            xAxisIndicesWidth={2}
            xAxisIndicesColor={"#999"}
            stepValue={1}
            scrollRef={ref}
            onScroll={(event) => {
              if (event?.nativeEvent?.contentOffset?.x !== undefined) {
                currentScrollX.current = event.nativeEvent.contentOffset.x;
              }
            }}
            data={(data || []).map((d, index) => {
              const needShift = dataB[index].value === d.value;
              return {
                ...d,
                label: index % labelSpacing === 0 ? formatLabel(d.label) : "", // Show label based on active period
                focusedCustomDataPoint: () => {
                  return customDataPoint({ color: "#3D6874", backgroundColor: "white", isSelected: true, noValue: d.noValue });
                },
                customDataPoint: () => {
                  return customDataPoint({
                    color: "#3D6874",
                    backgroundColor: "white",
                    isSelected: false,
                    noValue: d.noValue,
                    onPress: () => {
                      setSelectedPointIndex(index);
                    },
                  });
                },
                focusedDataPointWidth: needShift ? 35 : 20,
                dataPointWidth: needShift ? 25 : 15,
              };
            })}
            onPress={() => {
              console.log("lcs on press");
            }}
            xAxisIndicesHeight={10}
            // noOfSectionsBelowXAxis={1}
            data2={
              dataB
                ? dataB.map((d, index) => ({
                    ...d,
                    label: index % labelSpacing === 0 ? formatLabel(d.label) : "", // Show label based on active period
                    focusedCustomDataPoint: () => {
                      const needShift = data[index].value === d.value;
                      return customDataPoint({
                        needShift: true,
                        color: "#00A5DF",
                        backgroundColor: "#00A5DF",
                        isSelected: true,
                        noValue: d.noValue,
                      });
                    },
                    onFocus: () => {},
                    customDataPoint: () => {
                      const needShift = data[index].value === d.value;
                      return customDataPoint({
                        needShift: true,
                        color: "#00A5DF",
                        backgroundColor: "#00A5DF",
                        isSelected: false,
                        noValue: d.noValue,
                      });
                    },
                  }))
                : null
            }
            data3={
              treatment
                ? (treatment || []).map((t, index) => ({
                    ...t,
                    label: index % labelSpacing === 0 ? formatLabel(t.label) : "", // Show label based on active period
                    customDataPoint: () => {
                      return customDataPointTreatment({
                        color: TW_COLORS.CNAM_PRIMARY_800,
                        backgroundColor: TW_COLORS.CNAM_PRIMARY_800,
                        isSelected: false,
                        needShift: false,
                        noValue: t.noValue,
                        value: t.treatmentValue,
                      });
                    },
                    focusedCustomDataPoint: () => {
                      return customDataPointTreatment({
                        color: TW_COLORS.CNAM_PRIMARY_800,
                        backgroundColor: TW_COLORS.CNAM_PRIMARY_800,
                        isSelected: true,
                        needShift: false,
                        noValue: t.noValue,
                        value: t.treatmentValue,
                      });
                    },
                  }))
                : null
            }
            data4={
              treatmentSiBesoin
                ? (treatmentSiBesoin || []).map((t, index) => ({
                    ...t,
                    label: index % labelSpacing === 0 ? formatLabel(t.label) : "", // Show label based on active period
                    customDataPoint: () => {
                      return customDataPoint({
                        color: TW_COLORS.CNAM_PRIMARY_800,
                        backgroundColor: TW_COLORS.CNAM_PRIMARY_800,
                        noValue: t.noValue,
                        isSelected: false,
                        needShift: false,
                        // value: t.treatmentValue,
                      });
                    },
                    focusedCustomDataPoint: () => {
                      return customDataPoint({
                        color: TW_COLORS.CNAM_PRIMARY_800,
                        backgroundColor: TW_COLORS.CNAM_PRIMARY_800,
                        isSelected: true,
                        noValue: t.noValue,
                        needShift: false,
                        // value: t.treatmentValue,
                      });
                    },
                  }))
                : null
            }
            getPointerProps={({ pointerIndex }) => {
              const item = data[pointerIndex] || dataB[pointerIndex];
              setSelectedPointIndex(pointerIndex);
              setDisplayItem(item);
            }}
            pointerConfig={{
              activatePointersOnLongPress: true,
              persistPointer: true,
              activatePointersDelay: 500,
              pointerColor: "transparent",
              pointerStripWidth: 2,
              width: 20,
              height: 20,
              showPointerStrip: false,
              pointerStripColor: TW_COLORS.CNAM_PRIMARY_700,
              pointerStripUptoDataPoint: false,
              pointerLabelWidth: 40,
              pointerLabelHeight: 100,
            }}
            overflowBottom={0} // space at the bottom of graph
            // overflowTop={5}
            dataPointsWidth1={15}
            dataPointsHeight1={15}
            dataPointsHeight2={15}
            dataPointsWidth2={15}
            dataPointsHeight3={15}
            dataPointsWidth3={15}
            dataPointsHeight4={15}
            dataPointsWidth4={15}
            focusedDataPointHeight={20}
            focusedDataPointWidth={20}
            showDataPointLabelOnFocus={false}
            thickness3={20}
            thickness4={20}
            color2={"#00A5DF"}
            color1={"#3D6874"}
            color3="transparent"
            color4="transparent"
            yAxisColor={"transparent"}
            formatYLabel={(lab) => {
              if (lab === "-1" || lab === "-2" || lab === "6" || lab === "0") {
                return "";
              }
              //return "";
              return parseInt(lab, 10).toString();
            }}
            yAxisOffset={-2}
            noOfSectionsBelowXAxis={0}
            noOfSections={8}
            // use to hide the horizontal lines and show the yellow background
            showReferenceLine1={true}
            referenceLine1Position={-0.32}
            referenceLinesOverChartContent={false}
            referenceLine1Config={{
              thickness: 20,
              color: "#FCF2D9",
              dashGap: -1,
            }}
            // use to hide the horizontal lines
            showReferenceLine2={true}
            referenceLine2Position={-1.32}
            referenceLine2Config={{
              thickness: 20,
              color: "white",
              dashGap: -1,
            }}
            showReferenceLine3={true}
            referenceLine3Position={5.5}
            referenceLine3Config={{
              thickness: 20,
              color: "white",
              dashGap: -1,
            }}
            showVerticalLines={false}
            verticalLinesColor="rgba(24, 26, 26, 0.1)"
            // verticalLinesThickness={0}
            noOfVerticalLines={5}
            strokeDashArray1={[4, 4]}
            curved={true}
            curvature={0.1}
            initialSpacing={0}
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
                    strokeDasharray={index === 0 ? [] : ["4,4"]} // pattern: 4px dash, 4px gap
                  />
                </Svg>
              </View>
            ))}
          </View>
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
              <View className="bg-cnam-primary-950 rounded-full h-4 w-4" />
              <Text className="text-primary-900">Prise d'un "si besoin"</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
