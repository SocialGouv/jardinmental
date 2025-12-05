import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { colors } from "../../utils/colors";
import localStorage from "../../utils/localStorage";
import logEvents from "../../services/logEvents";
import { ONBOARDING_STEPS, categories, displayedCategories, reliquatCategories } from "../../utils/constants";
import { useFocusEffect } from "@react-navigation/native";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Indicator } from "@/entities/Indicator";
import { INDICATEURS } from "@/utils/liste_indicateurs.1";

const CustomSymptomScreen = ({ navigation, route, settings = false }) => {
  const [chosenCategories, setChosenCategories] = useState();
  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, [])
  );

  useEffect(() => {
    (async () => {
      !settings && (await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS_CUSTOM));
    })();
  }, [settings]);

  useEffect(() => {
    if (!chosenCategories || chosenCategories === undefined) return;
    (async () => {
      const isCustom = (e) => !displayedCategories[e] && !Object.keys(INDICATEURS).includes(e);
      const isDefault = (e) => !!displayedCategories[e] || Object.keys(INDICATEURS).includes(e);

      const customSymptomsKeys = Object.keys(chosenCategories).filter(isCustom);
      const defaultSymptomsKeys = Object.keys(chosenCategories).filter(isDefault);

      let customSymptoms = {};
      customSymptomsKeys.forEach((e) => (customSymptoms[e] = chosenCategories[e]));
      await localStorage.setCustomSymptoms(customSymptomsKeys);

      let defaultSymptoms = {};
      defaultSymptomsKeys.forEach((e) => (defaultSymptoms[e] = chosenCategories[e]));
      await localStorage.setSymptoms(chosenCategories);
    })();
  }, [chosenCategories]);

  const handleAddNewSymptom = async (value) => {
    if (!value) return;
    await localStorage.addCustomSymptoms(value);
    setChosenCategories((prev) => ({ ...prev, [value]: true }));
    logEvents.logCustomSymptomAdd();
  };

  const setToggleIndicateur = ({ indicateur, valeur }) => {
    setChosenCategories((prev) => ({ ...prev, [indicateur]: valeur }));
  };

  const removeSymptom = async (value) => setChosenCategories({ ...chosenCategories, [value]: false });

  const indicators = Object.keys(chosenCategories || {}).filter((e) => chosenCategories[e]);

  return (
    <AnimatedHeaderScrollScreen
      handlePrevious={() => {
        navigation.goBack();
      }}
      title="Mon suivi"
      smallHeader={true}
      navigation={navigation}
      headerRightComponent={null}
      headerRightAction={() => {}}
      bottomComponent={
        <NavigationButtons absolute={true}>
          <>
            <JMButton
              variant="outline"
              className="mb-2"
              size="medium"
              onPress={() => {
                logEvents.logStartAddIndicator();
                navigation.navigate("EDIT_INDICATOR");
              }}
              title="Ajouter un indicateur"
            />
            <JMButton
              variant="primary"
              onPress={() => {
                logEvents.logEditSurvey();
                navigation.navigate("indicators-settings-more");
              }}
              title="Modifier mon questionnaire"
            />
          </>
        </NavigationButtons>
      }
    >
      <View className="px-4 mt-6">
        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>Personnaliser mon suivi</Text>
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 mt-3")}>
          Gérez vos éléments de suivi, ajoutez-en de nouveaux et choisissez la manière dont vous les évaluez
        </Text>
        <View className="my-6 mt-8 flex-row items-center">
          <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900")}>Mes indicateurs</Text>
          <View className="bg-cnam-cyan-500-0 h-7 w-7 rounded-full items-center justify-center ml-2">
            <Text className={mergeClassNames("text-white", typography.textMdSemibold)}>
              {userIndicateurs.filter((_indicateur) => _indicateur.active).length}
            </Text>
          </View>
        </View>
        <View>
          {userIndicateurs
            .filter((_indicateur) => _indicateur.active)
            .map((_indicateur) => {
              return (
                <View key={_indicateur.uuid || _indicateur.name} className="p-4 bg-gray-100 mb-2 rounded-xl">
                  <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-950")}>{_indicateur.name}</Text>
                </View>
              );
            })}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  headerText: {
    color: colors.BLUE,
    fontSize: 19,
    fontWeight: "700",
  },
  header: {
    height: 60,
  },
  headerBackButton: {
    position: "absolute",
    zIndex: 1,
  },
  headerTextContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  personnalizeContainer: {
    backgroundColor: "rgba(31,198,213,0.2)",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 0.5,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingRight: 20,
  },
  personnalizeTextContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  personnalizeTitle: {
    color: colors.BLUE,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    marginBottom: 5,
  },
  personnalizeText: {
    color: colors.BLUE,
    fontSize: 14,
    flex: 1,
  },

  sectionRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 30,
  },
  circleNumber: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 999,
    width: 35,
    height: 35,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  indicatorItem: {
    width: "100%",
    backgroundColor: "#F8F9FB",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    padding: 20,
    marginBottom: 12,
  },

  bottomButtonsContainer: {
    backgroundColor: "#fff",
    padding: 20,
  },
});
export default CustomSymptomScreen;
