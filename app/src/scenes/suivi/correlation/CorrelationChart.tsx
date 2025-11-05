import { useBottomSheet } from "@/context/BottomSheetContext";
import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { mergeClassNames } from "@/utils/className";
import { TW_COLORS } from "@/utils/constants";
import { formatRelativeDate } from "@/utils/date/helpers";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { INDICATOR_LABELS, DEFAULT_INDICATOR_LABELS } from "@/utils/liste_indicateurs.1";
import { typography } from "@/utils/typography";
import ArrowUpSvg from "@assets/svg/icon/ArrowUp";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";
import EyeIcon from "@assets/svg/icon/Eye";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Line } from "react-native-svg";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function TestChart({
  data,
  dataB,
  treatment,
  treatmentSiBesoin,
  diaryData,
  selectedIndicators,
  navigation,
  openIndicatorBottomSheet,
  showTreatment,
  initialSelectedPointIndex,
  displayfixed,
  spacingFormat,
  setDisplayItem,
  setSelectedPointIndex,
}) {
  const ref = useRef(null);
  const hasScrolledToEnd = useRef(false);
  const currentScrollX = useRef(0);
  const previousSpacing = useRef(20); // Default spacing for "1month"
  const pointerItemRef = useRef(null);

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
    if (spacingFormat === "7days") {
      return getDayInitial(dateString);
    }
    return formatDateToFrench(dateString);
  };

  // Calculate spacing based on active period
  const chartSpacing = useMemo(() => {
    switch (spacingFormat) {
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
  }, [spacingFormat]);

  // Dynamic label spacing based on active period
  const labelSpacing = useMemo(() => {
    if (spacingFormat === "7days") {
      return 1;
    } else if (spacingFormat === "1month") {
      return 3;
    } else if (spacingFormat === "3months") {
      return 10;
    } else {
      return 20;
    } // Show all labels for 7 days, skip for others
  }, [spacingFormat]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const showOrHidePointer = (ind) => {
    ref.current?.scrollTo({
      x: ind * 200 - 25,
    }); // adjust as per your UI
  };
  const lineSegments = null; //generateLineSegments(data);
  const lineSegments2 = null; //generateLineSegments(dataB);

  return (
    <LineChart
      spacing={chartSpacing}
      yAxisSide={1}
      adjustToWidth={true}
      xAxisLabelTextStyle={
        spacingFormat === "7days"
          ? { paddingLeft: 15, height: 20, marginTop: 10, fontWeight: "bold", color: TW_COLORS.CNAM_PRIMARY_700 }
          : { fontSize: 10, color: "#666", width: 60, textAlign: "center" }
      }
      // scrollToIndex={data.length - 1}
      xAxisTextNumberOfLines={1}
      xAxisLabelsHeight={20}
      xAxisThickness={0}
      xAxisColor={"transparent"}
      width={screenWidth - 72}
      focusEnabled={!displayfixed}
      disableScroll={displayfixed}
      // focusProximity={50}
      lineSegments={lineSegments}
      lineSegments2={lineSegments2}
      onFocus={(item, index) => {
        console.log("focused", item, data[index], index);
        setDisplayItem(data[index]);
        setSelectedPointIndex(index);
      }}
      //   focusedDataPointIndex={selectedPointIndex}
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
        treatment && showTreatment
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
        treatmentSiBesoin && showTreatment
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
        if (displayfixed) return;
        const item = data[pointerIndex] || dataB[pointerIndex];
        setSelectedPointIndex(pointerIndex);
        console.log("LCS pointerIndex", pointerIndex, item);
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
        showPointerStrip: !!displayfixed,
        initialPointerIndex: displayfixed ? initialSelectedPointIndex : null,
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
      yAxisOffset={showTreatment ? -2 : 0}
      noOfSectionsBelowXAxis={0}
      noOfSections={showTreatment ? 8 : 5}
      // use to hide the horizontal lines and show the yellow background
      showReferenceLine1={showTreatment}
      referenceLine1Position={-0.32}
      referenceLinesOverChartContent={false}
      referenceLine1Config={{
        thickness: 20,
        color: "#FCF2D9",
        dashGap: -1,
      }}
      // use to hide the horizontal lines
      showReferenceLine2={true}
      referenceLine2Position={showTreatment ? -1.32 : -0.32}
      referenceLine2Config={{
        thickness: 20,
        color: "white",
        dashGap: -1,
      }}
      showReferenceLine3={true}
      referenceLine3Position={showTreatment ? 5.5 : 4.5}
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
  );
}
