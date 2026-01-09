import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors } from "../../utils/colors";
import { answers } from "../survey-v2/utils";
import { analyzeScoresMapIcon, TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Typography } from "@/components/Typography";

const ScorePicker = ({
  focusedScores,
  onPress,
  containerStyle,
  itemStyle,
  children,
  size = "normal",
  inline = false,
  showIcon = true,
  options = answers,
}) => {
  return (
    <View
      className="space-x-2"
      style={[
        styles.answersContainer,
        size === "small" && { padding: 0, marginVertical: 0, height: 60 },
        inline && styles.answersContainerInline,
        containerStyle,
      ]}
    >
      {options.map((answer, i) => {
        const active = focusedScores.includes(answer.score);
        const item = analyzeScoresMapIcon[answer.score];
        return (
          <TouchableOpacity key={i} onPress={() => onPress(answer.score)}>
            <View
              className="h-[32] w-[32] rounded-full justify-center items-center"
              style={{
                backgroundColor: item.color,
                borderWidth: active ? 2 : 0,
                borderColor: TW_COLORS.CNAM_PRIMARY_800,
              }}
            >
              <Typography className={mergeClassNames(typography.textSmMedium)} style={{ color: item.iconColor }}>
                {item.symbol}
              </Typography>
            </View>
            {/* <View style={[styles.selectionContainer, inline && { marginHorizontal: 5 }, itemStyle, active && styles.activeSelectionContainer]}>
              {showIcon ? (
                <CircledIcon
                  color={answer.backgroundColor}
                  borderColor={answer.borderColor}
                  iconColor={answer.iconColor}
                  icon={answer.icon}
                  iconContainerStyle={{
                    marginRight: 0,
                    width: size === "small" ? 21 : 30,
                    height: size === "small" ? 21 : 30,
                  }}
                  iconWidth={size === "small" ? 17 : 24}
                  iconHeight={size === "small" ? 17 : 24}
                />
              ) : (
                <View className={`${size === "small" ? "w-5 h-5" : "w-7 h-7"} rounded-full`} style={{ backgroundColor: answer.backgroundColor }} />
              )}
            </View> */}
          </TouchableOpacity>
        );
      })}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  answersContainer: {
    flex: 1,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
  },
  answersContainerInline: {
    flexWrap: "wrap",
    flex: 0,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentContainer: {
    flexGrow: 0,
  },
  content: {
    color: colors.DARK_BLUE,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "400",
  },
  day: {
    fontWeight: "600",
  },
  month: {
    textTransform: "lowercase",
    fontStyle: "italic",
  },
  button: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ScorePicker;
