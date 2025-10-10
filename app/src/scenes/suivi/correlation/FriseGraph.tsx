import React, { useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Text from "../../../components/MyText";
import Svg, { Rect, Circle, Text as SvgText, Line } from "react-native-svg";
import { analyzeScoresMapIcon, scoresMapIcon, TW_COLORS } from "../../../utils/constants";
import { colors } from "../../../utils/colors";

// Constants
const MAIN_BAR_HEIGHT = 30;
const TREATMENT_BAR_HEIGHT = 20;
const DOT_RADIUS = 2;
const SEGMENT_GAP = 0;
const DEFAULT_COLOR = TW_COLORS.CNAM_PRIMARY_25;
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

// Simple segment component - no batching
const SimpleSegment = React.memo(({ x, width, height, fill, opacity }) => (
  <Rect x={x} y={0} width={width} height={height} fill={fill} opacity={opacity} />
));

const Dot = React.memo(({ cx, cy, r, fill }) => <Circle cx={cx} cy={cy} r={r} fill={fill} />);

// Grid lines component for day separations
const GridLines = React.memo(({ count, segmentWidth, height }: { count: number; segmentWidth: number; height: number }) => {
  const lines = [];
  for (let i = 1; i < count; i++) {
    lines.push(
      <Line
        key={i}
        x1={i * segmentWidth}
        y1={0}
        x2={i * segmentWidth}
        y2={height}
        stroke={TW_COLORS.CNAM_PRIMARY_400}
        strokeWidth={0.5}
        opacity={1}
      />
    );
  }
  return <>{lines}</>;
});

// Simple segment processing - no batching
const processSegments = (items, segmentWidth, gap) => {
  if (!items?.length) return [];

  return items.map((item, index) => ({
    x: index * segmentWidth,
    width: segmentWidth - gap,
    color: item.color,
    opacity: item.opacity,
    textColor: item.textColor,
    symbol: item.symbol,
  }));
};

// Simple treatment segment processing
const processTreatmentSegments = (colors, segmentWidth, gap) => {
  if (!colors?.length) return [];

  return colors.map((color, index) => ({
    x: index * segmentWidth,
    width: segmentWidth - gap,
    color: color,
  }));
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

interface FriseGraphProps {
  title?: string;
  data: any[];
  focusedScores: any[];
  showTraitement: boolean;
  priseDeTraitement?: any[];
  priseDeTraitementSiBesoin?: any[];
}

export const FriseGraph = React.memo(
  ({ title, data, focusedScores, showTraitement, priseDeTraitement, priseDeTraitementSiBesoin }: FriseGraphProps) => {
    // Early return
    const dataLength = data?.length || 0;
    if (dataLength === 0) return null;

    // Get screen dimensions and calculate width
    const { width: screenWidth } = useWindowDimensions();
    const containerWidth = screenWidth - 40; // Account for padding
    const segmentWidth = containerWidth / dataLength;

    // Convert to Set once
    const focusedScoresSet = useMemo(() => new Set(focusedScores), [focusedScores]);
    const hasFocus = focusedScoresSet.size > 0 && focusedScoresSet.size <= 5;

    // Process main data - simple, no batching
    const mainSegments = useMemo(() => {
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

        return {
          color,
          opacity,
          textColor: analyzeScoresMapIcon[iconKey]?.iconColor,
          symbol: analyzeScoresMapIcon[iconKey]?.symbol,
        };
      });

      return processSegments(items, segmentWidth, SEGMENT_GAP);
    }, [data, focusedScoresSet, hasFocus, segmentWidth]);

    // Process treatment data - simple, no batching
    const treatmentSegments = useMemo(() => {
      if (!showTraitement || !priseDeTraitement?.length) return null;

      const colors = priseDeTraitement.map((item) => {
        if (item?.value === true) return TREATMENT_COLOR;
        if (item?.value === false) return NO_TREATMENT_COLOR;
        return DEFAULT_COLOR;
      });

      return processTreatmentSegments(colors, segmentWidth, SEGMENT_GAP);
    }, [priseDeTraitement, showTraitement, segmentWidth]);

    // Process "si besoin" data - simple
    const siBesoinDots = useMemo(() => {
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

        <View className="w-full">
          {/* Main Bar - Simple */}
          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: TW_COLORS.CNAM_PRIMARY_400,
              width: containerWidth,
              height: MAIN_BAR_HEIGHT,
              overflow: "hidden",
            }}
          >
            <Svg width={containerWidth} height={MAIN_BAR_HEIGHT}>
              {mainSegments.map((segment, i) => (
                <React.Fragment key={i}>
                  <SimpleSegment x={segment.x} width={segment.width} height={MAIN_BAR_HEIGHT} fill={segment.color} opacity={segment.opacity} />
                  <SvgText
                    x={segment.x + segment.width / 2}
                    y={MAIN_BAR_HEIGHT / 2}
                    fontSize={12}
                    fontWeight={600}
                    fill={segment.textColor}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {segment.symbol || ""}
                  </SvgText>
                </React.Fragment>
              ))}
              <GridLines count={dataLength} segmentWidth={segmentWidth} height={MAIN_BAR_HEIGHT} />
            </Svg>
          </View>

          {/* Treatment Bar - Simple */}
          {treatmentSegments && (
            <View
              className="mt-2"
              style={{
                borderWidth: 1,
                borderRadius: 15,
                borderColor: TW_COLORS.CNAM_PRIMARY_400,
                width: containerWidth,
                height: TREATMENT_BAR_HEIGHT,
                overflow: "hidden",
              }}
            >
              <Svg width={containerWidth} height={TREATMENT_BAR_HEIGHT}>
                {treatmentSegments.map((segment, i) => (
                  <React.Fragment key={i}>
                    <SimpleSegment x={segment.x} width={segment.width} height={TREATMENT_BAR_HEIGHT} fill={segment.color} opacity={1} />
                    <SvgText
                      x={segment.x + segment.width / 2}
                      y={TREATMENT_BAR_HEIGHT / 2}
                      fontSize={12}
                      fill={"#3D6874"}
                      fontWeight={600}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {colorToSymbol[segment.color] || ""}
                    </SvgText>
                  </React.Fragment>
                ))}
                <GridLines count={dataLength} segmentWidth={segmentWidth} height={TREATMENT_BAR_HEIGHT} />
              </Svg>
            </View>
          )}

          {/* Treatment Si Besoin Dots */}
          {siBesoinDots && (
            <Svg width={containerWidth} height={DOT_RADIUS * 3} className="mt-2">
              {siBesoinDots.map((dot) => (
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
    borderWidth: 1,
    borderRadius: 10,
    borderColor: TW_COLORS.CNAM_PRIMARY_400,
  },
});
