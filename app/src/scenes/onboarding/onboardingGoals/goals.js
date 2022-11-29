import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Image } from "react-native";
import Text from "../../../components/MyText";
import Button from "../../../components/Button";
import { onboardingStyles } from "../styles";
import localStorage from "../../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import { INDICATEURS_GOALS_SIMPLE } from "../../../utils/liste_indicateurs";
import { StickyButtonContainer } from "../StickyButton";
import { CheckBoxList } from "../CheckBoxList";
import { SafeAreaViewWithOptionalHeader } from "../ProgressHeader";
import { OnboardingBackButton } from "../BackButton";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import { getGoalsTracked, setGoalTracked } from "../../../utils/localStorage/goals";
import { DAYS_OF_WEEK } from "../../../utils/date/daysOfWeek";
import { Button2 } from "../../../components/Button2";

export const OnboardingGoals = ({ navigation }) => {
  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_GOALS);
    })();
  }, []);

  const [goalSelection, setGoalSelection] = useState({});
  const countGoals = () =>
    INDICATEURS_GOALS_SIMPLE.reduce((acc, goalLabel) => {
      if (goalSelection?.[goalLabel]) return acc + 1;
      return acc;
    }, 0);
  const [count, setCount] = useState(countGoals());
  useEffect(() => setCount(countGoals()), [goalSelection]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const _goals = await getGoalsTracked();

        setGoalSelection(
          INDICATEURS_GOALS_SIMPLE.reduce((acc, goalLabel) => {
            if (_goals.find((goal) => goal.label === goalLabel)) acc[goalLabel] = true;
            return acc;
          }, {})
        );
      })();
    }, [])
  );

  const handleNext =
    ({ goToGoalsSettings }) =>
    async () => {
      for (const goalLabel of Object.keys(goalSelection)) {
        await setGoalTracked({
          label: goalLabel,
          enabled: goalSelection[goalLabel],
          daysOfWeek: DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day] = true;
            return acc;
          }, {}),
        });
      }
      if (goToGoalsSettings) navigation.navigate("goals-settings", { onboarding: true });
      else navigation.navigate(ONBOARDING_STEPS.STEP_REMINDER);
    };

  return (
    <SafeAreaViewWithOptionalHeader style={onboardingStyles.safe}>
      <View style={onboardingStyles.topContainer}>
        <OnboardingBackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={onboardingStyles.scroll}
        contentContainerStyle={onboardingStyles.scrollContentContainer}
      >
        <View style={onboardingStyles.container}>
          <View style={onboardingStyles.containerTopTitle} key="title">
            <Text style={onboardingStyles.h1}>Suivre un objectif ?</Text>
          </View>
          <View style={onboardingStyles.containerBottomText}>
            <Text style={onboardingStyles.presentationText}>
              Réaliser certaines activités peut vous faire du bien. Sélectionnez-en parmi les exemples ou
              créez les vôtres plus tard
            </Text>
          </View>
          <View style={onboardingStyles.imageContainer} key="image">
            <Image
              source={require("../../../../assets/imgs/onboarding/goals.png")}
              style={onboardingStyles.imageSize}
            />
          </View>
          <CheckBoxList
            list={INDICATEURS_GOALS_SIMPLE}
            symptomSelection={goalSelection}
            setSymptomSelection={setGoalSelection}
          />
        </View>
        <View style={onboardingStyles.alertContainer}>
          <Text style={onboardingStyles.alertText}>
            Se fixer <Text style={onboardingStyles.bold}>3</Text> objectifs{" "}
            <Text style={onboardingStyles.bold}>maximum</Text> est un bon départ
          </Text>
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button2
          fill
          title={`Continuer avec ${count} objectif${count > 1 ? "s" : ""}`}
          onPress={handleNext({ goToGoalsSettings: false })}
        />
        <Button2
          fill
          preset="onboarding2"
          title="Paramétrer les objectifs sélectionnés"
          onPress={handleNext({ goToGoalsSettings: true })}
          containerStyle={{ marginTop: 10 }}
        />
      </StickyButtonContainer>
    </SafeAreaViewWithOptionalHeader>
  );
};
