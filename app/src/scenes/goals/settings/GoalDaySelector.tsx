import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { InputCheckbox } from "../../../components/InputCheckbox";
import { DAY_OF_THE_WEEK_EN_FR } from "../../../utils/date/daysOfWeek";
import { getGoalsData, setGoalTracked } from "../../../utils/localStorage/goals";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { Button2 } from "@/components/Button2";
import { Typography } from "@/components/Typography";

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
    setLoading(true);
    if (editing && editingGoal?.id) {
      await setGoalTracked({ id: editingGoal.id, daysOfWeek });
    }
    setLoading(false);
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
    // <Screen
    //   header={{
    //     title: !editing ? "Créer un objectif" : "Récurrence",
    //     leftButton: editing && {
    //       icon: "ArrowUpSvg",
    //       iconStyle: { transform: [{ rotate: "270deg" }] },
    //       onPress: onValidate,
    //     },
    //   }}
    //   bottomChildren={!editing && <Button2 fill title="Suivant" onPress={onValidate} loading={loading} />}
    // >
    <AnimatedHeaderScrollScreen
      title={!editing ? "Créer un objectif" : "Récurrence"}
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      bottomComponent={
        <NavigationButtons absolute={true}>
          <Button2 fill title={editing ? "Valider" : "Suivant"} onPress={onValidate} loading={loading} />
        </NavigationButtons>
      }
      navigation={navigation}
    >
      <View className="mx-4">
        <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mt-8 mb-2")}>Planifier votre objectif</Typography>
        <Typography className={mergeClassNames(typography.textMdMedium, "text-primary-800 mb-8 ")}>
          Sélectionnez les jours de la semaine où vous souhaitez réaliser l'objectif "{!editing ? goalLabel : editingGoal?.label}"
        </Typography>
        <View style={styles.daysContainer} className="w-full">
          {DAY_OF_THE_WEEK_EN_FR.map((day, index) => {
            return (
              <View className={mergeClassNames("w-full mb-2", index === 0 ? "" : "border-t border-gray-300")} key={day.en}>
                <InputCheckbox
                  label={`Chaque ${day.fr}`}
                  checked={daysOfWeek?.[day.en]}
                  onCheckedChanged={({ checked }) => {
                    setDaysOfWeek({ ...daysOfWeek, [day.en]: checked });
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
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
