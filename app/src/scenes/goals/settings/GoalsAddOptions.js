import React, { useCallback, useState } from "react";
import { Button2 } from "../../../components/Button2";
import { Card } from "../../../components/Card";
import { Screen } from "../../../components/Screen";
import { Collapsable } from "../../../components/Collapsable";
import { GOALS_EXAMPLE } from "../../../utils/goalsConstants";
import { InputCheckbox } from "../../../components/InputCheckbox";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsTracked, setGoalTracked } from "../../../utils/localStorage/goals";
import { GoalAddCheckable } from "./GoalAddCheckable";
import { DAYS_OF_WEEK } from "../../../utils/date/daysOfWeek";

const GOALS_EXAMPLE_FLAT = Object.values(GOALS_EXAMPLE).reduce((acc, subGoalCategory) => {
  return [...acc, ...subGoalCategory];
}, []);

export const GoalsAddOptions = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [disabledGoals, setDisabledGoals] = useState([]);
  const [enabledExampleGoals, setEnabledExampleGoals] = useState({});
  const [goalsToChange, setGoalsToChange] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setDisabledGoals(await getGoalsTracked({ enabled: false }));

        const enabledGoals = await getGoalsTracked({ enabled: true });
        let _enabledExampleGoals = {};
        for (const goal of enabledGoals) {
          const isEnabled =
            GOALS_EXAMPLE_FLAT.find((exampleGoalLabel) => goal.label === exampleGoalLabel) !== null;
          if (isEnabled)
            _enabledExampleGoals = {
              ..._enabledExampleGoals,
              [goal.label]: isEnabled,
            };
        }
        setEnabledExampleGoals(_enabledExampleGoals);
      })();
    }, [])
  );

  const changeGoal = useCallback(
    ({ label, enabled, type }) => {
      setIsChanged(true);
      setGoalsToChange({
        ...goalsToChange,
        [label]: { enabled, type },
      });
    },
    [goalsToChange]
  );

  const onValidate = async () => {
    if (loading) return;
    setLoading(true);
    for (const goalLabel of Object.keys(goalsToChange)) {
      const goalToChange = goalsToChange[goalLabel];
      if (goalToChange.type === "disabled") {
        await setGoalTracked({ label: goalLabel, enabled: goalToChange.enabled });
      } else if (goalToChange.type === "example") {
        await setGoalTracked({
          label: goalLabel,
          enabled: goalToChange.enabled,
          daysOfWeek: DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day] = true;
            return acc;
          }, {}),
        });
      }
    }
    setLoading(false);
    navigation.goBack();
  };

  return (
    <Screen
      header={{
        title: "Ajouter un objectif",
      }}
      bottomChildren={
        <Button2 fill title="Enregistrer" onPress={onValidate} loading={loading} disabled={!isChanged} />
      }
    >
      <Card
        title="Créez votre objectif personnalisé"
        text="Définissez votre objectif et planifiez le sur les jours de la semaine que vous souhaitez"
      >
        <Button2
          preset="secondary"
          fill
          title="Créer un objectif"
          icon="Plus2Svg"
          onPress={() => navigation.navigate("goals-create-form")}
        />
      </Card>
      <Collapsable
        preset="primary"
        title="Choisir un objectif parmi des exemples"
        containerStyle={{ marginTop: 24 }}
      >
        {Object.keys(GOALS_EXAMPLE).map((goalCategory) => {
          return (
            <Collapsable preset="secondary" title={goalCategory} key={goalCategory}>
              {GOALS_EXAMPLE[goalCategory].map((goalExample) => {
                return (
                  <InputCheckbox
                    key={goalExample}
                    label={goalExample}
                    checked={goalsToChange?.[goalExample]?.enabled ?? enabledExampleGoals?.[goalExample]}
                    onCheckedChanged={({ checked }) => {
                      changeGoal({ label: goalExample, enabled: checked, type: "example" });
                    }}
                  />
                );
              })}
            </Collapsable>
          );
        })}
      </Collapsable>
      <Collapsable preset="primary" title="Réactiver un ancien objectif">
        {disabledGoals.map((goal) => {
          return (
            <GoalAddCheckable
              goal={goal}
              checked={goalsToChange?.[goal?.label]?.enabled}
              onCheckedChanged={({ checked }) => {
                changeGoal({ label: goal?.label, enabled: checked, type: "disabled" });
              }}
            />
          );
        })}
      </Collapsable>
    </Screen>
  );
};
