import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../components/MyText";
import Svg, { Rect, Circle, Text as SvgText, Path, Line } from "react-native-svg";
import { analyzeScoresMapIcon, scoresMapIcon } from "../../../utils/constants";
import { colors } from "../../../utils/colors";
import { symbol } from "zod";

// Constants
const MAIN_BAR_HEIGHT = 30;
const TREATMENT_BAR_HEIGHT = 20;
const DOT_RADIUS = 2;
const SEGMENT_GAP = 1;
const DEFAULT_COLOR = "#D7D3D3";
const TREATMENT_COLOR = "#CCEDF9";
const NO_TREATMENT_COLOR = "#F9D1E6";

const colorToSymbol = {
  "#F3B9B0": "-",
  "#F3A3CD": "--", // rouge
  "#F9E1A7": "O", // jaune
  "#BBE7C6": "+", // bleu
  "#99DDDD": "++", // gris par défaut
  "#D7D3D3": "",
  "#CCEDF9": "✓",
  "#F9D1E6": "x",
};

const colorToTextColor = {
  "#F3B9B0": "#B33F2E",
  "#F3A3CD": "#B33F2E", // rouge
  "#F9E1A7": "#5A2017", // jaune
  "#BBE7C6": "#004439", // bleu
  "#99DDDD": "#004439", // gris par défaut
  "#D7D3D3": "",
  "#F9D1E6": "#3D6874",
  "#CCEDF9": "#3D6874",
};

type RoundedRectProps = {
  x: number;
  y?: number;
  width: number;
  height: number;
  fill: string;
  opacity?: number;
  radius?: number;
  side?: "left" | "right" | "both" | "none";
};

// Memoized components
const BatchedSegment = React.memo(({ x, width, height, fill, opacity, side, radius }) => (
  <RoundedRect
    x={x}
    y={0}
    width={width}
    height={height}
    fill={fill}
    radius={radius}
    opacity={opacity}
    side={side} // horizontal corner radius
  />
));

export const RoundedRect: React.FC<RoundedRectProps> = ({ x, y = 0, width, height, fill, opacity = 1, radius = 5, side = "none" }) => {
  let path = "";

  if (side === "left") {
    path = `
      M ${x + radius},${y}
      H ${x + width}
      V ${y + height}
      H ${x + radius}
      Q ${x},${y + height} ${x},${y + height - radius}
      V ${y + radius}
      Q ${x},${y} ${x + radius},${y}
      Z
    `;
  } else if (side === "right") {
    path = `
      M ${x},${y}
      H ${x + width - radius}
      Q ${x + width},${y} ${x + width},${y + radius}
      V ${y + height - radius}
      Q ${x + width},${y + height} ${x + width - radius},${y + height}
      H ${x}
      Z
    `;
  } else if (side === "both") {
    path = `
      M ${x + radius},${y}
      H ${x + width - radius}
      Q ${x + width},${y} ${x + width},${y + radius}
      V ${y + height - radius}
      Q ${x + width},${y + height} ${x + width - radius},${y + height}
      H ${x + radius}
      Q ${x},${y + height} ${x},${y + height - radius}
      V ${y + radius}
      Q ${x},${y} ${x + radius},${y}
      Z
    `;
  } else {
    // plain rect (no rounding)
    path = `
      M ${x},${y}
      H ${x + width}
      V ${y + height}
      H ${x}
      Z
    `;
  }

  return <Path d={path} fill={fill} opacity={opacity} />;
};

const Dot = React.memo(({ cx, cy, r, fill }) => <Circle cx={cx} cy={cy} r={r} fill={fill} />);

// Grid lines component for day separations
const GridLines = React.memo(({ count, segmentWidth, height }: { count: number; segmentWidth: number; height: number }) => {
  const lines = [];
  for (let i = 1; i < count; i++) {
    lines.push(<Line key={i} x1={i * segmentWidth} y1={0} x2={i * segmentWidth} y2={height} stroke={"#fff"} strokeWidth={0.5} opacity={1} />);
  }
  return <>{lines}</>;
});

// Batch consecutive segments with same color and opacity
const batchSegments = (items, segmentWidth, gap) => {
  if (!items?.length) return [];

  const batches = [];
  let currentBatch = {
    color: items[0].color,
    textColor: items[0].textColor,
    symbol: items[0].symbol,
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
        textColor: currentBatch.textColor,
        symbol: currentBatch.symbol,
      });

      currentBatch = {
        color: item.color,
        opacity: item.opacity,
        startIndex: i,
        count: 1,
        textColor: item.textColor,
        symbol: item.symbol,
      };
    }
  }

  // Push final batch
  batches.push({
    x: currentBatch.startIndex * segmentWidth,
    width: currentBatch.count * segmentWidth - gap,
    color: currentBatch.color,
    opacity: currentBatch.opacity,
    textColor: currentBatch.textColor,
    symbol: currentBatch.symbol,
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
        const color = analyzeScoresMapIcon[iconKey]?.color || DEFAULT_COLOR;

        // Calculate opacity
        let opacity = 1;
        if (hasFocus && value) {
          const focusValue = isReverse ? 6 - value : value;
          opacity = focusedScoresSet.has(focusValue) ? 1 : 0.1;
        } else if (hasFocus && !value) {
          opacity = 0.5;
        }

        return { color, opacity, textColor: analyzeScoresMapIcon[iconKey]?.iconColor, symbol: analyzeScoresMapIcon[iconKey]?.symbol };
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
      <View
        style={styles.friseContainer}
        // onLayout={(event) => {
        //   const { width } = event.nativeEvent.layout;
        //   if (width > 0 && width !== containerWidth) {
        //     setContainerWidth(width);
        //   }
        // }}
      >
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
            {batchedMainData.map((batch, i) => {
              let side = "none";
              if (i === 0 && i === batchedMainData.length - 1) {
                side = "both";
              } else if (i === 0) {
                side = "left";
              } else if (i === batchedMainData.length - 1) {
                side = "right";
              }
              return (
                <React.Fragment key={i}>
                  <BatchedSegment
                    side={side}
                    key={i}
                    x={batch.x}
                    width={batch.width}
                    height={MAIN_BAR_HEIGHT}
                    fill={batch.color}
                    opacity={batch.opacity}
                    radius={MAIN_BAR_HEIGHT / 2}
                  />
                  <SvgText
                    x={batch.x + batch.width / 2} // centre horizontal
                    y={MAIN_BAR_HEIGHT / 2} // centre vertical
                    fontSize={12}
                    fontWeight={600}
                    fill={batch.textColor}
                    textAnchor="middle" // centre le texte horizontalement
                    alignmentBaseline="middle" // centre le texte verticalement
                  >
                    {batch.symbol || ""}
                  </SvgText>
                </React.Fragment>
              );
            })}
            {/* Grid lines for day separations */}
            <GridLines count={dataLength} segmentWidth={segmentWidth} height={MAIN_BAR_HEIGHT} />
          </Svg>

          {/* Treatment Bar - Batched */}
          {batchedTreatmentData && (
            <Svg width={containerWidth} height={TREATMENT_BAR_HEIGHT} style={styles.treatmentBar}>
              {batchedTreatmentData.map((batch, i) => {
                let side = "none";
                if (i === 0 && i === batchedTreatmentData.length - 1) {
                  side = "both";
                } else if (i === 0) {
                  side = "left";
                } else if (i === batchedTreatmentData.length - 1) {
                  side = "right";
                }
                return (
                  <React.Fragment key={i}>
                    <BatchedSegment
                      side={side}
                      key={i}
                      x={batch.x}
                      width={batch.width}
                      height={TREATMENT_BAR_HEIGHT}
                      fill={batch.color}
                      radius={TREATMENT_BAR_HEIGHT / 2}
                      opacity={1}
                    />
                    <SvgText
                      x={batch.x + batch.width / 2} // centre horizontal
                      y={TREATMENT_BAR_HEIGHT / 2} // centre vertical
                      fontSize={12}
                      fill={"#3D6874"}
                      fontWeight={600}
                      textAnchor="middle" // centre le texte horizontalement
                      alignmentBaseline="middle" // centre le texte verticalement
                    >
                      {colorToSymbol[batch.color] || ""}
                    </SvgText>
                  </React.Fragment>
                );
              })}
              {/* Grid lines for day separations */}
              <GridLines count={dataLength} segmentWidth={segmentWidth} height={TREATMENT_BAR_HEIGHT} />
            </Svg>
          )}

          {/* Treatment Si Besoin Dots */}
          {processedSiBesoinData && (
            <Svg width={containerWidth} height={DOT_RADIUS * 3} style={styles.treatmentBar}>
              {processedSiBesoinData.map((dot) => (
                <Dot key={dot.index} cx={dot.cx} cy={DOT_RADIUS + 1} r={DOT_RADIUS} fill={"#3D6874"} />
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
