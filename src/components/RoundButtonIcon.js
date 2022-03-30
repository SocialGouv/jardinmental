import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import Plus from "../../assets/svg/Plus";
import Pencil from "../../assets/svg/Pencil";
import Bin from "../../assets/svg/Bin";
import ArrowUpSvg from "../../assets/svg/arrow-up.svg";
import Done from "../../assets/svg/Done";
import ArrowRight from "../../assets/svg/arrow-right";

const RoundButtonIcon = ({
  iconColor = colors.BLUE,
  backgroundColor = "#f1f1f1",
  borderColor = "#e1e1e1",
  onPress,
  disabled,
  visible = false,
  isToggled,
  icon,
  borderWidth = 1,
  small,
}) => {
  if (!visible || !icon) return null;
  const render = () => {
    switch (icon) {
      case "plus":
        return (
          <Plus
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            width={small ? 9 : 19}
            height={small ? 9 : 19}
          />
        );
      case "pencil":
        return (
          <Pencil
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            width={small ? 9 : 19}
            height={small ? 9 : 19}
          />
        );
      case "bin":
        return (
          <Bin
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            width={small ? 9 : 19}
            height={small ? 9 : 19}
          />
        );
      case "cancel":
        return (
          <Plus
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            style={{ transform: [{ rotate: "45deg" }] }}
            width={small ? 9 : 19}
            height={small ? 9 : 19}
          />
        );
      case "toggle":
        return (
          <ArrowUpSvg
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            width={small ? 7 : 13}
            height={small ? 7 : 13}
            style={{ transform: [{ rotate: isToggled ? "0deg" : "180deg" }] }}
          />
        );
      case "validate":
        return <Done opacity={disabled ? 0.5 : 1} color={iconColor} />;
      case "arrow-right":
        return (
          <ArrowUpSvg
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            width={small ? 7 : 13}
            height={small ? 7 : 13}
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        );
      case "arrow-left":
        return (
          <ArrowUpSvg
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            width={small ? 7 : 13}
            height={small ? 7 : 13}
            style={{ transform: [{ rotate: "270deg" }] }}
          />
        );
    }
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.backButtonContainer,
        { backgroundColor, borderColor, borderWidth },
        { width: small ? 20 : 40, height: small ? 20 : 40 },
      ]}
    >
      {render()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
});

export default RoundButtonIcon;
