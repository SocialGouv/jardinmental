import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Slider } from "@miblanchard/react-native-slider";

import { StyleSheet, View, Text } from "react-native";
import { screenWidth } from "../../scenes/onboarding/screens";
const HEIGHT_RATIO_GAUGE = 48 / 256;

const styles = StyleSheet.create({
  gaugeContainer: {
    height: screenWidth * HEIGHT_RATIO_GAUGE,
  },
  gaugeGrey: {},
});

const Mask = ({ width, value, reverse }) => {
  const numberOfBars = 24;
  const widthBar = (width / (numberOfBars - 1)) * 0.4;
  const marginBar =
    (width / (numberOfBars - 1)) * 0.6 + ((width / (numberOfBars - 1)) * 0.6) / (numberOfBars - 1);
  const unitWidth = widthBar + marginBar;
  const arrayBarsIndex = [...Array(numberOfBars).keys()];
  const widthGreyMask =
    unitWidth *
    arrayBarsIndex.slice().reverse()[
      Math.min(arrayBarsIndex.length - 1, Math.floor(value * (numberOfBars / 100) * 100))
    ];

  const colors = reverse
    ? ["#5DEE5A", "#F2F478", "#F2F478", "#F16B6B"]
    : ["#F16B6B", "#F2F478", "#F2F478", "#5DEE5A"];

  return (
    <MaskedView
      style={{
        width: width,
        height: width * HEIGHT_RATIO_GAUGE,
        flex: 1,
        flexDirection: "row",
      }}
      maskElement={
        <View
          style={{
            // Transparent background because mask is based off alpha channel.
            backgroundColor: "transparent",
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {arrayBarsIndex.map((n) => (
            <View
              key={n}
              style={{
                borderRadius: 999,
                width: widthBar,
                height:
                  width * HEIGHT_RATIO_GAUGE * 0.2 +
                  width * HEIGHT_RATIO_GAUGE * ((n * (80 / (numberOfBars - 1))) / 100), // height * 0.2 + height * [0 to 0.8]
                backgroundColor: "#000", // backgroundColor needed to make the mask work
                marginRight: n == numberOfBars - 1 ? 0 : marginBar, // no margin right on the last one
              }}
            />
          ))}
        </View>
      }
    >
      <LinearGradient
        colors={colors}
        angle={90}
        useAngle={true}
        locations={[0, 0.479167, 0.526042, 1]}
        style={{ flex: 1 }}
      />
      <View
        style={{
          width: widthGreyMask,
          height: "100%",
          zIndex: 100,
          position: "absolute",
          right: 0,
          backgroundColor: "#D9DBE0",
        }}
      />
    </MaskedView>
  );
};

const Gauge = ({ hideSlider = false, defaultValue = 0, onChange, reverse }) => {
  const [value, setValue] = useState(defaultValue);
  const [width, setWidth] = useState(0);

  const handleChange = (v) => {
    console.log(v);
    setValue(v);
    onChange?.(v[0]);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <View
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        setWidth(layout.width);
      }}
    >
      <View style={styles.gaugeContainer}>
        <Mask width={width} value={value} reverse={reverse} />
      </View>
      {/* <Text>{defaultValue}</Text> */}
      {hideSlider ? null : (
        <Slider
          value={value}
          onValueChange={handleChange}
          maximumTrackTintColor={"#26387C"}
          minimumTrackTintColor={"#26387C"}
          thumbTintColor={"#26387C"}
        />
      )}
    </View>
  );
};

export default Gauge;
