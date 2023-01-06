import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import { answers } from "../../scenes/survey/utils";
import CircledIcon from "../../components/CircledIcon";

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
      style={[
        styles.answersContainer,
        size === "small" && { padding: 0, marginVertical: 0, height: 36 },
        inline && styles.answersContainerInline,
        containerStyle,
      ]}
    >
      {options.map((answer, i) => {
        const active = focusedScores.includes(answer.score);
        return (
          <TouchableOpacity key={i} onPress={() => onPress(answer.score)}>
            <View
              style={[
                styles.selectionContainer,
                inline && { marginHorizontal: 5 },
                itemStyle,
                active && styles.activeSelectionContainer,
              ]}
            >
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
                <View
                  className={`${size === "small" ? "w-5 h-5" : "w-7 h-7"} rounded-full`}
                  style={{ backgroundColor: answer.backgroundColor }}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    padding: 4,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
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
