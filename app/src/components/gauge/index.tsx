import React, { useEffect, useState } from "react";

import { Slider } from "@miblanchard/react-native-slider";

import { StyleSheet, View } from "react-native";
import { screenWidth } from "../../scenes/onboarding/screens";
import { GaugeChart } from "./GaugeChart";
import { TW_COLORS } from "@/utils/constants";
const HEIGHT_RATIO_GAUGE = 48 / 256;

const styles = StyleSheet.create({
  gaugeContainer: {
    height: screenWidth * HEIGHT_RATIO_GAUGE,
    // marginHorizontal: 10,
  },
});

const Gauge = ({ hideSlider = false, defaultValue = 0, onChange, reverse }) => {
  const [value, setValue] = useState(defaultValue);
  const [, setWidth] = useState(0);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <View
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        setWidth(layout.width - 20);
      }}
    >
      <View style={styles.gaugeContainer}>
        <GaugeChart value={value} reverse={reverse} />
      </View>
      {hideSlider ? null : (
        <Slider
          trackClickable={false}
          value={value}
          onValueChange={(v) => setValue(v[0])} // immediate local update
          onSlidingComplete={(v) => {
            onChange?.(v[0]); // called only once at the end
          }}
          maximumTrackTintColor={TW_COLORS.GRAY_600}
          minimumTrackTintColor={TW_COLORS.CNAM_PRIMARY_900}
          thumbTintColor={TW_COLORS.CNAM_PRIMARY_900}
          trackStyle={{ height: 7, borderRadius: 5 }} // thicker track
          thumbStyle={{ height: 21, width: 21, borderRadius: 20 }}
          // trackStyle={{ marginHorizontal: 10 }}
        />
      )}
    </View>
  );
};

export default Gauge;
