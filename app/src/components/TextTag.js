import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../utils/colors";
import Text from "./MyText";
import Icon from "./Icon";

export default ({
  textColor = colors.DARK_BLUE,
  onPress = () => null,
  onClose = () => null,
  onAdd = () => null,
  disabled = false,
  buttonStyle,
  textStyle,
  value,
  selected,
  color = colors.LIGHT_BLUE,
  enableClosed = false,
  enableAdd = false,
}) => {
  let backgroundColor = `${color}66`;
  if (selected) backgroundColor = colors.DARK_BLUE;
  if (disabled) backgroundColor = "lightgrey";

  let borderColor = color;
  if (selected) borderColor = colors.DARK_BLUE;
  if (disabled) borderColor = "grey";

  let myTextColor = textColor;
  if (selected) myTextColor = "white";
  if (disabled) myTextColor = "grey";
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[{ ...styles.button, backgroundColor, borderColor }, buttonStyle]}
        onPress={() => onPress(value)}
        disabled={disabled}
      >
        <Text style={[{ ...styles.text, color: myTextColor }, textStyle]}>{value}</Text>
      </TouchableOpacity>
      {enableClosed && (
        <TouchableOpacity style={styles.close} onPress={() => onClose(value)} disabled={disabled}>
          <Icon icon="CrossSvg" width={8} height={8} color={colors.BLUE} />
        </TouchableOpacity>
      )}
      {enableAdd && (
        <TouchableOpacity style={styles.add} onPress={() => onAdd(value)} disabled={disabled}>
          <Icon icon="CrossSvg" width={8} height={8} color={colors.BLUE} />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignSelf: "flex-end",
    marginBottom: 10,
    marginRight: 20,
  },
  close: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: -5,
    right: -8,
    backgroundColor: "#FFDEDC",
    borderRadius: 16,
    borderColor: "#D4F0F2",
    borderWidth: 1,
    zIndex: 2,
    width: 18,
    height: 18,
  },
  add: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: -5,
    right: -8,
    backgroundColor: "#94EAF4",
    borderRadius: 16,
    borderColor: "#D4F0F2",
    borderWidth: 1,
    zIndex: 2,
    width: 18,
    height: 18,
    transform: [{ rotate: "45deg" }],
  },
  button: {
    alignSelf: "flex-start",
    minHeight: 38,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  text: {
    fontWeight: "normal",
    fontSize: 15,
  },
  closeText: { fontSize: 12 },
});
