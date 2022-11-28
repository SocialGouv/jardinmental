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

export const OnboardingGoals = ({ navigation }) => {
  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_GOALS);
    })();
  }, []);

  const [symptomSelection, setSymptomSelection] = useState({});
  const countGoals = () =>
    INDICATEURS_GOALS_SIMPLE.reduce((acc, id) => {
      if (symptomSelection?.[id]) return acc + 1;
      return acc;
    }, 0);
  const [count, setCount] = useState(countGoals());
  useEffect(() => setCount(countGoals()), [symptomSelection]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const localStorageIndicateurs = (await localStorage.getSymptoms()) || {};

        setSymptomSelection(localStorageIndicateurs);
      })();
    }, [])
  );

  const handleNext = async () => {
    const symptoms = { ...symptomSelection };

    await localStorage.setSymptoms(symptoms);
    navigation.navigate(ONBOARDING_STEPS.STEP_REMINDER);
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
            symptomSelection={symptomSelection}
            setSymptomSelection={setSymptomSelection}
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
        <Button
          title={`Continuer avec ${count} objectif${count > 1 ? "s" : ""}`}
          onPress={handleNext}
          buttonStyle={{ minWidth: 0 }}
        />
      </StickyButtonContainer>
    </SafeAreaViewWithOptionalHeader>
  );
};
