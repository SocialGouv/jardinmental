import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, View, ScrollView, Text, Image } from "react-native";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { onboardingStyles } from "../styles";
import localStorage from "../../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import { INDICATEURS_LISTE_ONBOARDING_CUSTOM_SIMPLE } from "../../../utils/liste_indicateurs";
import { StickyButtonContainer } from "../StickyButton";
import { CheckBoxList } from "../CheckBoxList";

export const OnboardingSimpleCustomSymptoms = ({ navigation }) => {
  const [symptomSelection, setSymptomSelection] = useState({});

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
    //navigation.navigate("onboarding-symptoms-sleep");
  };

  return (
    <SafeAreaView style={onboardingStyles.safe}>
      <View style={onboardingStyles.topContainer}>
        <BackButton onPress={navigation.goBack} />
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
            list={INDICATEURS_LISTE_ONBOARDING_CUSTOM_SIMPLE}
            symptomSelection={symptomSelection}
            setSymptomSelection={setSymptomSelection}
          />
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button title="Suivant" onPress={handleNext} buttonStyle={{ minWidth: 0 }} />
      </StickyButtonContainer>
    </SafeAreaView>
  );
};
