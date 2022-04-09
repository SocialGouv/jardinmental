import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import Button from "./RoundButtonIcon";

const FloatingPlusButton = ({ onPress, shadow }) => {
  return (
    <View style={styles.buttonWrapper}>
      <Button
        backgroundColor={colors.LIGHT_BLUE}
        iconColor={colors.WHITE}
        borderWidth={0}
        icon="plus"
        visible={true}
        onPress={onPress}
        shadow={shadow}
      />
    </View>
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
  // buttonStyle: {
  //   position: "absolute",
  //   width: 50,
  //   height: 50,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   right: 30,
  //   bottom: 30,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,

  //   elevation: 5,
  // },
});

export default FloatingPlusButton;
