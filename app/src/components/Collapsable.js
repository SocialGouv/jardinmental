import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ArrowUpSvg from "../../../assets/svg/arrow-up.svg";

export const Collapsable = ({
  preset = "primary", // 'primary' | 'secondary'
  title,
  children,
}) => {
  const styles = applyStyles({ preset, type, checkable, checked, square, size, fill });

  return (
    <View style={[styles.container]}>
      <View style={[styles.pressableContainer]}>
        <TouchableOpacity>
          <View style={[styles.headerContainer]}>
            {title && <Text style={[styles.title]}>{title}</Text>}
            <ArrowUpSvg style={{ transform: [{ rotate: "180deg" }] }} color="#26387C" />
          </View>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

const applyStyles = ({ preset }) => {
  const appliedStyles = {
    ..._styles.base,
  };

  const applyIfNeeded = (cumStyles, condition, styleKey) => {
    if (eval(condition)) {
      cumStyles.container = { ...cumStyles.container, ..._styles[styleKey].container };
    }
  };

  applyIfNeeded(appliedStyles, "preset==='primary'", "primary");
  applyIfNeeded(appliedStyles, "preset==='secondary'", "secondary");

  return appliedStyles;
};

const _styles = {
  base: StyleSheet.create({
    container: {},
  }),
  primary: StyleSheet.create({
    container: {},
  }),
  secondary: StyleSheet.create({
    container: {},
  }),
};
