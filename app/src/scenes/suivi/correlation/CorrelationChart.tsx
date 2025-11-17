import { TW_COLORS } from "@/utils/constants";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Text } from "react-native";
import { LineChart, ruleTypes } from "react-native-gifted-charts";
import Svg, { Circle, Line } from "react-native-svg";
import { useDevCorrelationConfig } from "@/hooks/useDevCorrelationConfig";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

const screenWidth = Dimensions.get("window").width;

// Constants
const DAY_INITIALS = ["D", "L", "M", "M", "J", "V", "S"];
const MONTH_NAMES_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const SPACING_CONFIG = {
  "7days": 45,
  "1month": 10,
  "3months": 5,
  "6months": 1,
  default: 70,
};
const LABEL_SPACING_CONFIG = {
  "7days": 1,
  "1month": 10,
  "3months": 10,
  default: 1,
};
const LABEL_HEIGHT = 20;

// Type definitions for memoized components
interface DataPointProps {
  item: any;
  isSelected: boolean;
}

interface TreatmentPointProps {
  item: any;
  isSelected: boolean;
}

// Memoized data point components for better performance
const MemoizedDataPoint = React.memo(
  ({ item, isSelected }: DataPointProps) => {
    if (item?.noValue) return null;

    const needShift = item?.needShift || false;
    const size = isSelected ? 20 : 14;
    const strokeWidth = isSelected ? 6 : 3;
    const radius = (size - strokeWidth) / 2;

    return (
      <Svg
        width={size}
        height={size}
        style={{
          top: needShift ? -10 : 0,
          alignSelf: "center",
        }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={item?.backgroundColor || "white"}
          stroke={item?.color || "#3D6874"}
          strokeWidth={strokeWidth}
        />
      </Svg>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.item?.value === nextProps.item?.value &&
      prevProps.item?.color === nextProps.item?.color &&
      prevProps.item?.backgroundColor === nextProps.item?.backgroundColor &&
      prevProps.item?.needShift === nextProps.item?.needShift &&
      prevProps.item?.noValue === nextProps.item?.noValue
    );
  }
);

const MemoizedTreatmentPoint = React.memo(
  ({ item, isSelected }: TreatmentPointProps) => {
    if (item?.noValue) return null;

    return (
      <View
        style={{
          width: isSelected ? 20 : 14,
          height: isSelected ? 20 : 14,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item?.treatmentValue === true ? (
          <CheckMarkIcon width={isSelected ? 20 : 15} height={isSelected ? 20 : 15} color={"#134449"} />
        ) : (
          <CrossIcon width={isSelected ? 20 : 15} height={isSelected ? 20 : 15} color={"#518B9A"} />
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.item?.treatmentValue === nextProps.item?.treatmentValue &&
      prevProps.item?.noValue === nextProps.item?.noValue
    );
  }
);

// Dashed Vertical Line Component
interface DashedVerticalLineProps {
  height?: number;
  color?: string;
  dashArray?: string;
  strokeWidth?: number;
  className?: string;
}

export const DashedVerticalLine: React.FC<DashedVerticalLineProps> = ({
  height = 100,
  color = "#3D6874",
  dashArray = "4,4",
  strokeWidth = 2,
  className,
}) => {
  return (
    <Svg height={height} width={strokeWidth * 2} className={className}>
      <Line x1={strokeWidth} y1={0} x2={strokeWidth} y2={height} stroke={color} strokeWidth={strokeWidth} strokeDasharray={dashArray} />
    </Svg>
  );
};

export default function TestChart({
  data,
  dataB,
  treatment,
  treatmentSiBesoin,
  showTreatment,
  initialSelectedPointIndex,
  displayfixed,
  spacingFormat,
  setDisplayItem,
  setSelectedPointIndex,
  selectedPointIndex,
  enablePagination = true,
}) {
  const { config } = useDevCorrelationConfig();
  const CHUNK_SIZE = config.chunkSize;

  const ref = useRef<ScrollView>(null);
  const hasScrolledToEnd = useRef(false);
  const currentScrollX = useRef(0);
  const previousSpacing = useRef(20); // Default spacing for "1month"
  const responderMoveTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentPointerIndex = useRef<number | null>(null);
  const [responderMove, setResponderMove] = useState(false);
  const [onStartReached, setOnStartReached] = useState(false);

  // Chunked data loading state
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousDataLength = useRef(0);

  // Track visible range for viewport
  const visibleRangeRef = useRef({ first: 0, last: 0 });

  // Calculate spacing based on active period (must be before other hooks that use it)
  const chartSpacing = useMemo(() => {
    return SPACING_CONFIG[spacingFormat] || SPACING_CONFIG.default;
  }, [spacingFormat]);

  // Initialize visible range to show last CHUNK_SIZE items (only if pagination is enabled)
  useEffect(() => {
    if (data && data.length > 0 && enablePagination) {
      const initialStart = Math.max(0, data.length - CHUNK_SIZE);
      setVisibleStartIndex(initialStart);
      previousDataLength.current = data.length;
    } else if (data && data.length > 0 && !enablePagination) {
      setVisibleStartIndex(0);
    }
  }, [data?.length, enablePagination]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (responderMoveTimeout.current) {
        clearTimeout(responderMoveTimeout.current);
      }
    };
  }, []);

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

  // Helper function to check if item is in viewport
  const isItemInViewport = useCallback(
    (index: number) => {
      const scrollX = currentScrollX.current;
      const viewportWidth = screenWidth - 72;

      const firstVisible = Math.floor(scrollX / chartSpacing);
      const lastVisible = Math.ceil((scrollX + viewportWidth) / chartSpacing);
      if (index >= firstVisible && index <= lastVisible) {
      }
      return index >= firstVisible && index <= lastVisible;
    },
    [chartSpacing, screenWidth]
  );

  // Optimized custom data point renderers using memoized components
  // Returns null if item is NOT in viewport (when optimization is enabled), otherwise renders the component
  const renderCustomDataPoint = useCallback(
    (item, index, isSelected) => {
      if (config.useViewportOptimization && !isItemInViewport(index)) {
        return null;
      }
      if (
        (config.hideDataPoints || spacingFormat === "1month" || spacingFormat === "3months" || spacingFormat === "6months") &&
        !item.isTreatmentSiBesoin
      ) {
        return null;
      }
      return <MemoizedDataPoint item={item} isSelected={isSelected} />;
    },
    [config.useViewportOptimization, isItemInViewport]
  );

  const renderCustomDataPointTreatment = useCallback(
    (item, index, isSelected) => {
      if (config.useViewportOptimization && !isItemInViewport(index)) {
        return null;
      }
      return <MemoizedTreatmentPoint item={item} isSelected={isSelected} />;
    },
    [config.useViewportOptimization, isItemInViewport]
  );

  // Helper functions - memoized
  const getDayInitial = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return DAY_INITIALS[date.getDay()];
  }, []);

  const formatDateToFrench = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  }, []);

  const isFirstDayOfMonth = useCallback((dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    return date.getDate() === 1;
  }, []);

  const isMonday = useCallback((dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    return date.getDay() === 1; // Monday is day 1 in JavaScript
  }, []);

  const formatShortDate = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}`;
  }, []);

  const formatMonthYear = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const month = MONTH_NAMES_FR[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  }, []);

  const formatLabel = useCallback(
    (dateString) => {
      if (spacingFormat === "7days") {
        return getDayInitial(dateString);
      }
      if (spacingFormat === "1month") {
        return isMonday(dateString) ? formatShortDate(dateString) : "";
      }
      if (spacingFormat === "3months") {
        return isFirstDayOfMonth(dateString) ? formatMonthYear(dateString) : "";
      }
      return formatDateToFrench(dateString);
    },
    [spacingFormat, getDayInitial, formatDateToFrench, isFirstDayOfMonth, formatMonthYear, isMonday, formatShortDate]
  );

  // Dynamic label spacing based on active period
  const labelSpacing = useMemo(() => {
    return LABEL_SPACING_CONFIG[spacingFormat] || LABEL_SPACING_CONFIG.default;
  }, [spacingFormat]);

  // Get visible data slice (all data if pagination is disabled)
  const visibleData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!enablePagination) return data;
    return data.slice(visibleStartIndex);
  }, [data, visibleStartIndex, enablePagination]);

  const visibleDataB = useMemo(() => {
    if (!dataB || dataB.length === 0) return null;
    if (!enablePagination) return dataB;
    return dataB.slice(visibleStartIndex);
  }, [dataB, visibleStartIndex, enablePagination]);

  const visibleTreatment = useMemo(() => {
    if (!treatment || !showTreatment) return null;
    if (!enablePagination) return treatment;
    return treatment.slice(visibleStartIndex);
  }, [treatment, showTreatment, visibleStartIndex, enablePagination]);

  const visibleTreatmentSiBesoin = useMemo(() => {
    if (!treatmentSiBesoin || !showTreatment) return null;
    if (!enablePagination) return treatmentSiBesoin;
    return treatmentSiBesoin.slice(visibleStartIndex);
  }, [treatmentSiBesoin, showTreatment, visibleStartIndex, enablePagination]);

  const customLabel = (val) => {
    return (
      <View
        style={{ width: spacingFormat === "7days" ? 20 : 50 }}
        className={mergeClassNames(
          spacingFormat === "7days" ? "ml-8" : "ml-4",
          "flex-row items-end overflow-visible" // 👈 ICI
        )}
      >
        <DashedVerticalLine height={LABEL_HEIGHT + 10} />
        <Text className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-700 absolute -bottom-2 left-2")}>
          {/* {" "} */}
          {/* <Text className="text-black">| </Text> */}
          {val}
        </Text>
      </View>
    );
  };
  // Memoized data transformations to prevent re-creating arrays on every render
  // Store rendering properties directly on data objects instead of creating function closures
  const transformedData = useMemo(() => {
    return (visibleData || []).map((d, index) => {
      const needShift = visibleDataB && visibleDataB[index]?.value === d.value;
      // For 3months and 1month spacing, always format the label (formatLabel will handle showing only first day of month)
      const label =
        spacingFormat === "3months" || spacingFormat === "1month" ? formatLabel(d.label) : index % labelSpacing === 0 ? formatLabel(d.label) : "";
      return {
        ...d,
        label,
        color: "#00A5DF",
        backgroundColor: "#00A5DF",
        needShift: false,
        dataPointColor: d.noValue ? "transparent" : "#00A5DF",
        // dataPointsColor: !config.useCustomRenderers ? undefined : "#3D6874",
        focusedDataPointWidth: !config.useCustomRenderers ? (needShift ? 35 : 20) : 20,
        focusedDataPointHeight: !config.useCustomRenderers ? undefined : 20,
        focusedDataPointColor: !config.useCustomRenderers ? undefined : d.noValue ? "transparent" : "#00A5DF",
        dataPointWidth: !config.useCustomRenderers ? (needShift ? 25 : 15) : undefined,
        // hideDataPoint: config.hideDataPoints || spacingFormat === "1month" || spacingFormat === "3months" || spacingFormat === "6months",
        labelComponent: label ? () => customLabel(label) : undefined,
      };
    });
  }, [visibleData, visibleDataB, labelSpacing, formatLabel, spacingFormat]);

  const transformedDataB = useMemo(() => {
    if (!visibleDataB) return null;
    return visibleDataB.map((d, index) => {
      const needShift = visibleData[index]?.value === d.value;
      // For 3months and 1month spacing, always format the label (formatLabel will handle showing only first day of month)
      // const label =
      //   spacingFormat === "3months" || spacingFormat === "1month" ? formatLabel(d.label) : index % labelSpacing === 0 ? formatLabel(d.label) : "";
      return {
        ...d,
        // label,
        color: "#3D6874",
        backgroundColor: "white",
        // backgroundColor: "#3D6874",
        dataPointColor: !config.useCustomRenderers ? undefined : d.noValue ? "transparent" : "#3D6874",
        focusedDataPointColor: !config.useCustomRenderers ? undefined : d.noValue ? "transparent" : "#3D6874",
        focusedDataPointWidth: !config.useCustomRenderers ? undefined : 20,
        focusedDataPointRadius: !config.useCustomRenderers ? undefined : 7,
        focusedDataPointHeight: !config.useCustomRenderers ? undefined : 20,
        needShift: true,
        // hideDataPoint: config.hideDataPoints || spacingFormat === "1month" || spacingFormat === "3months" || spacingFormat === "6months",
      };
    });
  }, [visibleDataB, visibleData, labelSpacing, formatLabel, spacingFormat]);

  const transformedTreatment = useMemo(() => {
    if (!visibleTreatment) return null;
    return (visibleTreatment || []).map((t, index) => {
      // For 3months and 1month spacing, always format the label (formatLabel will handle showing only first day of month)
      // const label =
      //   spacingFormat === "3months" || spacingFormat === "1month" ? formatLabel(t.label) : index % labelSpacing === 0 ? formatLabel(t.label) : "";
      return {
        ...t,
        // label,
        isTreatment: true,
        dataPointColor: t.noValue ? "transparent" : TW_COLORS.CNAM_PRIMARY_800,
        focusedDataPointColor: t.noValue ? "transparent" : TW_COLORS.CNAM_PRIMARY_800,

        dataPointShape: t.treatmentValue === true ? "rectangular" : "circular",
      };
    });
  }, [visibleTreatment, labelSpacing, formatLabel, spacingFormat]);

  const transformedTreatmentSiBesoin = useMemo(() => {
    if (!visibleTreatmentSiBesoin) return null;
    return (visibleTreatmentSiBesoin || []).map((t, index) => {
      // For 3months and 1month spacing, always format the label (formatLabel will handle showing only first day of month)
      // const label =
      //   spacingFormat === "3months" || spacingFormat === "1month" ? formatLabel(t.label) : index % labelSpacing === 0 ? formatLabel(t.label) : "";
      return {
        ...t,
        // label,
        color: TW_COLORS.CNAM_PRIMARY_800,
        dataPointColor: t.noValue ? "transparent" : TW_COLORS.CNAM_PRIMARY_800,
        focusedDataPointColor: t.noValue ? "transparent" : TW_COLORS.CNAM_PRIMARY_800,
        backgroundColor: TW_COLORS.CNAM_PRIMARY_800,
        isTreatmentSiBesoin: true,
      };
    });
  }, [visibleTreatmentSiBesoin, labelSpacing, formatLabel, spacingFormat]);

  // Handle loading more data when scrolling to start (only if pagination is enabled)
  useEffect(() => {
    if (!enablePagination) return;

    if (onStartReached && !isLoadingMore && visibleStartIndex > 0) {
      setIsLoadingMore(true);

      // Calculate how many items to load
      const itemsToLoad = Math.min(CHUNK_SIZE, visibleStartIndex);
      const newStartIndex = visibleStartIndex - itemsToLoad;

      // Store current scroll position relative to data
      const currentDataIndex = Math.floor((currentScrollX.current + (screenWidth - 72) / 2) / chartSpacing);

      // Update visible start index
      setVisibleStartIndex(newStartIndex);

      // After state update, adjust scroll position to maintain view
      setTimeout(() => {
        // The new scroll position needs to account for the prepended items
        const newScrollX = (currentDataIndex + itemsToLoad) * chartSpacing;
        ref.current?.scrollTo({ x: newScrollX, animated: false });
        currentScrollX.current = newScrollX;
        setIsLoadingMore(false);
      }, 50);

      setOnStartReached(false);
    } else if (onStartReached) {
      setOnStartReached(false);
    }
  }, [onStartReached, isLoadingMore, visibleStartIndex, chartSpacing, enablePagination]);

  // Auto-scroll to the end of the chart only on first load
  useEffect(() => {
    if (ref.current && transformedData && transformedData.length > 0) {
      // Small delay to ensure the chart is rendered
      setTimeout(() => {
        const scrollX = (transformedData.length - 1) * chartSpacing;
        ref.current?.scrollTo({ x: scrollX, animated: false });
        currentScrollX.current = scrollX;
        previousSpacing.current = chartSpacing;
        // hasScrolledToEnd.current = true;
      }, 100);
    }
  }, [transformedData?.length, chartSpacing]);

  // Optimized custom data point functions using memoized components
  const customDataPointRenderer = useCallback(
    (item, index) => {
      if (item?.isTreatment) {
        return renderCustomDataPointTreatment(item, index, false);
      }
      return renderCustomDataPoint(item, index, false);
    },
    [renderCustomDataPoint, renderCustomDataPointTreatment]
  );

  const focusedCustomDataPointRenderer = useCallback(
    (item, index) => {
      if (item?.isTreatment) {
        return renderCustomDataPointTreatment(item, index, true);
      }
      return renderCustomDataPoint(item, index, true);
    },
    [renderCustomDataPoint, renderCustomDataPointTreatment]
  );

  return (
    <LineChart
      spacing={chartSpacing}
      yAxisSide={1}
      adjustToWidth={true}
      // xAxisLabelTextStyle={
      //   spacingFormat === "7days"
      //     ? { paddingLeft: 15, height: 20, marginTop: 10, fontWeight: "bold", color: TW_COLORS.CNAM_PRIMARY_700 }
      //     : { fontSize: 10, color: "red", width: 120, textAlign: "center" }
      // }
      // scrollToIndex={data.length - 1}
      xAxisTextNumberOfLines={1}
      xAxisLabelsHeight={LABEL_HEIGHT}
      xAxisThickness={0}
      // hideDataPoints={config.hideDataPoints || spacingFormat === "3months" || spacingFormat === "6months"}
      xAxisColor={"transparent"}
      width={screenWidth - 72}
      focusEnabled={!displayfixed}
      disableScroll={displayfixed}
      onFocus={
        displayfixed
          ? undefined
          : (_item, index) => {
              const actualIndex = index;
              setDisplayItem(transformedData[actualIndex]);
              setSelectedPointIndex(actualIndex);
            }
      }
      focusedDataPointIndex={selectedPointIndex}
      unFocusOnPressOut={false}
      showStripOnFocus={true}
      stripColor={TW_COLORS.CNAM_PRIMARY_700}
      stripHeight={180}
      stripWidth={2}
      showTextOnFocus={true}
      focusTogether={true}
      xAxisLabelsVerticalShift={showTreatment ? -10 : -25}
      showXAxisIndices={false}
      showYAxisIndices={false}
      yAxisLabelWidth={0}
      yAxisIndicesWidth={0}
      xAxisIndicesWidth={2}
      xAxisIndicesColor={"#999"}
      stepValue={1}
      scrollRef={ref}
      onScroll={
        config.useViewportOptimization
          ? (event) => {
              if (event?.nativeEvent?.contentOffset?.x !== undefined) {
                currentScrollX.current = event.nativeEvent.contentOffset.x;

                // Update visible range for viewport tracking
                const scrollX = event.nativeEvent.contentOffset.x;
                const viewportWidth = screenWidth - 72;
                visibleRangeRef.current = {
                  first: Math.floor(scrollX / chartSpacing),
                  last: Math.ceil((scrollX + viewportWidth) / chartSpacing),
                };
              }
            }
          : undefined
      }
      data={transformedData}
      xAxisIndicesHeight={10}
      data2={transformedDataB}
      data3={transformedTreatment}
      data4={transformedTreatmentSiBesoin}
      customDataPoint={config.useCustomRenderers ? customDataPointRenderer : undefined}
      focusedCustomDataPoint={config.useCustomRenderers ? focusedCustomDataPointRenderer : undefined}
      dataPointsColor2={config.useCustomRenderers ? undefined : "#3D6874"}
      dataPointsShape1={config.useCustomRenderers ? undefined : "rectangular"}
      dataPointsColor1="#00A5DF"
      getPointerProps={({ pointerIndex }) => {
        if (displayfixed) return;
        // Always store the current pointer index
        currentPointerIndex.current = pointerIndex;
        const actualIndex = pointerIndex;
        // const actualIndex = visibleStartIndex + pointerIndex;
        const item = transformedData[actualIndex] || (transformedDataB && transformedDataB[actualIndex]);
        // if (!item || !item.noValue) {
        if (responderMove) {
          setSelectedPointIndex(actualIndex);
          setDisplayItem(item);
        }
        // }
      }}
      pointerConfig={{
        activatePointersInstantlyOnTouch: false,
        activatePointersOnLongPress: true,
        onResponderMove: displayfixed
          ? undefined
          : () => {
              // Set timeout to delay the state change
              if (!responderMove) {
                responderMoveTimeout.current = setTimeout(() => {
                  setResponderMove(true);
                  // Immediately update with the stored pointer index
                  if (currentPointerIndex.current !== null) {
                    const index = currentPointerIndex.current;
                    const actualIndex = visibleStartIndex + index;
                    const item = transformedData[actualIndex] || (transformedDataB && transformedDataB[actualIndex]);
                    setSelectedPointIndex(actualIndex);
                    setDisplayItem(item);
                  }
                }, 150);
              } else {
                if (currentPointerIndex.current !== null) {
                  const index = currentPointerIndex.current;
                  const actualIndex = visibleStartIndex + index;
                  const item = transformedData[actualIndex] || (transformedDataB && transformedDataB[actualIndex]);
                  setSelectedPointIndex(actualIndex);
                  setDisplayItem(item);
                }
              }
              if (responderMove) {
                if (currentPointerIndex.current !== null) {
                  const index = currentPointerIndex.current;
                  const actualIndex = visibleStartIndex + index;
                  const item = transformedData[actualIndex] || (transformedDataB && transformedDataB[actualIndex]);
                  setSelectedPointIndex(actualIndex);
                  setDisplayItem(item);
                }
              }
            },
        onResponderEnd: displayfixed
          ? undefined
          : () => {
              // Cancel pending timeout
              if (responderMoveTimeout.current) {
                clearTimeout(responderMoveTimeout.current);
                responderMoveTimeout.current = null;
              }
              setResponderMove(false);
            },
        persistPointer: false,
        activatePointersDelay: displayfixed ? 50000 : 150,
        pointerColor: "transparent",
        pointerStripWidth: 2,
        width: 20,
        height: 20,
        showPointerStrip: displayfixed,
        initialPointerIndex: displayfixed ? initialSelectedPointIndex : null,
        pointerStripColor: TW_COLORS.CNAM_PRIMARY_700,
        pointerStripUptoDataPoint: false,
        pointerLabelWidth: 40,
        pointerLabelHeight: 100,
      }}
      overflowBottom={0} // space at the bottom of graph
      overflowTop={2}
      dataPointsWidth2={config.useCustomRenderers ? 15 : 10}
      dataPointsHeight2={config.useCustomRenderers ? 15 : 10}
      dataPointsHeight1={15}
      dataPointsWidth1={15}
      dataPointsHeight3={15}
      dataPointsWidth3={15}
      dataPointsHeight4={15}
      dataPointsWidth4={15}
      focusedDataPointHeight={config.useCustomRenderers ? 20 : 15}
      focusedDataPointWidth={config.useCustomRenderers ? 20 : 15}
      showDataPointLabelOnFocus={false}
      thickness3={20}
      thickness4={20}
      color2={"#3D6874"}
      color1={"#00A5DF"}
      color3={"transparent"}
      color4={"transparent"}
      dataPointsColor3={config.useCustomRenderers ? "transparent" : "#3D6874"}
      dataPointsColor4={config.useCustomRenderers ? "transparent" : "#3D6874"}
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
        type: ruleTypes.SOLID,
        //dashGap: -1,
      }}
      // use to hide the horizontal lines
      showReferenceLine2={true}
      referenceLine2Position={showTreatment ? -1.32 : -0.32}
      referenceLine2Config={{
        thickness: 20,
        type: ruleTypes.SOLID,
        color: "white",
      }}
      showReferenceLine3={showTreatment}
      referenceLine3Position={showTreatment ? 5.5 : 4.5}
      referenceLine3Config={{
        thickness: 20,
        color: "white",
        type: ruleTypes.SOLID,
      }}
      showVerticalLines={false}
      verticalLinesColor="rgba(24, 26, 26, 0.1)"
      // verticalLinesThickness={0}
      noOfVerticalLines={5}
      strokeDashArray2={[4, 1]} // bug other dash array are sometimes no consistent (the space between dashes vary)
      curved={false} // set false to improve performance on android
      curvature={0.1}
      initialSpacing={0}
      onStartReached={enablePagination ? () => setOnStartReached(true) : undefined}
    />
  );
}
