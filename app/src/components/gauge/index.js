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
    marginHorizontal: 10,
  },
});

const Mask = ({ width, value, reverse }) => {
  const numberOfBars = 20;
  const widthBar = (width / (numberOfBars - 1)) * 0.75;
  const marginRightBar = (width - numberOfBars * widthBar) / (numberOfBars - 1);
  const arrayBarsIndex = [...Array(numberOfBars).keys()];
  const widthGreyMask = width - width * value;

  const colors = reverse
    ? ["#5DEE5A", "#F2F478", "#F2F478", "#F16B6B"]
    : ["#F16B6B", "#F2F478", "#F2F478", "#5DEE5A"];

  return (
    <MaskedView
      style={{
        width: "100%",
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
                borderRadius: 3,
                width: widthBar,
                height:
                  width * HEIGHT_RATIO_GAUGE * 0.2 +
                  width * HEIGHT_RATIO_GAUGE * ((n * (80 / (numberOfBars - 1))) / 100), // height * 0.2 + height * [0 to 0.8]
                backgroundColor: "#000", // backgroundColor needed to make the mask work
                marginRight: n === arrayBarsIndex.length - 1 ? 0 : marginRightBar, // no margin right on the last one
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
    setValue(v[0]);
    onChange?.(v[0]);
  };

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
        <Mask width={width} value={value} reverse={reverse} />
      </View>
      {/* <Text>{defaultValue}</Text> */}
      {hideSlider ? null : (
        <Slider
          value={value}
          onValueChange={handleChange}
          maximumTrackTintColor={"#D9DBE0"}
          minimumTrackTintColor={"#26387c"}
          thumbTintColor={"#26387C"}
          renderThumbComponent={() => <View className="h-5 w-5 bg-[#26387c] rounded-full" />}
        />
      )}
    </View>
  );
};

export default Gauge;
