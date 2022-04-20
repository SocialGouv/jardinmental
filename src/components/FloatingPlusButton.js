import React from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { colors } from "../utils/colors";
import Button from "./RoundButtonIcon";
import logEvents from "../services/logEvents";

const FloatingPlusButton = ({ onPress, shadow, plusVisible }) => {
  const [animatedFn, setAnimatedFn] = React.useState(null);

  React.useEffect(() => {
    if (plusVisible === undefined) return;
    const value = new Animated.Value(plusVisible ? 1 : 0);

    Animated.timing(value, {
      toValue: 1 - (plusVisible ? 1 : 0),
      duration: 500,
      easing: Easing.elastic(1), // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    }).start();

    setAnimatedFn(
      value.interpolate({
        inputRange: [0, 1],
        outputRange: ["0", "80"],
      })
    );
  }, [plusVisible]);

  if (!animatedFn) return null;

  return (
    <Animated.View style={[styles.buttonWrapper, animatedFn && { transform: [{ translateX: animatedFn }] }]}>
      <Button
        backgroundColor={colors.LIGHT_BLUE}
        iconColor={colors.WHITE}
        borderWidth={0}
        icon="small-plus"
        visible={true}
        onPress={() => {
          logEvents.logFeelingStartFloatingPlus();
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
    bottom: 75,
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
