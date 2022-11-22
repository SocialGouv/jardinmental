import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card } from "../../../components/Card";
import Separator from "../../../components/Separator";
import { Title } from "../../../components/Title";
import { getGoalsDailyRecords, getGoalsTracked, setGoalDailyRecord } from "../../../utils/localStorage/goals";
import { GoalCheckboxItem } from "./GoalCheckboxItem";

export const GoalsDaySurvey = ({ date }) => {
  const navigation = useNavigation();

  const [goals, setGoals] = useState([]);
  const [goalsRecords, setGoalsRecords] = useState({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const _goals = await getGoalsTracked({ date });
        setGoals(_goals);
        const records = await getGoalsDailyRecords({ date });
        const _goalsRecords = {};
        for (const record of records) {
          _goalsRecords[record.goalId] = record;
        }
        setGoalsRecords(_goalsRecords);
      })();
    }, [])
  );

  const onGoalChanged = useCallback(async ({ checked, comment, goal }) => {
    await setGoalDailyRecord({
      goalId: goal.id,
      value: checked,
      comment,
      date,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Separator />
      <View style={styles.contentContainer}>
        <Title style={styles.spacing}>Mes objectifs</Title>
        <Card
          preset="lighten"
          title="Qu’avez-vous réalisé aujourd’hui ?"
          image={{ source: require("./../../../../assets/imgs/goal.png") }}
          containerStyle={styles.spacing}
        />
        {goals.map((goal, index) => {
          return (
            <GoalCheckboxItem
              key={goal.id}
              {...{ goal, index }}
              onCheckedChanged={onGoalChanged}
              onCommentChanged={onGoalChanged}
              checked={goalsRecords[goal.id]?.value}
              comment={goalsRecords[goal.id]?.comment}
            />
          );
        })}
        <Card
          title="Personnaliser mes objectifs"
          text="Vous pouvez gérez vos objectifs et en créer de nouveaux"
          icon={{ icon: "ImportantSvg" }}
          onPress={() => navigation.navigate("goals-settings")}
          containerStyle={styles.spacing}
        />
      </View>
      <Separator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  contentContainer: {
    marginVertical: 8,
  },
  spacing: {
    marginVertical: 8,
  },
});
