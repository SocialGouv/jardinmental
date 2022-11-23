import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsAndRecords } from "../../../utils/localStorage/goals";
import { FriseGraph } from "../../suivi/frise/FriseGraph";

export const GoalsFriseGraph = ({
  chartDates,
  focusedScores,
  showTraitement,
  priseDeTraitement,
  priseDeTraitementSiBesoin,
}) => {
  const [goals, setGoals] = useState([]);

  const updateGoals = async () => {
    let _goals = await getGoalsAndRecords();
    _goals = _goals.map(({ goal, records }) => {
      const _records = records
        .filter((record) => chartDates.includes(record.date))
        .map((record) => ({
          ...record,
          value: record.value === true ? 5 : 0,
        }));

      return {
        goal,
        records: chartDates.map((date) => {
          const existingRecord = _records.find((record) => record.date === date);
          if (existingRecord) return existingRecord;
          else return {};
        }),
      };
    });
    console.log(JSON.stringify(_goals, null, 2));
    setGoals(_goals);
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
