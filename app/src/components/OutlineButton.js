import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import Text from "./MyText";

const styles = StyleSheet.create({
  button: {
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 19,
  },
});

const Button = ({ title, textColor, onPress = () => null, disabled = false, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity
      style={[
        { ...styles.button, backgroundColor: "#ffffff", borderColor: colors.LIGHT_BLUE, borderWidth: 1 },
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[{ ...styles.text, color: textColor || colors.LIGHT_BLUE }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
