import { TW_COLORS } from "@/utils/constants";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

// Constants
const DAY_INITIALS = ["D", "L", "M", "M", "J", "V", "S"];
const SPACING_CONFIG = {
  "7days": 70,
  "1month": 20,
  "3months": 10,
  "6months": 1,
  default: 50,
};
const LABEL_SPACING_CONFIG = {
  "7days": 1,
  "1month": 3,
  "3months": 10,
  default: 20,
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
}) {
  const ref = useRef<ScrollView>(null);
  const hasScrolledToEnd = useRef(false);
  const currentScrollX = useRef(0);
  const previousSpacing = useRef(20); // Default spacing for "1month"
  const responderMoveTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentPointerIndex = useRef<number | null>(null);
  const [responderMove, setResponderMove] = useState(false);
  const [onStartReached, setOnStartReached] = useState(false);

  // Chunked data loading state
  const CHUNK_SIZE = 40;
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousDataLength = useRef(0);

  // Calculate spacing based on active period (must be before other hooks that use it)
  const chartSpacing = useMemo(() => {
    return SPACING_CONFIG[spacingFormat] || SPACING_CONFIG.default;
  }, [spacingFormat]);

  // Initialize visible range to show last CHUNK_SIZE items
  useEffect(() => {
    if (data && data.length > 0) {
      const initialStart = Math.max(0, data.length - CHUNK_SIZE);
      setVisibleStartIndex(initialStart);
      previousDataLength.current = data.length;
    }
  }, [data?.length]);

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

  // Shared custom data point renderer - single instance for all data points
  const renderCustomDataPoint = useCallback((item, index, isSelected) => {
    if (item?.noValue) return null;

    const needShift = item?.needShift || false;

    return (
      <View
        style={{
          width: isSelected ? 20 : 14,
          height: isSelected ? 20 : 14,
          backgroundColor: item?.backgroundColor || "white",
          borderWidth: isSelected ? 6 : 3,
          borderRadius: 10,
          borderColor: item?.color || "#3D6874",
          top: needShift ? -10 : 0,
          opacity: 1,
          alignSelf: "center",
        }}
      />
    );
  }, []);

  const renderCustomDataPointTreatment = useCallback((item, index, isSelected) => {
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
  }, []);

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

  const formatLabel = useCallback(
    (dateString) => {
      if (spacingFormat === "7days") {
        return getDayInitial(dateString);
      }
      return formatDateToFrench(dateString);
    },
    [spacingFormat, getDayInitial, formatDateToFrench]
  );

  // Dynamic label spacing based on active period
  const labelSpacing = useMemo(() => {
    return LABEL_SPACING_CONFIG[spacingFormat] || LABEL_SPACING_CONFIG.default;
  }, [spacingFormat]);

  // Get visible data slice
  const visibleData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(visibleStartIndex);
  }, [data, visibleStartIndex]);

  const visibleDataB = useMemo(() => {
    if (!dataB || dataB.length === 0) return null;
    return dataB.slice(visibleStartIndex);
  }, [dataB, visibleStartIndex]);

  const visibleTreatment = useMemo(() => {
    if (!treatment || !showTreatment) return null;
    return treatment.slice(visibleStartIndex);
  }, [treatment, showTreatment, visibleStartIndex]);

  const visibleTreatmentSiBesoin = useMemo(() => {
    if (!treatmentSiBesoin || !showTreatment) return null;
    return treatmentSiBesoin.slice(visibleStartIndex);
  }, [treatmentSiBesoin, showTreatment, visibleStartIndex]);

  // Memoized data transformations to prevent re-creating arrays on every render
  // Store rendering properties directly on data objects instead of creating function closures
  const transformedData = useMemo(() => {
    return (visibleData || []).map((d, index) => {
      const needShift = visibleDataB && visibleDataB[index]?.value === d.value;
      return {
        ...d,
        label: index % labelSpacing === 0 ? formatLabel(d.label) : "",
        color: "#3D6874",
        backgroundColor: "white",
        needShift: false,
        focusedDataPointWidth: needShift ? 35 : 20,
        dataPointWidth: needShift ? 25 : 15,
      };
    });
  }, [visibleData, visibleDataB, labelSpacing, formatLabel]);

  const transformedDataB = useMemo(() => {
    if (!visibleDataB) return null;
    return visibleDataB.map((d, index) => {
      const needShift = visibleData[index]?.value === d.value;
      return {
        ...d,
        label: index % labelSpacing === 0 ? formatLabel(d.label) : "",
        color: "#00A5DF",
        backgroundColor: "#00A5DF",
        needShift: true,
      };
    });
  }, [visibleDataB, visibleData, labelSpacing, formatLabel]);

  const transformedTreatment = useMemo(() => {
    if (!visibleTreatment) return null;
    return (visibleTreatment || []).map((t, index) => ({
      ...t,
      label: index % labelSpacing === 0 ? formatLabel(t.label) : "",
      isTreatment: true,
    }));
  }, [visibleTreatment, labelSpacing, formatLabel]);

  const transformedTreatmentSiBesoin = useMemo(() => {
    if (!visibleTreatmentSiBesoin) return null;
    return (visibleTreatmentSiBesoin || []).map((t, index) => ({
      ...t,
      label: index % labelSpacing === 0 ? formatLabel(t.label) : "",
      color: TW_COLORS.CNAM_PRIMARY_800,
      backgroundColor: TW_COLORS.CNAM_PRIMARY_800,
      isTreatmentSiBesoin: true,
    }));
  }, [visibleTreatmentSiBesoin, labelSpacing, formatLabel]);

  // Handle loading more data when scrolling to start
  useEffect(() => {
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
  }, [onStartReached, isLoadingMore, visibleStartIndex, chartSpacing]);

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

  // Shared custom data point functions that read properties from the data objects
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
      xAxisLabelTextStyle={
        spacingFormat === "7days"
          ? { paddingLeft: 15, height: 20, marginTop: 10, fontWeight: "bold", color: TW_COLORS.CNAM_PRIMARY_700 }
          : { fontSize: 10, color: "#666", width: 60, textAlign: "center" }
      }
      // scrollToIndex={data.length - 1}
      xAxisTextNumberOfLines={1}
      xAxisLabelsHeight={20}
      xAxisThickness={0}
      hideDataPoints={spacingFormat === "3months" || spacingFormat === "6months"}
      xAxisColor={"transparent"}
      width={screenWidth - 72}
      focusEnabled={!displayfixed}
      disableScroll={displayfixed}
      onFocus={(_item, index) => {
        const actualIndex = index;
        console.log("lcs onFocus index", index, "actualIndex", actualIndex);
        const item = transformedData[actualIndex] || (transformedDataB && transformedDataB[actualIndex]);
        if (!item || !item.noValue) {
          console.log("lcs display");

          setDisplayItem(transformedData[actualIndex]);
          setSelectedPointIndex(actualIndex);
        }
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
      data={transformedData}
      onPress={() => {
        console.log("lcs on press");
      }}
      xAxisIndicesHeight={10}
      data2={transformedDataB}
      data3={transformedTreatment}
      data4={transformedTreatmentSiBesoin}
      customDataPoint={customDataPointRenderer}
      focusedCustomDataPoint={focusedCustomDataPointRenderer}
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

        onResponderMove: () => {
          // Clear any existing timeout
          if (responderMoveTimeout.current) {
            clearTimeout(responderMoveTimeout.current);
          }
          // Set timeout to delay the state change
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
            console.log("lcs onResponderMove");
          }, 150);
        },
        onResponderEnd: () => {
          // Cancel pending timeout
          if (responderMoveTimeout.current) {
            clearTimeout(responderMoveTimeout.current);
            responderMoveTimeout.current = null;
          }
          setResponderMove(false);
          console.log("lcs onResponderEnd");
        },
        onResponderGrant: () => {
          console.log("lcs onResponder grant");
        },
        persistPointer: false,
        activatePointersDelay: 150,
        pointerColor: "transparent",
        pointerStripWidth: 2,
        width: 20,
        height: 20,
        showPointerStrip: false, //!!displayfixed,
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
      curved={false} // set false to improve performance on android
      curvature={0.1}
      initialSpacing={0}
      onStartReached={() => setOnStartReached(true)}
    />
  );
}
