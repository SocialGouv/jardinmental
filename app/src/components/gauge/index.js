/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useMemo } from 'react';

import { Slider } from '@miblanchard/react-native-slider';
import debounce from "lodash.debounce";

import { StyleSheet, View, Platform } from 'react-native';
import { screenWidth } from '../../scenes/onboarding/screens';
import { GaugeChart } from './GaugeChart';
import { colors } from '@/utils/colors';
const HEIGHT_RATIO_GAUGE = 48 / 256;

const styles = StyleSheet.create({
  gaugeContainer: {
    height: screenWidth * HEIGHT_RATIO_GAUGE,
    // marginHorizontal: 10,
  },
});

const Gauge = ({ hideSlider = false, defaultValue = 0, onChange, reverse }) => {
  const [value, setValue] = useState(defaultValue);
  const [width, setWidth] = useState(0);


  const handleChange = useMemo(() => {
    return debounce((v) => {
      setValue(v[0]);
      onChange?.(v[0]);
    }, 300) // 300ms debounce
  }, [onChange]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <View
      onLayout={event => {
        const layout = event.nativeEvent.layout;
        setWidth(layout.width - 20);
      }}>
      <View style={styles.gaugeContainer}>
        <GaugeChart value={value} reverse={reverse} />
      </View>
      {/* <Text>{defaultValue}</Text> */}
      {hideSlider ? null : (
        <Slider
          trackClickable={false}
          value={value}
          onValueChange={(v) => setValue(v[0])} // immediate local update
          onSlidingComplete={(v) => {
            onChange?.(v[0]); // called only once at the end
          }}
          maximumTrackTintColor={'#D9DBE0'}
          minimumTrackTintColor={colors.BLUE}
          thumbTintColor={colors.BLUE}
        // trackStyle={{ marginHorizontal: 10 }}
        />
      )}
    </View>
  );
};

export default Gauge;
