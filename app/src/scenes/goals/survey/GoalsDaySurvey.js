import React, { useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card } from "../../../components/Card";
import Separator from "../../../components/Separator";
import { Title } from "../../../components/Title";
import { getGoalsDailyRecords, getGoalsTracked, setGoalDailyRecord } from "../../../utils/localStorage/goals";
import { GoalCheckboxItem } from "./GoalCheckboxItem";
import { useLayout } from "@react-native-community/hooks";

export const GoalsDaySurvey = forwardRef(({ date, scrollRef, route }, ref) => {
  useImperativeHandle(ref, () => {
    return {
      onSubmit,
    };
  });

  const navigation = useNavigation();

  const [goals, setGoals] = useState([]);
  const [goalsRecords, setGoalsRecords] = useState({});
  const [goalsRecordsToUpdate, setGoalsRecordsToUpdate] = useState({});

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

  const onGoalChanged = useCallback(
    ({ checked, comment, goal }) => {
      setGoalsRecordsToUpdate({
        ...goalsRecordsToUpdate,
        [goal?.id]: {
          goalId: goal?.id,
          value: checked !== undefined ? checked : goalsRecordsToUpdate?.[goal?.id]?.value,
          comment: comment !== undefined ? comment : goalsRecordsToUpdate?.[goal?.id]?.comment,
          date,
        },
      });
    },
    [goalsRecordsToUpdate, date]
  );

  const onSubmit = useCallback(async () => {
    for (const goal of goals) {
      if (!goal?.id) continue;

      if (goalsRecordsToUpdate?.[goal.id]) {
        await setGoalDailyRecord(goalsRecordsToUpdate[goal.id]);
        continue;
      }

      if (goalsRecords?.[goal.id]) continue;

      await setGoalDailyRecord({
        goalId: goal.id,
        value: false,
        date,
      });
    }
  }, [goals, goalsRecords, goalsRecordsToUpdate]);

  const { onLayout, ...layout } = useLayout();
  useEffect(() => {
    if (layout?.y > 0 && route?.params?.toGoals === true) {
      scrollRef?.current?.scrollTo?.({ y: layout.y, animated: false });
    }
  }, [layout]);
  if (goals.length === 0) return null;

  return (
    <View style={styles.container} onLayout={onLayout} className="mb-2 border-b-2 border-gray-400 px-4 my-4">
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
          //text="Vous pouvez gérez vos objectifs et en créer de nouveaux"
          icon={{ icon: "ImportantSvg" }}
          onPress={() => navigation.navigate("goals-settings")}
          containerStyle={styles.spacing}
        />
      </View>
      <Separator />
    </View>
  );
});

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
