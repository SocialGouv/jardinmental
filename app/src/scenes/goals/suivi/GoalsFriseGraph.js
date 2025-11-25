import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsAndRecords } from "../../../utils/localStorage/goals";
import { FriseGraph } from "../../suivi/correlation/FriseGraph";
import { parseISO, getDay } from "date-fns";
import { DAYS_OF_WEEK } from "../../../utils/date/daysOfWeek";

export const GoalsFriseGraph = ({ chartDates, focusedScores, showTraitement, priseDeTraitement, priseDeTraitementSiBesoin, onIsEmptyChanged }) => {
  const [goals, setGoals] = useState([]);

  const updateGoals = async () => {
    let _goals = await getGoalsAndRecords();
    let isEmpty = true;
    _goals = _goals.map(({ goal, records }) => {
      const _records = records
        .filter((record) => chartDates.includes(record.date))
        .map((record) => ({
          ...record,
          value: record.value === true ? 5 : 1,
        }));

      if (_records.length > 0) isEmpty = false;

      return {
        goal,
        records: chartDates.map((date) => {
          const existingRecord = _records.find((record) => record.date === date);
          if (existingRecord) return existingRecord;
          else {
            if (goal?.daysOfWeek?.[DAYS_OF_WEEK[getDay(parseISO(date))]]) return { value: 0 };
            else return { value: -1 };
          }
        }),
      };
    });
    setGoals(_goals);
    onIsEmptyChanged?.(isEmpty);
  };

  useFocusEffect(
    useCallback(() => {
      updateGoals();
    }, [])
  );

  useEffect(() => {
    updateGoals();
  }, [chartDates]);

  return (
    <>
      {goals.map(({ goal, records }) => (
        <FriseGraph
          type="goal"
          key={goal.id}
          focusedScores={focusedScores}
          title={goal.label}
          data={records}
          showTraitement={false}
          {...{ showTraitement, priseDeTraitement, priseDeTraitementSiBesoin }}
        />
      ))}
    </>
  );
};
