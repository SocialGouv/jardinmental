import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import Svg, { Rect, Circle } from "react-native-svg";
import { scoresMapIcon } from "../../../utils/constants";
import { colors } from "../../../utils/colors";

// Constants
const MAIN_BAR_HEIGHT = 10;
const TREATMENT_BAR_HEIGHT = 4;
const DOT_RADIUS = 2;
const SEGMENT_GAP = 1;
const DEFAULT_COLOR = "#D7D3D3";
const TREATMENT_COLOR = "#5956E8";
const NO_TREATMENT_COLOR = "#E575F8";

// Memoized components
const BatchedSegment = React.memo(({ x, width, height, fill, opacity }) => (
  <Rect x={x} y={0} width={width} height={height} fill={fill} opacity={opacity} />
));

const Dot = React.memo(({ cx, cy, r, fill }) => <Circle cx={cx} cy={cy} r={r} fill={fill} />);

// Batch consecutive segments with same color and opacity
const batchSegments = (items, segmentWidth, gap) => {
  if (!items?.length) return [];

  const batches = [];
  let currentBatch = {
    color: items[0].color,
    opacity: items[0].opacity,
    startIndex: 0,
    count: 1,
  };

  for (let i = 1; i < items.length; i++) {
    const item = items[i];

    // Check if we can continue the current batch
    if (item.color === currentBatch.color && item.opacity === currentBatch.opacity) {
      currentBatch.count++;
    } else {
      // Save current batch and start new one
      batches.push({
        x: currentBatch.startIndex * segmentWidth,
        width: currentBatch.count * segmentWidth - gap,
        color: currentBatch.color,
        opacity: currentBatch.opacity,
      });

      currentBatch = {
        color: item.color,
        opacity: item.opacity,
        startIndex: i,
        count: 1,
      };
    }
  }

  // Push final batch
  batches.push({
    x: currentBatch.startIndex * segmentWidth,
    width: currentBatch.count * segmentWidth - gap,
    color: currentBatch.color,
    opacity: currentBatch.opacity,
  });

  return batches;
};

// Batch treatment segments (color only, no opacity)
const batchTreatmentSegments = (colors, segmentWidth, gap) => {
  if (!colors?.length) return [];

  const batches = [];
  let currentBatch = {
    color: colors[0],
    startIndex: 0,
    count: 1,
  };

  for (let i = 1; i < colors.length; i++) {
    if (colors[i] === currentBatch.color) {
      currentBatch.count++;
    } else {
      batches.push({
        x: currentBatch.startIndex * segmentWidth,
        width: currentBatch.count * segmentWidth - gap,
        color: currentBatch.color,
      });

      currentBatch = {
        color: colors[i],
        startIndex: i,
        count: 1,
      };
    }
  }

  batches.push({
    x: currentBatch.startIndex * segmentWidth,
    width: currentBatch.count * segmentWidth - gap,
    color: currentBatch.color,
  });

  return batches;
};

// Optimized value calculation
const getProcessedValue = (item) => {
  const { _indicateur, value } = item;
  const type = _indicateur?.type;
  const isReverse = _indicateur?.order === "DESC";

  if (!type || type === "smiley") {
    return { value, isReverse };
  }

  if (type === "boolean") {
    return { value: value === true ? 5 : 1, isReverse };
  }

  if (type === "gauge") {
    return { value: Math.min(Math.ceil(value * 5), 5), isReverse };
  }

  return { value, isReverse };
};

export const FriseGraph = React.memo(
  ({ title, data, focusedScores, showTraitement, priseDeTraitement, priseDeTraitementSiBesoin }) => {
    // Early return
    const dataLength = data?.length || 0;
    if (dataLength === 0) return null;

    // State to track container width
    const [containerWidth, setContainerWidth] = useState(300);

    const segmentWidth = containerWidth / dataLength;

    // Convert to Set once
    const focusedScoresSet = useMemo(() => new Set(focusedScores), [focusedScores]);

    const hasFocus = focusedScoresSet.size > 0 && focusedScoresSet.size <= 5;

    // Process and batch main data
    const batchedMainData = useMemo(() => {
      const items = data.map((item) => {
        const { value, isReverse } = getProcessedValue(item);

        // Get color from icon lookup
        const iconKey = isReverse ? 6 - value : value;
        const color = scoresMapIcon[iconKey]?.color || DEFAULT_COLOR;

        // Calculate opacity
        let opacity = 1;
        if (hasFocus && value) {
          const focusValue = isReverse ? 6 - value : value;
          opacity = focusedScoresSet.has(focusValue) ? 1 : 0.1;
        } else if (hasFocus && !value) {
          opacity = 0.5;
        }

        return { color, opacity };
      });

      return batchSegments(items, segmentWidth, SEGMENT_GAP);
    }, [data, focusedScoresSet, hasFocus, segmentWidth]);

    // Process and batch treatment data
    const batchedTreatmentData = useMemo(() => {
      if (!showTraitement || !priseDeTraitement?.length) return null;

      const colors = priseDeTraitement.map((item) => {
        if (item?.value === true) return TREATMENT_COLOR;
        if (item?.value === false) return NO_TREATMENT_COLOR;
        return DEFAULT_COLOR;
      });

      return batchTreatmentSegments(colors, segmentWidth, SEGMENT_GAP);
    }, [priseDeTraitement, showTraitement, segmentWidth]);

    // Process "si besoin" data - filter during processing
    const processedSiBesoinData = useMemo(() => {
      if (!showTraitement || !priseDeTraitementSiBesoin?.length) return null;

      const dots = [];
      priseDeTraitementSiBesoin.forEach((item, index) => {
        if (item?.value === true) {
          dots.push({
            cx: index * segmentWidth + segmentWidth / 2,
            index,
          });
        }
      });
      return dots.length > 0 ? dots : null;
    }, [priseDeTraitementSiBesoin, showTraitement, segmentWidth]);

    return (
      <View style={styles.friseContainer}>
        {title ? <Text style={styles.friseTitle}>{title}</Text> : null}

        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            if (width > 0 && width !== containerWidth) {
              setContainerWidth(width);
            }
          }}
        >
          {/* Main Bar - Batched */}
          <Svg width={containerWidth} height={MAIN_BAR_HEIGHT}>
            {batchedMainData.map((batch, i) => (
              <BatchedSegment key={i} x={batch.x} width={batch.width} height={MAIN_BAR_HEIGHT} fill={batch.color} opacity={batch.opacity} />
            ))}
          </Svg>

          {/* Treatment Bar - Batched */}
          {batchedTreatmentData && (
            <Svg width={containerWidth} height={TREATMENT_BAR_HEIGHT} style={styles.treatmentBar}>
              {batchedTreatmentData.map((batch, i) => (
                <BatchedSegment key={i} x={batch.x} width={batch.width} height={TREATMENT_BAR_HEIGHT} fill={batch.color} opacity={1} />
              ))}
            </Svg>
          )}

          {/* Treatment Si Besoin Dots */}
          {processedSiBesoinData && (
            <Svg width={containerWidth} height={DOT_RADIUS * 3} style={styles.treatmentBar}>
              {processedSiBesoinData.map((dot) => (
                <Dot key={dot.index} cx={dot.cx} cy={DOT_RADIUS + 1} r={DOT_RADIUS} fill={TREATMENT_COLOR} />
              ))}
            </Svg>
          )}
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Quick reference checks first (fastest)
    if (prevProps.data !== nextProps.data) return false;
    if (prevProps.priseDeTraitement !== nextProps.priseDeTraitement) return false;
    if (prevProps.priseDeTraitementSiBesoin !== nextProps.priseDeTraitementSiBesoin) return false;
    if (prevProps.showTraitement !== nextProps.showTraitement) return false;
    if (prevProps.title !== nextProps.title) return false;

    // focusedScores comparison (only if other checks pass)
    const prevScores = prevProps.focusedScores;
    const nextScores = nextProps.focusedScores;
    if (prevScores === nextScores) return true;
    if (prevScores.length !== nextScores.length) return false;

    for (let i = 0; i < prevScores.length; i++) {
      if (prevScores[i] !== nextScores[i]) return false;
    }

    return true;
  }
);

const styles = StyleSheet.create({
  friseContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  friseTitle: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
    marginBottom: 5,
  },
  treatmentBar: {
    marginTop: 5,
  },
});
