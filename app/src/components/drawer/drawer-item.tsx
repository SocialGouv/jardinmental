import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors } from "../../utils/colors";
import Icon from "../Icon";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

export default ({ title, navigation, path = "tabs", icon = null, color = colors.LIGHT_BLUE, onClick, badge = false, style }) => {
  const handleClick = () => {
    onClick();
    navigation && navigation.navigate(path);
  };
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={[styles.container, style]} className="px-4 py-6">
        <View style={styles.answer}>
          {icon ? (
            <View
              className={`ml-2  rounded-full p-2 border w-8 h-8 items-center justify-center`}
              style={{
                borderColor: color,
              }}
            >
              {badge ? <View style={styles.badge} /> : null}
              {React.cloneElement(icon, {
                color: color,
                width: 16,
                height: 16,
              })}
            </View>
          ) : (
            <View style={{ marginHorizontal: 30 }} />
          )}
          <Text style={styles.label} className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-800")}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 0,
    right: -5,
    backgroundColor: "#E46C76",
    borderRadius: 16,
    zIndex: 2,
    width: 12,
    height: 12,
  },
  container: {
  },
  button: {
    width: 45,
    height: 45,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.BLUE,
    textAlign: "left",
    flex: 1,
  },
});
