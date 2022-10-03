import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Text,
  Image,
  LayoutAnimation,
} from "react-native";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { onboardingStyles } from "../styles";
import localStorage from "../../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import {
  INDICATEURS_SOMMEIL,
  INDICATEURS_LISTE_ONBOARDING_SOMMEIL,
  INDICATEURS,
} from "../../../utils/liste_indicateurs";
import RoundButtonIcon from "../../../components/RoundButtonIcon";
import { colors } from "../../../utils/colors";
import { stylesA, styles, styleSwitch } from ".";
import { StickyButtonContainer } from "../StickyButton";
import { CheckBoxList } from "../CheckBoxList";

export const OnboardingSleep = ({ navigation }) => {
  const [symptomSelection, setSymptomSelection] = useState({});
  const [isSleepTroubleEnable, setIsSleepTroubleEnabled] = useState();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const localStorageIndicateurs = (await localStorage.getSymptoms()) || {};

        // cocher par défaut si on a jamais enregistré notre choix
        if (!Object.keys(localStorageIndicateurs).includes(INDICATEURS_SOMMEIL))
          localStorageIndicateurs[INDICATEURS_SOMMEIL] = true;

        // deplier par defaut si au moins un des enfants est selectionné
        if (
          Object.keys(localStorageIndicateurs).some(
            (e) => INDICATEURS_LISTE_ONBOARDING_SOMMEIL.includes(e) && localStorageIndicateurs[e]
          )
        ) {
          setIsSleepTroubleEnabled(true);
        }

        setSymptomSelection(localStorageIndicateurs);
      })();
    }, [])
  );

  useEffect(() => {
    const symptoms = { ...symptomSelection };
    if (!isSleepTroubleEnable && isSleepTroubleEnable !== undefined) {
      INDICATEURS_LISTE_ONBOARDING_SOMMEIL.forEach((v) => (symptoms[v] = false));
      setSymptomSelection(symptoms);
    }
  }, [isSleepTroubleEnable]);

  const handleNext = async () => {
    const symptoms = { ...symptomSelection };
    if (!isSleepTroubleEnable) INDICATEURS_LISTE_ONBOARDING_SOMMEIL.forEach((v) => (symptoms[v] = false));

    await localStorage.setSymptoms(symptoms);
    navigation.navigate("onboarding-symptoms-custom-simple");
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
              source={require("../../../../assets/imgs/onboarding/sleep.png")}
              style={onboardingStyles.imageSize}
            />
          </View>
          <TouchableOpacity
            key="main-checkbox"
            style={[
              stylesA.choixContainer,
              symptomSelection[INDICATEURS_SOMMEIL] ? stylesA.choixContainerSelected : null,
            ]}
            onPress={() =>
              setSymptomSelection((prev) => ({ ...prev, [INDICATEURS_SOMMEIL]: !prev[INDICATEURS_SOMMEIL] }))
            }
          >
            {symptomSelection[INDICATEURS_SOMMEIL] ? (
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
            <Text style={stylesA.choixLabel}>{INDICATEURS[INDICATEURS_SOMMEIL]}</Text>
          </TouchableOpacity>
          <View key="question">
            <Text style={styles.question}>
              Avez-vous un trouble du sommeil important qui nécessite un suivi ?
            </Text>
          </View>
          <View style={styleSwitch.container} key="secondary-switch">
            <Text style={styleSwitch.label}>Non</Text>
            <Switch
              onValueChange={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsSleepTroubleEnabled(!isSleepTroubleEnable);
              }}
              value={isSleepTroubleEnable}
              trackColor={{ true: colors.LIGHT_BLUE }}
              thumbColor="#EFEFEF"
            />
            <Text style={styleSwitch.label}>Oui</Text>
          </View>
          {isSleepTroubleEnable && (
            <View key="secondary-details">
              <Text style={styles.description}>Vous pouvez suivre plus en détails votre sommeil avec :</Text>
              <CheckBoxList
                list={INDICATEURS_LISTE_ONBOARDING_SOMMEIL}
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
    </SafeAreaView>
  );
};
