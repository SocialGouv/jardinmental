import React, { useCallback, useState } from "react";
import { Card } from "../../../components/Card";
import { Collapsable } from "../../../components/Collapsable";
import { GOALS_EXAMPLE } from "../../../utils/goalsConstants";
import { InputCheckbox } from "../../../components/InputCheckbox";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsTracked, setGoalTracked } from "../../../utils/localStorage/goals";
import { GoalAddCheckable } from "./GoalAddCheckable";
import { DAYS_OF_WEEK } from "../../../utils/date/daysOfWeek";
import JMButton from "@/components/JMButton";
import Plus from "../../../../assets/svg/Plus";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { View, Alert, Linking } from "react-native";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import logEvents from "@/services/logEvents";
import NotificationService from "@/services/notifications";

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
          const isEnabled = GOALS_EXAMPLE_FLAT.find((exampleGoalLabel) => goal.label === exampleGoalLabel) !== null;
          if (isEnabled)
            _enabledExampleGoals = {
              ..._enabledExampleGoals,
              [goal.label]: isEnabled,
            };
        }
        setEnabledExampleGoals(_enabledExampleGoals);
        logEvents.logStartAddObjective();
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

  const showPermissionsAlert = () => {
    Alert.alert(
      "Vous devez autoriser les notifications",
      "Certain de vos objectifs on un rappel programmé. Il faut activer les notifications pour programmer un rappel. Veuillez cliquer sur Réglages puis Notifications pour activer les notifications.",
      [
        {
          text: "Réglages",
          onPress: () => {
            Linking.openSettings();
          },
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const onValidate = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Vérifier les permissions pour les notifications si des objectifs sont activés
      const goalLabels = Object.keys(goalsToChange);
      const hasEnabledGoals = goalLabels.some((label) => goalsToChange[label].enabled);

      if (hasEnabledGoals) {
        const isRegistered = await NotificationService.checkAndAskForPermission();
        if (!isRegistered) {
          showPermissionsAlert();
          // Continue quand même avec la sauvegarde, mais les rappels ne seront pas actifs
        }
      }

      let hasApiError = false;

      for (const goalLabel of goalLabels) {
        const goalToChange = goalsToChange[goalLabel];

        try {
          if (goalToChange.type === "disabled") {
            const result = await setGoalTracked({
              label: goalLabel,
              enabled: goalToChange.enabled,
            });
            if (result?.apiError) hasApiError = true;
          } else if (goalToChange.type === "example") {
            const result = await setGoalTracked({
              label: goalLabel,
              enabled: goalToChange.enabled,
              daysOfWeek: DAYS_OF_WEEK.reduce((acc, day) => {
                acc[day] = true;
                return acc;
              }, {}),
            });
            if (result?.apiError) hasApiError = true;
            logEvents.logAddObjectiveNative();
          }
        } catch (goalError) {
          // Log l'erreur pour ce goal spécifique, mais continue avec les autres
          console.error(`Erreur lors de la sauvegarde de l'objectif "${goalLabel}":`, goalError);
          hasApiError = true;
        }
      }

      // Feedback utilisateur approprié
      if (hasApiError) {
        Alert.alert("Objectifs sauvegardés", "Vos objectifs ont été sauvegardés, mais le rappel n'a pas pu être créé.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
      navigation.goBack();
    } catch (error) {
      // Erreur critique (ex: problème de stockage)
      console.error("Erreur critique lors de la validation des objectifs:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde de vos objectifs. Veuillez réessayer.", [{ text: "OK" }]);
    } finally {
      // Toujours désactiver le loading, même en cas d'erreur
      setLoading(false);
    }
  };

  return (
    <AnimatedHeaderScrollScreen
      title="Ajouter un objectif"
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      bottomComponent={
        <NavigationButtons absolute={true}>
          <JMButton disabled={!isChanged} title="Valider" onPress={() => onValidate()} className="mt-2" />
        </NavigationButtons>
      }
      navigation={navigation}
    >
      <Card
        className={"m-4"}
        title="Créez votre objectif personnalisé"
        text="Définissez votre objectif et planifiez le sur les jours de la semaine que vous souhaitez"
      >
        <JMButton
          variant="outline"
          title="Créer un objectif"
          icon={<Plus opacity={1} color={"#000"} width={19} height={19} />}
          onPress={() => navigation.navigate("goals-create-form")}
        />
      </Card>
      <View className="px-4">
        <Collapsable preset="primary" title="Choisir un objectif parmi des exemples" containerStyle={{ marginTop: 24 }}>
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
      </View>
    </AnimatedHeaderScrollScreen>
  );
};
