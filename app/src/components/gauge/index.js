/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import {Slider} from '@miblanchard/react-native-slider';

import {StyleSheet, View, Platform} from 'react-native';
import {screenWidth} from '../../scenes/onboarding/screens';
import {GaugeChart} from './GaugeChart';
const HEIGHT_RATIO_GAUGE = 48 / 256;

const styles = StyleSheet.create({
  gaugeContainer: {
    height: screenWidth * HEIGHT_RATIO_GAUGE,
    marginHorizontal: 10,
  },
});

const Gauge = ({hideSlider = false, defaultValue = 0, onChange, reverse}) => {
  const [value, setValue] = useState(defaultValue);
  const [width, setWidth] = useState(0);

  const handleChange = v => {
    setValue(v[0]);
    onChange?.(v[0]);
  };

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
          value={value}
          onValueChange={handleChange}
          maximumTrackTintColor={'#D9DBE0'}
          minimumTrackTintColor={'#26387c'}
          thumbTintColor={'#26387C'}
          renderThumbComponent={() => (
            <View className="h-5 w-5 bg-[#26387c] rounded-full" />
          )}
          trackStyle={{marginHorizontal: 10}}
        />
      )}
    </View>
  );
};

export default Gauge;
