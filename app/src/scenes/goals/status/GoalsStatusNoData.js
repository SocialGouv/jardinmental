import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "../../../components/Card";
import Separator from "../../../components/Separator";
import { getGoalsTrackedFromData } from "../../../utils/localStorage/goals";
import { parseISO, isToday } from "date-fns";

export const GoalsStatusNoData = ({ goalsData, date, onPress }) => {
  const goals = getGoalsTrackedFromData({ data: goalsData, date });

  const dateIsToday = isToday(parseISO(date));

  if (!goals?.length) return null;

  return (
    <Card
      preset="grey"
      title={`Vous avez ${goals.length} objectif${goals.length > 1 ? "s" : ""} ${dateIsToday ? "aujourd’hui" : "ce jour-là"}`}
      image={{ source: require("./../../../../assets/imgs/goal.png") }}
      containerStyle={{ marginTop: 8 }}
      onPress={() => onPress?.({ toGoals: true })}
      mergeChildren={false}
    >
      {goals.map((goal) => (
        <View key={goal?.id}>
          <Separator />
          <Text style={styles.label}>{goal.label}</Text>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    textAlign: "left",
    color: "#000000",
  },
});
