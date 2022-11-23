import React, { useState, useCallback, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Switch, Text, Image } from "react-native";
import Button from "../../../components/Button";
import { onboardingStyles } from "../styles";
import localStorage from "../../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import {
  INDICATEURS_HUMEUR,
  INDICATEURS_LISTE_ONBOARDING_HUMEUR,
  INDICATEURS,
} from "../../../utils/liste_indicateurs";
import RoundButtonIcon from "../../../components/RoundButtonIcon";
import { colors } from "../../../utils/colors";
import { stylesA, styles, styleSwitch } from ".";
import { StickyButtonContainer } from "../StickyButton";
import { CheckBoxList } from "../CheckBoxList";
import { SafeAreaViewWithOptionalHeader } from "../ProgressHeader";
import { OnboardingBackButton } from "../BackButton";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";

export const OnboardingMood = ({ navigation }) => {
  const [symptomSelection, setSymptomSelection] = useState({});
  const [isMoodTroubleEnable, setIsMoodTroubleEnabled] = useState();

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const localStorageIndicateurs = (await localStorage.getSymptoms()) || {};

        // cocher par défaut si on a jamais enregistré notre choix
        if (!Object.keys(localStorageIndicateurs).includes(INDICATEURS_HUMEUR))
          localStorageIndicateurs[INDICATEURS_HUMEUR] = true;

        // deplier par defaut si au moins un des enfants est selectionné
        if (
          Object.keys(localStorageIndicateurs).some(
            (e) => INDICATEURS_LISTE_ONBOARDING_HUMEUR.includes(e) && localStorageIndicateurs[e]
          )
        ) {
          setIsMoodTroubleEnabled(true);
        }

        setSymptomSelection(localStorageIndicateurs);
      })();
    }, [])
  );

  useEffect(() => {
    const symptoms = { ...symptomSelection };
    if (!isMoodTroubleEnable && isMoodTroubleEnable !== undefined) {
      INDICATEURS_LISTE_ONBOARDING_HUMEUR.forEach((v) => (symptoms[v] = false));
      setSymptomSelection(symptoms);
    }
  }, [isMoodTroubleEnable]);

  const handleNext = async () => {
    const symptoms = { ...symptomSelection };
    if (!isMoodTroubleEnable) INDICATEURS_LISTE_ONBOARDING_HUMEUR.forEach((v) => (symptoms[v] = false));

    await localStorage.setSymptoms(symptoms);
    navigation.navigate(ONBOARDING_STEPS.STEP_SYMPTOMS_SLEEP);
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
              source={require("../../../../assets/imgs/onboarding/mood.png")}
              style={onboardingStyles.imageSize}
            />
          </View>
          <TouchableOpacity
            key="main-checkbox"
            style={[
              stylesA.choixContainer,
              symptomSelection[INDICATEURS_HUMEUR] ? stylesA.choixContainerSelected : null,
            ]}
            onPress={() =>
              setSymptomSelection((prev) => ({ ...prev, [INDICATEURS_HUMEUR]: !prev[INDICATEURS_HUMEUR] }))
            }
          >
            {symptomSelection[INDICATEURS_HUMEUR] ? (
              <View>
                <RoundButtonIcon
                  backgroundColor="#5DEE5A"
                  iconColor="#fff"
                  borderWidth={0.5}
                  borderColor="#5DEE5A"
                  icon="validate"
                  visible={true}
                  medium
                />
              </View>
            ) : (
              <View>
                <RoundButtonIcon
                  backgroundColor="#f4f4f4"
                  iconColor="#e1e1e1"
                  borderWidth={0.5}
                  borderColor="#e1e1e1"
                  icon="validate"
                  visible={true}
                  medium
                />
              </View>
            )}
            <Text style={stylesA.choixLabel}>{INDICATEURS[INDICATEURS_HUMEUR]}</Text>
          </TouchableOpacity>
          <View key="question">
            <Text style={styles.question}>
              Avez-vous un trouble spécifique qui fait varier votre humeur au cours de la journée ?
            </Text>
          </View>
          <View style={styleSwitch.container} key="secondary-switch">
            <Text style={styleSwitch.label}>Non</Text>
            <Switch
              onValueChange={() => {
                autoLayoutAnimation();
                setIsMoodTroubleEnabled(!isMoodTroubleEnable);
              }}
              value={isMoodTroubleEnable}
              trackColor={{ true: colors.LIGHT_BLUE }}
              thumbColor="#EFEFEF"
            />
            <Text style={styleSwitch.label}>Oui</Text>
          </View>
          {isMoodTroubleEnable && (
            <View key="secondary-details">
              <Text style={styles.description}>
                Renseignez les variations de votre humeur au cours de la journée avec :
              </Text>
              <CheckBoxList
                list={INDICATEURS_LISTE_ONBOARDING_HUMEUR}
                symptomSelection={symptomSelection}
                setSymptomSelection={setSymptomSelection}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button title="Suivant" onPress={handleNext} buttonStyle={{ minWidth: 0 }} />
      </StickyButtonContainer>
    </SafeAreaViewWithOptionalHeader>
  );
};
