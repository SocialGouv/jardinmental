import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Text, Image } from "react-native";
import Button from "../../../components/Button";
import { onboardingStyles } from "../styles";
import localStorage from "../../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import { INDICATEURS_LISTE_ONBOARDING_CUSTOM_SIMPLE_LIST } from "../../../utils/liste_indicateurs.1";
import { StickyButtonContainer } from "../StickyButton";
import { CheckBoxList } from "../CheckBoxList";
import { OnboardingBackButton } from "../BackButton";
import { SafeAreaViewWithOptionalHeader } from "../ProgressHeader";
import { ONBOARDING_STEPS } from "../../../utils/constants";

export const OnboardingSimpleCustomSymptoms = ({ navigation }) => {
  const [symptomSelection, setSymptomSelection] = useState({});

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS_CUSTOM);
    })();
  }, []);

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
    navigation.navigate(ONBOARDING_STEPS.STEP_GOALS);
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
            <Text style={onboardingStyles.h1}>Que souhaitez-vous suivre ?</Text>
          </View>
          <View style={onboardingStyles.imageContainer} key="image">
            <Image
              source={require("../../../../assets/imgs/onboarding/custom-symptoms.png")}
              style={onboardingStyles.imageSize}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={onboardingStyles.h3}>Vous sentez-vous concerné(e) par :</Text>
          </View>
          <CheckBoxList
            list={INDICATEURS_LISTE_ONBOARDING_CUSTOM_SIMPLE_LIST}
            symptomSelection={symptomSelection}
            setSymptomSelection={setSymptomSelection}
          />
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button title="Suivant" onPress={handleNext} buttonStyle={{ minWidth: 0 }} />
      </StickyButtonContainer>
    </SafeAreaViewWithOptionalHeader>
  );
};
