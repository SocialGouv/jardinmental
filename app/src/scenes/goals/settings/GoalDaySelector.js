import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button2 } from "../../../components/Button2";
import { InputCheckbox } from "../../../components/InputCheckbox";
import { InputLabel } from "../../../components/InputLabel";
import { Screen } from "../../../components/Screen";
import { DAYS_OF_WEEK } from "../../../utils/date/daysOfWeek";
import { getGoalsData, setGoalTracked } from "../../../utils/localStorage/goals";
import { setDay, format } from "date-fns";
import { fr } from "date-fns/locale";

export const GoalDaySelector = ({ navigation, route }) => {
  const goalId = route.params?.goalId;
  const goalLabel = route.params?.goalLabel;
  const goalDaysOfWeek = route.params?.goalDaysOfWeek;
  const editing = route.params?.editing;
  const [editingGoal, setEditingGoal] = useState();

  const [ready, setReady] = useState(!editing ? true : false);
  const [loading, setLoading] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState(goalDaysOfWeek);

  useEffect(() => {
    async function _() {
      if (editing) {
        const data = await getGoalsData();
        const goal = data.goals?.data?.[goalId];
        if (goal) {
          setEditingGoal(goal);
          if (!!goal.daysOfWeek) {
            setDaysOfWeek(goalDaysOfWeek || goal.daysOfWeek);
          }
          setReady(true);
        }
      }
    }
    _();
  }, []);

  const onValidate = async () => {
    if (loading) return;
    // setLoading(true);
    // if (goalId) await setGoalTracked({ id: goalId, daysOfWeek });
    // setLoading(false);
    if (!editing) {
      navigation.navigate("goal-config", { editing: false, goalDaysOfWeek: daysOfWeek, goalLabel });
    } else {
      navigation.navigate("goal-config", {
        editing: true,
        goalId: editingGoal.id,
        goalDaysOfWeek: daysOfWeek,
      });
    }
  };

  // useEffect(() => {
  //   if (editing && ready) onValidate();
  // }, [daysOfWeek]);

  if (!ready) return null;

  return (
    <Screen
      header={{
        title: !editing ? "Créer un objectif" : "Récurrence",
        leftButton: editing && {
          icon: "ArrowUpSvg",
          iconStyle: { transform: [{ rotate: "270deg" }] },
          onPress: onValidate,
        },
      }}
      bottomChildren={!editing && <Button2 fill title="Suivant" onPress={onValidate} loading={loading} />}
    >
      <InputLabel style={styles.spacing}>Planifier votre objectif</InputLabel>
      <InputLabel style={styles.spacingBottom} sublabel>
        Sélectionnez les jours de la semaine où vous souhaitez réaliser l'objectif "{!editing ? goalLabel : editingGoal?.label}"
      </InputLabel>
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map((day, index) => ({ day, index }))
          .sort((a, b) => (b.index === 0 ? -1 : 0))
          .map(({ day, index }) => {
            const label = format(setDay(new Date(), index), "eeee", { locale: fr });
            return (
              <InputCheckbox
                key={day}
                label={`Chaque ${label?.toLowerCase?.()}`}
                checked={daysOfWeek?.[day]}
                onCheckedChanged={({ checked }) => {
                  setDaysOfWeek({ ...daysOfWeek, [day]: checked });
                }}
              />
            );
          })}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
  spacingBottom: {
    marginBottom: 8,
  },
  daysContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
});
