import React, { useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card } from "../../../components/Card";
import Separator from "../../../components/Separator";
import { Title } from "../../../components/Title";
import { getGoalsDailyRecords, getGoalsTracked, setGoalDailyRecord } from "../../../utils/localStorage/goals";
import { GoalCheckboxItem } from "./GoalCheckboxItem";
import { useLayout } from "@react-native-community/hooks";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import JMButton from "@/components/JMButton";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import { NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import HelpView from "@/components/HelpView";
import { useBottomSheet } from "@/context/BottomSheetContext";
import Target from "@assets/svg/icon/Target";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { TW_COLORS } from "@/utils/constants";

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
