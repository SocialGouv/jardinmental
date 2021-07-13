import React from 'react';
import {StyleSheet, View, Dimensions, TouchableOpacity} from 'react-native';
import Svg, {Circle, Line, G} from 'react-native-svg';
import {colors} from '../../utils/colors';
import {colorsMap} from '../../utils/constants';
import {days} from '../../utils/date/helpers';
import Text from '../../components/MyText';
/* Chart setup */

const dotSize = 7;

// Vertical spacing
const daysHeight = 20;
const chartPaddingTop = 10;
const chartHeight = 220;
const chartInnerHeight = chartHeight - daysHeight;
const spacingY = 0.1452;
const dotsY = [
  chartPaddingTop + chartInnerHeight * spacingY * 5,
  chartPaddingTop + chartInnerHeight * spacingY * 4,
  chartPaddingTop + chartInnerHeight * spacingY * 3,
  chartPaddingTop + chartInnerHeight * spacingY * 2,
  chartPaddingTop + chartInnerHeight * spacingY * 1,
];

// Horizontal spacing
const linePadding = 10;
const chartWidth = Dimensions.get('window').width - 2 * 20; // minus padding
const chartInnerWidth = chartWidth - 4 * linePadding;
const spaceX = chartInnerWidth / 7;
const dotsX = [
  2 * linePadding + spaceX * 0.5,
  2 * linePadding + spaceX * 1.5,
  2 * linePadding + spaceX * 2.5,
  2 * linePadding + spaceX * 3.5,
  2 * linePadding + spaceX * 4.5,
  2 * linePadding + spaceX * 5.5,
  2 * linePadding + spaceX * 6.5,
];

/* End chart spacing */

const Chart = ({
  onPress,
  title,
  data = [],
  lines = 6,
  withFocus = false,
  focused = null,
}) => (
  <View>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.chartContainer}>
      {Array(lines)
        .fill()
        .map((_, i) => (
          <Text
            key={i}
            style={styles.line}
            ellipsizeMode="clip"
            numberOfLines={1}>
            {''.padEnd(300, '-')}
          </Text>
        ))}
      <Svg
        style={styles.svgContainer}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <G
          id="Group"
          strokeWidth={2}
          stroke={withFocus ? colors.DARK_BLUE_TRANS : colors.DARK_BLUE}>
          {data.map((value, index) => {
            if (index === 0) {
              return null;
            }
            if (data[index] === null) {
              return null;
            }
            if (data[index - 1] === null) {
              return null;
            }
            return (
              <Line
                key={`${value}${index}`}
                x1={dotsX[index - 1]}
                y1={dotsY[data[index - 1]]}
                x2={dotsX[index]}
                y2={dotsY[data[index]]}
              />
            );
          })}
          {data.map((value, index) => {
            if (value === null) {
              return null;
            }
            return (
              <Circle
                key={`${value}${index}`}
                fill={
                  colorsMap[
                    value +
                      (withFocus && focused !== index
                        ? colorsMap.length / 2
                        : 0)
                  ]
                }
                stroke={
                  withFocus && focused !== index
                    ? colors.DARK_BLUE_TRANS
                    : colors.DARK_BLUE
                }
                cx={dotsX[index]}
                cy={dotsY[value]}
                r={dotSize}
                onPress={() => (onPress ? onPress(index) : null)}
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.days}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            onPress={() => (onPress ? onPress(index) : null)}>
            <Text style={styles.day}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginTop: 40,
    color: colors.DARK_BLUE,
    fontWeight: '700',
    marginLeft: 15,
  },
  chartContainer: {
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f5fafb',
    borderColor: '#D4F0F2',
    justifyContent: 'space-around',
    height: chartHeight,
    paddingTop: chartPaddingTop,
  },
  line: {
    color: '#D4F0F2',
    width: '100%',
    letterSpacing: 1,
    paddingHorizontal: linePadding,
  },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: linePadding,
    height: daysHeight + 10,
    alignItems: 'center',
    marginTop: -10,
  },
  day: {
    color: colors.DARK_BLUE,
    fontWeight: '600',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    height: chartHeight,
    width: '100%',
  },
});

export default Chart;
