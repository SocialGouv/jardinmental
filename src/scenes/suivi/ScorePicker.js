import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import { answers } from "../../scenes/survey/utils";
import CircledIcon from "../../components/CircledIcon";

const ScorePicker = ({ focusedScores, onPress }) => {
  return (
    <View style={styles.answersContainer}>
      {answers.map((answer, i) => {
        const active = focusedScores.includes(answer.score);
        return (
          <TouchableOpacity key={i} onPress={() => onPress(answer.score)}>
            <View style={[styles.selectionContainer, active && styles.activeSelectionContainer]}>
              <CircledIcon
                color={answer.backgroundColor}
                borderColor={answer.borderColor}
                iconColor={answer.iconColor}
                icon={answer.icon}
                iconContainerStyle={{ marginRight: 0, width: 30, height: 30 }}
                iconWidth={24}
                iconHeight={24}
              />
            </View>
          </TouchableOpacity>
        );
      })}
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
