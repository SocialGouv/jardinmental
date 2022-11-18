import React, { useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-community/masked-view";
import { Slider } from "@miblanchard/react-native-slider";

import { StyleSheet, View } from "react-native";
import { screenWidth } from "../../scenes/onboarding/screens";
const HEIGHT_RATIO_GAUGE = 48 / 256;

const styles = StyleSheet.create({
  gaugeContainer: {
    height: screenWidth * HEIGHT_RATIO_GAUGE,
  },
  gaugeGrey: {},
});

const Mask = ({ unit, value }) => {
  const numberOfBars = 24;
  const widthBar = (unit / (numberOfBars - 1)) * 0.4;
  const marginBar =
    (unit / (numberOfBars - 1)) * 0.6 + ((unit / (numberOfBars - 1)) * 0.6) / (numberOfBars - 1);
  const unitWidth = widthBar + marginBar;
  const arrayBarsIndex = [...Array(numberOfBars).keys()];
  const widthGreyMask = unitWidth * arrayBarsIndex.slice().reverse()[Math.floor(value * (24 / 100) * 100)];

  return (
    <MaskedView
      style={{
        width: unit,
        height: unit * HEIGHT_RATIO_GAUGE,
        flex: 1,
        flexDirection: "row",
        height: "100%",
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
                  unit * HEIGHT_RATIO_GAUGE * 0.2 +
                  unit * HEIGHT_RATIO_GAUGE * ((n * (80 / (numberOfBars - 1))) / 100), // height * 0.2 + height * [0 to 0.8]
                backgroundColor: "#000", // backgroundColor needed to make the mask work
                marginRight: n == numberOfBars - 1 ? 0 : marginBar, // no margin right on the last one
              }}
            />
          ))}
        </View>
      }
    >
      <LinearGradient
        colors={["#F16B6B", "#F2F478", "#F2F478", "#5DEE5A"]}
        angle={-90}
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

const Gauge = ({}) => {
  const [value, setValue] = useState(0);
  return (
    <>
      <View style={styles.gaugeContainer}>
        <Mask unit={screenWidth} value={value} />
      </View>

      <Slider
        value={value}
        onValueChange={setValue}
        maximumTrackTintColor={"#26387C"}
        minimumTrackTintColor={"#26387C"}
        thumbTintColor={"#26387C"}
      />
    </>
  );
};

export default Gauge;
