import { TW_COLORS } from "@/utils/constants";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Text, useWindowDimensions } from "react-native";
import { LineChart, ruleTypes } from "react-native-gifted-charts";
import Svg, { Circle, Line } from "react-native-svg";
import { useDevCorrelationConfig } from "@/hooks/useDevCorrelationConfig";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Typography } from "@/components/Typography";

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
const TREATEMENT_SI_BESOIN_SIZE = 5;
const TREATMENT_SIZE = 12;

// Type definitions for memoized components
interface DataPointProps {
  item: any;
  isSelected: boolean;
  spacingFormat: string;
}

interface TreatmentPointProps {
  item: any;
  isSelected: boolean;
}

// Memoized data point components for better performance
const MemoizedDataPoint = React.memo(
  ({ item, isSelected, spacingFormat }: DataPointProps) => {
    if (item?.noValue) return null;

    const needShift = item?.needShift || false;
    let size = isSelected ? 20 : 14;
    if (item.isBoolean && spacingFormat !== "7days") {
      size = isSelected ? 10 : 7;
    }
    if (item.isTreatmentSiBesoin) {
      size = TREATEMENT_SI_BESOIN_SIZE;
    }
    let strokeWidth = isSelected ? 6 : 3;
    if (item.isBoolean && spacingFormat !== "7days") {
      strokeWidth = isSelected ? 3 : 2;
    }
    if (item.isTreatmentSiBesoin) {
      strokeWidth = 1;
    }
    let radius = (size - strokeWidth) / 2;
    if (item.isBoolean && item.booleanValue === false) {
      const center = size / 2;
      const lineLength = radius * 1.4; //
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
          <Line
            x1={center - lineLength}
            y1={center - lineLength}
            x2={center + lineLength}
            y2={center + lineLength}
            stroke={item?.color || "#3D6874"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );
    }
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
      prevProps.item?.noValue === nextProps.item?.noValue &&
      prevProps.spacingFormat === nextProps.spacingFormat
    );
  }
);

const MemoizedTreatmentPoint = React.memo(
  ({ item, isSelected }: TreatmentPointProps) => {
    if (item?.noValue) return null;

    return (
      <View
        style={{
          width: TREATMENT_SIZE, //isSelected ? 20 : 14,
          height: TREATMENT_SIZE, // isSelected ? 20 : 14,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item?.treatmentValue === true ? (
          <CheckMarkIcon
            //width={isSelected ? 20 : 15}
            width={TREATMENT_SIZE}
            height={TREATMENT_SIZE}
            //height={isSelected ? 20 : 15}
            color={"#134449"}
          />
        ) : (
          <CrossIcon
            //width={isSelected ? 20 : 15}
            height={TREATMENT_SIZE}
            width={TREATMENT_SIZE}
            //height={isSelected ? 20 : 15}
            color={"#518B9A"}
          />
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
  dashArray = "4 4",
  strokeWidth = 1,
  className,
}) => {
  return (
    <Svg height={height} width={strokeWidth * 2} className={className}>
      <Line x1={strokeWidth} y1={0} x2={strokeWidth} y2={height} stroke={color} strokeWidth={strokeWidth} strokeDasharray={dashArray} />
    </Svg>
  );
};

const TestChart = forwardRef(
  (
    {
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
      oneBoolean,
      twoBoolean,
      booleanIndicatorIndex,
      onVisibleRangeChange,
    },
    mainRef
  ) => {
    const { config } = useDevCorrelationConfig();
    const CHUNK_SIZE = config.chunkSize;
    const { width: screenWidth } = useWindowDimensions();
    const chartWidth = screenWidth - 72;

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

    useImperativeHandle(mainRef, () => ({
      scrollRight,
      scrollLeft,
    }));

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
        const currentDataIndex = (currentScrollX.current + chartWidth / 2) / previousSpacing.current;

        // Calculate the new scroll position for the same data point with new spacing
        const newScrollX = currentDataIndex * chartSpacing;

        setTimeout(() => {
          ref.current?.scrollTo({ x: newScrollX, animated: false });
          previousSpacing.current = chartSpacing;
        }, 200);
      }
    }, [chartSpacing, screenWidth]);

    // Helper function to check if item is in viewport
    const isItemInViewport = useCallback(
      (index: number) => {
        const scrollX = currentScrollX.current;
        const viewportWidth = chartWidth;

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
          (config.hideDataPoints ||
            ((spacingFormat === "1month" || spacingFormat === "3months" || spacingFormat === "6months") && !(oneBoolean && item.isBoolean))) &&
          !item.isTreatmentSiBesoin
        ) {
          return null;
        }
        return <MemoizedDataPoint item={item} isSelected={isSelected} spacingFormat={spacingFormat} />;
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
            spacingFormat === "7days" ? "ml-[30px]" : "",
            spacingFormat === "1month" ? "ml-[13px]" : "",
            spacingFormat === "3months" ? "ml-[11px]" : "",
            "flex-row items-end overflow-visible" // 👈 ICI
          )}
        >
          <DashedVerticalLine height={LABEL_HEIGHT + 10} />
          <Typography className={mergeClassNames(typography.textSmSemibold, "text-cnam-primary-700 absolute -bottom-2 left-2")}>
            {/* {" "} */}
            {/* <Typography className="text-black">| </Typography> */}
            {val}
          </Typography>
        </View>
      );
    };
    // Memoized data transformations to prevent re-creating arrays on every render
    // Store rendering properties directly on data objects instead of creating function closures
    const transformedData = useMemo(() => {
      return (visibleData || []).map((d, index) => {
        const needShift = !oneBoolean && visibleDataB && visibleDataB[index]?.value === d.value;
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
          focusedDataPointWidth: !config.useCustomRenderers
            ? undefined
            : needShift
            ? 35
            : oneBoolean && d.isBoolean && spacingFormat !== "7days"
            ? 10
            : 20,
          focusedDataPointHeight: !config.useCustomRenderers ? undefined : oneBoolean && d.isBoolean && spacingFormat !== "7days" ? 10 : 20,
          focusedDataPointColor: !config.useCustomRenderers ? undefined : d.noValue ? "transparent" : "#00A5DF",
          dataPointWidth: !config.useCustomRenderers ? undefined : needShift ? 25 : oneBoolean && d.isBoolean && spacingFormat !== "7days" ? 7 : 15,
          // hideDataPoint: config.hideDataPoints || spacingFormat === "1month" || spacingFormat === "3months" || spacingFormat === "6months",
          labelComponent: label ? () => customLabel(label) : undefined,
        };
      });
    }, [visibleData, visibleDataB, labelSpacing, formatLabel, spacingFormat, oneBoolean]);

    const transformedDataB = useMemo(() => {
      if (!visibleDataB) return null;
      return visibleDataB.map((d, index) => {
        const needShift = !oneBoolean && visibleData[index]?.value === d.value;
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
          focusedDataPointWidth: !config.useCustomRenderers ? undefined : oneBoolean && d.isBoolean && spacingFormat !== "7days" ? 10 : 20,
          focusedDataPointRadius: !config.useCustomRenderers ? undefined : 7,
          focusedDataPointHeight: !config.useCustomRenderers ? undefined : oneBoolean && d.isBoolean && spacingFormat !== "7days" ? 10 : 20,
          needShift: true,
          // hideDataPoint: config.hideDataPoints || spacingFormat === "1month" || spacingFormat === "3months" || spacingFormat === "6months",
        };
      });
    }, [visibleDataB, visibleData, labelSpacing, formatLabel, spacingFormat, oneBoolean]);

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
        if (point.value === 1 && point.noValue) {
          // Début d'un segment
          if (startIndex === null) {
            // console.log("start index", index);
            startIndex = index - 1;
            if (index - 1 < 0) {
              startIndex = 0;
            }
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
          color: "transparent",
          thickness: 3,
        });
      }

      return segments;
    };

    const computeVerticalShift = useMemo(() => {
      if (showTreatment && oneBoolean) {
        return -10;
      } else if (showTreatment || oneBoolean) {
        return -10;
      }
      // showTreatment ? -10 : -25;
      return -25;
    }, [showTreatment, oneBoolean]);

    const computeNbOfSections = useMemo(() => {
      if (showTreatment && oneBoolean) {
        return 9;
      } else if (twoBoolean && showTreatment) {
        return 5;
      } else if (showTreatment) {
        return 8;
      } else if (oneBoolean) {
        return 6;
      } else if (twoBoolean) {
        return 2;
      }
      return 5;
      // return showTreatment ? 8 : 5;
    }, [showTreatment, oneBoolean, twoBoolean]);

    const computeYOffset = useMemo(() => {
      if (showTreatment && oneBoolean) {
        return -3;
      } else if (showTreatment) {
        return -2;
      } else if (oneBoolean) {
        return -1;
      }
      return 0;
      // return showTreatment ? -2 : 0;
    }, [showTreatment, oneBoolean]);

    const computeReferenceLine2Position = useMemo(() => {
      if (showTreatment && oneBoolean) {
        return -2.32;
      } else if (showTreatment) {
        return -1.32;
      } else if (oneBoolean) {
        return -0.32;
      }
      return -0.32;
      // return showTreatment ? -1.32 : -0.32;
    }, [showTreatment, oneBoolean, twoBoolean]);

    const computeReferenceLine3Position = useMemo(() => {
      if (showTreatment && oneBoolean) {
        return 6.5;
      } else if (showTreatment && twoBoolean) {
        return 2.5;
      } else if (showTreatment || oneBoolean) {
        return 5.5;
      }
      return 4.5;
      // return showTreatment ? 5.5 : 4.5;
    }, [showTreatment, oneBoolean, twoBoolean]);

    const computeReferenceLine1Position = useMemo(() => {
      if (oneBoolean) {
        return -1.32;
      } else if (twoBoolean) {
        return -0.22;
      }

      return -0.32;
    }, [showTreatment, oneBoolean, twoBoolean]);

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
          focusedDataPointWidth: TREATMENT_SIZE,
          focusedDataPointHeight: TREATMENT_SIZE,
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
          focusedDataPointWidth: 5,
          focusedDataPointHeight: 5,
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
        const currentDataIndex = Math.floor((currentScrollX.current + chartWidth / 2) / chartSpacing);

        // Update visible start index
        setVisibleStartIndex(newStartIndex);

        // After state update, adjust scroll position to maintain view
        setTimeout(() => {
          // The new scroll position needs to account for the prepended items
          const newScrollX = (currentDataIndex + itemsToLoad) * chartSpacing;
          ref.current?.scrollTo({ x: newScrollX, animated: false });
          setIsLoadingMore(false);
        }, 50);

        setOnStartReached(false);
      } else if (onStartReached) {
        setOnStartReached(false);
      }
    }, [onStartReached, isLoadingMore, visibleStartIndex, chartSpacing, enablePagination, screenWidth]);

    // Auto-scroll to the end of the chart only on first load
    useEffect(() => {
      if (ref.current && transformedData && transformedData.length > 0) {
        // Small delay to ensure the chart is rendered
        setTimeout(() => {
          const scrollX = (transformedData.length - 1) * chartSpacing;
          ref.current?.scrollTo({ x: scrollX, animated: false });
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
    const onScroll = (event) => {
      const x = event.nativeEvent.contentOffset.x;
      currentScrollX.current = x;
      const width = event.nativeEvent.layoutMeasurement.width;

      const first = Math.floor(x / chartSpacing);
      const last = Math.ceil((x + width) / chartSpacing);

      // 👇 Tu appelles la fonction passée par le parent
      onVisibleRangeChange?.(first, last);
    };

    const scrollRight = () => {
      const nextX = currentScrollX.current + chartWidth;
      ref.current?.scrollTo({
        x: nextX,
        animated: true,
      });
    };

    const scrollLeft = () => {
      const nextX = Math.max(0, currentScrollX.current - chartWidth);
      ref.current?.scrollTo({
        x: nextX,
      });
    };

    const lineSegment = generateLineSegments(transformedData);
    const lineSegment2 = generateLineSegments(transformedDataB);

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
        lineSegments={lineSegment}
        lineSegments2={lineSegment2}
        xAxisTextNumberOfLines={1}
        xAxisLabelsHeight={LABEL_HEIGHT}
        xAxisThickness={0}
        // hideDataPoints={config.hideDataPoints || spacingFormat === "3months" || spacingFormat === "6months"}
        xAxisColor={"transparent"}
        width={chartWidth}
        focusEnabled={true} //!displayfixed}
        disableScroll={displayfixed}
        onFocus={
          displayfixed
            ? () => {}
            : (_item, index) => {
                const actualIndex = index;
                setDisplayItem(transformedData[actualIndex]);
                setSelectedPointIndex(actualIndex);
              }
        }
        focusedDataPointIndex={displayfixed ? initialSelectedPointIndex : selectedPointIndex}
        unFocusOnPressOut={false}
        showStripOnFocus={true}
        stripColor={TW_COLORS.CNAM_PRIMARY_700}
        stripHeight={180}
        stripWidth={2}
        showTextOnFocus={true}
        focusTogether={true}
        xAxisLabelsVerticalShift={computeVerticalShift}
        showXAxisIndices={false}
        showYAxisIndices={twoBoolean || false}
        yAxisLabelWidth={twoBoolean ? 30 : 0}
        yAxisTextStyle={{
          color: TW_COLORS.CNAM_PRIMARY_700,
          fontWeight: 700,
          fontFamily: "SourceSans3-Bold",
          backgroundColor: "white",
          paddingLeft: 0,
        }}
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
                  const viewportWidth = chartWidth;
                  visibleRangeRef.current = {
                    first: Math.floor(scrollX / chartSpacing),
                    last: Math.ceil((scrollX + viewportWidth) / chartSpacing),
                  };
                }
              }
            : onScroll
        }
        data={transformedData}
        xAxisIndicesHeight={10}
        scrollEventThrottle={16}
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
          showPointerStrip: false, //displayfixed,
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
        dataPointsHeight3={TREATMENT_SIZE}
        dataPointsWidth3={TREATMENT_SIZE}
        dataPointsHeight4={TREATEMENT_SI_BESOIN_SIZE}
        dataPointsWidth4={TREATEMENT_SI_BESOIN_SIZE}
        focusedDataPointHeight={config.useCustomRenderers ? 20 : 15}
        focusedDataPointWidth={config.useCustomRenderers ? 20 : 15}
        showDataPointLabelOnFocus={false}
        thickness3={20}
        thickness4={20}
        color2={booleanIndicatorIndex === 1 ? "transparent" : "#3D6874"}
        color1={booleanIndicatorIndex === 0 ? "transparent" : "#00A5DF"}
        color3={"transparent"}
        color4={"transparent"}
        dataPointsColor3={config.useCustomRenderers ? "transparent" : "#3D6874"}
        dataPointsColor4={config.useCustomRenderers ? "transparent" : "#3D6874"}
        yAxisColor={"transparent"}
        formatYLabel={(lab) => {
          if (twoBoolean) {
            if (lab === "2.0") return "Oui";
            if (lab === "1.0") return "Non";
          }
          if (lab === "-1" || lab === "-2" || lab === "6" || lab === "0") {
            return "";
          }
          return "";
          //return parseInt(lab, 10).toString();
        }}
        yAxisOffset={computeYOffset}
        noOfSectionsBelowXAxis={0}
        noOfSections={computeNbOfSections}
        // use to hide the horizontal lines and show the yellow background
        showReferenceLine1={showTreatment}
        referenceLine1Position={computeReferenceLine1Position}
        referenceLinesOverChartContent={false}
        referenceLine1Config={{
          thickness: 20,
          color: "#FCF2D9",
          type: ruleTypes.SOLID,
          zIndex: 10,
          //dashGap: -1,
        }}
        // use to hide the horizontal lines
        showReferenceLine2={true}
        referenceLine2Position={computeReferenceLine2Position}
        referenceLine2Config={{
          thickness: oneBoolean && showTreatment ? 65 : 20,
          type: ruleTypes.SOLID,
          color: "white",
        }}
        showReferenceLine3={showTreatment || oneBoolean}
        referenceLine3Position={computeReferenceLine3Position}
        referenceLine3Config={{
          thickness: 20,
          color: "white",
          type: ruleTypes.SOLID,
        }}
        showVerticalLines={false}
        // verticalLinesSpacing={74}
        // verticalLinesThickness={2}
        // verticalLinesStrokeDashArray={[4, 4]}
        // verticalLinesColor="rgba(24, 26, 26, 0.1)"
        // verticalLinesThickness={0}
        // noOfVerticalLines={5}
        showScrollIndicator={false}
        bounces={false}
        strokeDashArray2={[4, 1]} // bug other dash array are sometimes no consistent (the space between dashes vary)
        curved={true} // set false to improve performance on android
        curvature={0.1}
        initialSpacing={0}
        onStartReached={enablePagination ? () => setOnStartReached(true) : undefined}
      />
    );
  }
);

export default TestChart;
