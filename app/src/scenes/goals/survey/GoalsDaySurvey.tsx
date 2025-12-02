import React, { useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getGoalsDailyRecords, getGoalsTracked, setGoalDailyRecord } from "../../../utils/localStorage/goals";
import { GoalCheckboxItem } from "./GoalCheckboxItem";
import { useLayout } from "@react-native-community/hooks";
import JMButton from "@/components/JMButton";
import HelpView from "@/components/HelpView";
import { useBottomSheet } from "@/context/BottomSheetContext";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { TW_COLORS } from "@/utils/constants";
import * as Sentry from "@sentry/react-native";

export const GoalsDaySurvey = forwardRef(({ date, scrollRef, route }, ref) => {
  useImperativeHandle(ref, () => {
    return {
      onSubmit,
    };
  });
  const { showBottomSheet } = useBottomSheet();

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
    try {
      for (const goal of goals) {
        if (!goal?.id) continue;

        try {
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
        } catch (goalError) {
          console.error(`Erreur lors de la sauvegarde du goal ${goal.id}:`, goalError);
          Sentry.captureException(goalError, {
            tags: { context: "goals_survey_individual_goal" },
            extra: { goalId: goal.id, date },
          });
          // Continue avec les autres goals même si un échoue
        }
      }
    } catch (error) {
      console.error("Erreur globale dans onSubmit goals:", error);
      Sentry.captureException(error, {
        tags: { context: "goals_survey_submit" },
        extra: { date, goalsCount: goals.length },
      });
      // Ne pas bloquer la validation même en cas d'erreur
    }
  }, [goals, goalsRecords, goalsRecordsToUpdate, date]);

  const { onLayout, ...layout } = useLayout();
  useEffect(() => {
    if (layout?.y > 0 && route?.params?.toGoals === true) {
      scrollRef?.current?.scrollTo?.({ y: layout.y, animated: false });
    }
  }, [layout]);
  if (goals.length === 0) return null;

  const showHelpModal = () => {
    return showBottomSheet(<HelpView title={""} description={""} />);
  };

  return (
    <View onLayout={onLayout} className="px-4 my-0">
      <View>
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
      </View>
      <View className="flex-row justify-center mb-9">
        <JMButton
          icon={<ArrowIcon color={TW_COLORS.GRAY_700} />}
          onPress={() => navigation.navigate("goals-settings")}
          iconPosition="right"
          width="fixed"
          variant="outline"
          title="Personnaliser mes objectifs"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  spacing: {
    marginVertical: 8,
  },
});
