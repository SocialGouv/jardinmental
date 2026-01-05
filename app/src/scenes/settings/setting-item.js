import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

const SettingItem = ({ title, navigation, path, icon, color = colors.LIGHT_BLUE, onClick, isLast, isFirst, description }) => {
  const handleClick = () => {
    onClick();
    if (path) {
      navigation.push(path);
    }
  };
  return (
    <TouchableOpacity
      onPress={handleClick}
      className={mergeClassNames("border border-cnam-primary-200 bg-white", isLast ? "rounded-b-2xl" : "", isFirst ? "rounded-t-2xl" : "")}
    >
      <View className="p-3">
        <View style={styles.answer}>
          {icon && (
            <View
              className={`rounded-full p-2 border w-8 h-8 items-center justify-center`}
              style={{
                borderColor: color,
              }}
            >
              {React.cloneElement(icon, {
                color: color,
                width: 16,
                height: 16,
              })}
            </View>
          )}
          <View className="flex-col ml-2">
            <Text style={styles.label}>{title}</Text>
            <Text className={mergeClassNames(typography.textSmRegular, "text-cnam-primary-800 pr-6 mt-1")}>{description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.BLUE,
    flex: 1,
  },
  answer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SettingItem;
