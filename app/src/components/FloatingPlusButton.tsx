import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../utils/colors";
import Button from "./RoundButtonIcon";
import logEvents from "../services/logEvents";
import { TAB_BAR_HEIGHT } from "@/utils/constants";

const FloatingPlusButton = ({ onPress, shadow, plusPosition }) => {
  // Handle both regular numbers and SharedValues
  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = typeof plusPosition === "object" && plusPosition?.value !== undefined ? plusPosition.value : plusPosition || 0;

    return {
      transform: [{ translateX }],
    };
  });

  if (!plusPosition && plusPosition !== 0) return null;

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        {
          bottom: insets.bottom + TAB_BAR_HEIGHT,
        },
        animatedStyle,
      ]}
    >
      <Button
        backgroundColor={colors.LIGHT_BLUE}
        iconColor={colors.WHITE}
        borderWidth={0}
        icon="small-plus"
        visible={true}
        onPress={() => {
          logEvents._deprecatedLogFeelingStartFloatingPlus();
          onPress();
        }}
        shadow={shadow}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default FloatingPlusButton;
