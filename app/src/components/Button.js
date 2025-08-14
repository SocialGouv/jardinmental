import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "./MyText";
import { colors } from "@/utils/colors";

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
    shadowColor: "#0A215C",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 19,
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const Button = ({ title, buttonColor, textColor, onPress = () => null, disabled = false, buttonStyle, textStyle, Icon = null }) => {
  const color = disabled ? "lightgrey" : buttonColor;
  return (
    <TouchableOpacity style={[{ ...styles.button, backgroundColor: color || colors.LIGHT_BLUE }, buttonStyle]} onPress={onPress} disabled={disabled}>
      {Icon ? (
        <View style={styles.iconContainer}>
          {Icon}
          <InsideText textStyle={textStyle} title={title} textColor={textColor} />
        </View>
      ) : (
        <InsideText textStyle={textStyle} title={title} textColor={textColor} />
      )}
    </TouchableOpacity>
  );
};

const InsideText = ({ textStyle, title, textColor }) => <Text style={[{ ...styles.text, color: textColor || "white" }, textStyle]}>{title}</Text>;

export default Button;
