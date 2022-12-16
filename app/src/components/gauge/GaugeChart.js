import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Mask, Rect, Stop, Use, G } from "react-native-svg";
import { useLayout } from "@react-native-community/hooks";

const HEIGHT_RATIO_GAUGE = 48 / 256;
const NUMBER_OF_BARS = 20;

export const GaugeChart = ({ value, reverse, containerStyle }) => {
  const { onLayout, ...layout } = useLayout();
  const width = layout?.width || 0;
  const height = width * HEIGHT_RATIO_GAUGE || 0;

  const arrayBarsIndex = [...Array(NUMBER_OF_BARS).keys()];
  const widthBar = (width / (NUMBER_OF_BARS - 1)) * 0.75;
  const horizontalSpacing = (width / NUMBER_OF_BARS - widthBar) / 2;

  const colors = reverse
    ? ["#5DEE5A", "#F2F478", "#F2F478", "#F16B6B"]
    : ["#F16B6B", "#F2F478", "#F2F478", "#5DEE5A"];

  return (
    <View style={[styles.container, containerStyle]} onLayout={onLayout}>
      {width > 0 && height > 0 && (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              {colors.map((color, index) => (
                <Stop key={index} offset={index / colors.length} stopColor={color} stopOpacity={1} />
              ))}
            </LinearGradient>

            <Mask id="mask" maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
              {arrayBarsIndex.map((n) => {
                const barHeight = height * (0.2 + (n * (80 / (NUMBER_OF_BARS - 1))) / 100);
                return (
                  <Rect
                    key={n}
                    x={(width / NUMBER_OF_BARS) * n + horizontalSpacing}
                    y={height - barHeight}
                    width={widthBar}
                    height={barHeight}
                    rx="3"
                    ry="3"
                    fill="white"
                  />
                );
              })}
            </Mask>

            <G id="gradientRect">
              <Rect x="0" y="0" width={width} height={height} fill="url(#gradient)" />
              <Rect x={width * value} y="0" width={width - width * value} height={height} fill="#D9DBE0" />
            </G>
          </Defs>

          <Use href="#gradientRect" mask="url(#mask)" />
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
