import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, FlatList } from "react-native";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { DiaryDataContext } from "@/context/diaryData";
import { Indicator } from "@/entities/Indicator";
import { beforeToday, formatRelativeDate, getArrayOfDates } from "@/utils/date/helpers";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { IndicatorsBottomSheet } from "@/components/IndicatorsBottomSheet";
import { colorsMap, scoresMapIcon, TW_COLORS } from "@/utils/constants";
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
import { DiaryEntry } from "@/entities/DiaryData";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

interface ModalCorrelationScreenProps {
  navigation: any;
  route?: any;
}

const computeIndicatorLabel = (indicator, value): string => {
  if (value === null) return "";
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

const computeIndicatorColor = (
  indicator,
  value
): {
  color: string;
  borderColor?: string;
} => {
  if (value === null) return "";
  let index = indicator.type === INDICATOR_TYPE.gauge ? Math.min(Math.floor(value * 5), 4) : value;

  // For smiley-type indicators sorted in DESC order, invert the label index.
  if (indicator.order === "DESC" && indicator.type === INDICATOR_TYPE.smiley) {
    index = 6 - index; // Inverse 1→5, 2→4, 3→3, 4→2, 5→1
  }
  console.log("lcs toto", value, index);
  return scoresMapIcon[index];
};

export const DetailModalCorrelationScreen: React.FC<ModalCorrelationScreenProps> = ({ navigation, route }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>(route.params.selectedIndicators || []);
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
    return data;
  }, [diaryData, selectedIndicators]); // 👈 recalcul dès que rawData ou filters changent
  const { displayItem } = route.params as { displayItem: DiaryEntry };
  return (
    <View className="flex-1 bg-cnam-primary-25">
      <View className="flex-col justify-between top-0 w-full bg-cnam-primary-800 p-4 items-center">
        <View className="flex-row w-full justify-end">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="flex-row items-center justify-end"
          >
            <CrossIcon color={"white"} />
          </TouchableOpacity>
        </View>
        <View className="flex-row h-[96] w-full justify-between items-center">
          <Text className={mergeClassNames(typography.displayXsBold, "text-white")}>{formatRelativeDate(route.params.displayItem.date)}</Text>
        </View>
        <View className="bg-white/5 rounded-2xl p-4 w-full">
          {route.params.displayItem &&
            selectedIndicators.map((indicator, index) => {
              let value;
              try {
                value = diaryData[route.params.displayItem.date][getIndicatorKey(indicator)].value;
              } catch (e) {}
              return (
                <View key={index} className="flex-row items-center space-x-2">
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
                  <Text key={indicator.uuid} className={mergeClassNames(typography.textMdMedium, "text-white ")}>
                    <Text className={mergeClassNames(typography.textMdSemibold, "text-white")}>{indicator.name} : </Text>
                    {computeIndicatorLabel(indicator, value)}
                  </Text>
                </View>
              );
            })}
          <View className="flex-row items-center space-x-2">
            <View className="w-[30] items-center justify-center">
              <CrossIcon color={"white"} />
            </View>
            <Text className={mergeClassNames(typography.textMdMedium, "text-white ")}>
              <Text className={mergeClassNames(typography.textMdSemibold, "text-white")}>Traitement : </Text>
              {displayItem["PRISE_DE_TRAITEMENT"] ? "Pris correctement" : "Non"}
            </Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-[30] items-center">
              <View className="w-[15] h-[15] bg-cnam-primary-950 rounded-full"></View>
            </View>
            <Text className={mergeClassNames(typography.textMdMedium, "text-white ")}>
              <Text className={mergeClassNames(typography.textMdSemibold, "text-white")}>Prise d'un "si besoin" : </Text>
              {displayItem["PRISE_DE_TRAITEMENT_SI_BESOIN"] ? "Pris correctement" : "Non"}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-col pt-4 bg-cnam-primary-25 " showsHorizontalScrollIndicator={false}>
        <View className="px-4 pb-20">
          <TestChart
            displayItem={displayItem}
            data={dataToDisplay[0]}
            dataB={dataToDisplay[1]}
            treatment={undefined}
            diaryData={diaryData}
            navigation={navigation}
            selectedIndicators={selectedIndicators}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const TestChart = ({ data, dataB, treatment, diaryData, selectedIndicators, navigation, displayItem }) => {
  const ref = useRef(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState("7days");
  const pointerItemRef = useRef(null);
  console.log(diaryData[displayItem.date]);
  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

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
  const lineSegments = null; //generateLineSegments(data);
  const lineSegments2 = null; //generateLineSegments(dataB);
  return (
    <View className="bg-cnam-primary-25 flex-column space-y-4">
      <View className="border border-cnam-cyan-lighten-80 p-4 rounded-2xl bg-white">
        <View style={{ paddingTop: 10, paddingBottom: 50 }}>
          <LineChart
            spacing={50}
            yAxisSide={1}
            adjustToWidth={true}
            xAxisLabelTextStyle={{ fontSize: 10, color: "#666", width: 60, textAlign: "center" }}
            xAxisTextNumberOfLines={1}
            xAxisLabelsHeight={10}
            xAxisThickness={0}
            xAxisColor={"transparent"}
            width={screenWidth - 70}
            focusEnabled={true}
            // focusProximity={50}
            lineSegments={lineSegments}
            lineSegments2={lineSegments2}
            onFocus={(item, index) => {
              console.log("focused", item, index);
              // setDisplayItem(item);
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
            xAxisLabelsVerticalShift={40}
            showXAxisIndices={true}
            showYAxisIndices={false}
            yAxisLabelWidth={0}
            yAxisIndicesWidth={0}
            xAxisIndicesWidth={2}
            xAxisIndicesColor={"#999"}
            noOfSections={5}
            noOfSectionsBelowXAxis={0}
            stepValue={1}
            scrollRef={ref}
            data={(data || []).map((d, index) => {
              const needShift = dataB[index].value === d.value;
              return {
                ...d,
                label: index % labelSpacing === 0 ? formatDateToFrench(d.label) : "", // Show label only at intervals with French format
                focusedCustomDataPoint: () => {
                  return customDataPoint({ color: "#3D6874", backgroundColor: "white", isSelected: true, noValue: d.noValue });
                },
                customDataPoint: () => {
                  return customDataPoint({ color: "#3D6874", backgroundColor: "white", isSelected: false, noValue: d.noValue });
                },
                focusedDataPointWidth: needShift ? 35 : 20,
                dataPointWidth: needShift ? 25 : 15,
              };
            })}
            onPress={() => {
              console.log("lcs on press");
            }}
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
                      const needShift = data[index].value === d.value;
                      return customDataPoint({
                        needShift: true,
                        color: "#00A5DF",
                        backgroundColor: "#00A5DF",
                        isSelected: true,
                        noValue: d.noValue,
                      });
                    },
                    onFocus: () => {
                      console.log("LCS TOTO1");
                    },
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
                    label: index % labelSpacing === 0 ? formatDateToFrench(t.label) : "", // Show label only at intervals with French format
                    customDataPoint: () => {
                      const isSelected = selectedPointIndex === index;

                      return (
                        <View
                          key={index}
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
                              // shadowColor: isSelected ? "#134449" : "transparent",
                              // shadowOffset: { width: 0, height: 0 },
                              // shadowOpacity: isSelected ? 0.5 : 0,
                              // shadowRadius: isSelected ? 8 : 0,
                              // elevation: isSelected ? 8 : 0,
                            }}
                          />
                        </View>
                      );
                    },
                  }))
                : null
            }
            getPointerProps={({ pointerIndex }) => {
              console.log("lCS TOOT");
              const item = data[pointerIndex] || dataB[pointerIndex];
              setSelectedPointIndex(pointerIndex);
              // setDisplayItem(item);
            }}
            pointerConfig={{
              onPointerEnter: (item) => {
                console.log(item);
              },
              activatePointersOnLongPress: true,
              persistPointer: true,
              activatePointersDelay: 500,
              pointerColor: "transparent",
              pointerStripWidth: 2,
              width: 20,
              height: 20,
              showPointerStrip: false,
              pointerStripColor: TW_COLORS.CNAM_PRIMARY_700,
              // pointer1Color: "#00A5DF",
              // pointer2Color: "#3D6874",
              pointerStripUptoDataPoint: false,
              pointerLabelWidth: 40,
              pointerLabelHeight: 100,
              // pointerComponent: (item) => {
              //   return customDataPoint({ color: "red", isSelected: true });
              // },
              // pointerLabelComponent: (items) => {
              //   return (
              //     <View
              //       style={{
              //         height: 90,
              //         width: 100,
              //         justifyContent: "center",
              //         marginTop: -30,
              //         marginLeft: -40,
              //       }}
              //     >
              //       <Text style={{ color: "white", fontSize: 14, marginBottom: 6, textAlign: "center" }}>{items[0].date}</Text>

              //       <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: "white" }}>
              //         <Text style={{ fontWeight: "bold", textAlign: "center" }}>{"$" + items[0].value + ".0"}</Text>
              //       </View>
              //     </View>
              //   );
              // },
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
              //return "";
              return parseInt(lab, 10).toString();
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
        <View className="bg-cnam-primary-25 p-4 mt-4 rounded-2xl flex-col space-y-2">
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
      <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900 pt-6 pb-4")}>Ce jours là :</Text>
      {diaryData[displayItem.date] &&
        Object.keys(diaryData[displayItem.date]).map((key) => {
          if (diaryData[displayItem.date][key]?._indicateur) {
            const colors = computeIndicatorColor(diaryData[displayItem.date][key]._indicateur, diaryData[displayItem.date][key].value);
            return (
              <View key={key} className="flex-row items-center space-x-2">
                <View
                  className="h-5 w-5 rounded-full"
                  style={{
                    backgroundColor: colors?.color,
                    borderColor: colors?.borderColor,
                    borderWidth: 1,
                  }}
                ></View>
                <Text className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900")}>
                  <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-900")}>
                    {diaryData[displayItem.date][key]?._indicateur?.name}:{" "}
                  </Text>
                  {computeIndicatorLabel(diaryData[displayItem.date][key]._indicateur, diaryData[displayItem.date][key].value)}
                </Text>
              </View>
            );
          } else return;
        })}
    </View>
  );
};
