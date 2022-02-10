import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Keyboard } from "react-native";

import BackButton from "../../../components/BackButton";
import { colors } from "../../../utils/colors";
import SurveyMenu from "../../../../assets/svg/SurveyMenu";
import AddSymptom from "./AddSymptom";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import {
  ONBOARDING_STEPS,
  categories,
  displayedCategories,
  reliquatCategories,
} from "../../../utils/constants";
import TextTag from "../../../components/TextTag";
import Button from "../../../components/Button";
import Text from "../../../components/MyText";
import Icon from "../../../components/Icon";

const CustomSymptomScreen = ({ navigation, route, settings = false }) => {
  const [chosenCategories, setChosenCategories] = useState();

  useEffect(() => {
    (async () => {
      const preselectedCategories = await localStorage.getSymptoms();
      if (!Object.keys(preselectedCategories).length) {
        return;
      }

      const customSymptoms = await localStorage.getCustomSymptoms();
      let selected = {};
      Object.keys(categories)
        .concat(...Object.keys(reliquatCategories))
        .concat(customSymptoms)
        .forEach((cat) => {
          const [categoryName] = cat.split("_");
          // select it if we add it to the list (old and new version)
          // cat is the full name (SYMPTOM_FREQUENCE)
          // categoryName is the new format (SYMPTOM)
          selected[categoryName] = preselectedCategories[cat] || preselectedCategories[categoryName];
        });
      setChosenCategories(selected);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      !settings && (await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS_CUSTOM));
    })();
  }, [settings]);

  useEffect(() => {
    if (chosenCategories === undefined) return;
    (async () => {
      const customSymptomsKeys = Object.keys(chosenCategories).filter((e) => !displayedCategories[e]);
      const defaultSymptomsKeys = Object.keys(chosenCategories).filter((e) => !!displayedCategories[e]);

      let customSymptoms = {};
      customSymptomsKeys.forEach((e) => (customSymptoms[e] = chosenCategories[e]));
      await localStorage.setCustomSymptoms(customSymptomsKeys);

      let defaultSymptoms = {};
      defaultSymptomsKeys.forEach((e) => (defaultSymptoms[e] = chosenCategories[e]));
      await localStorage.setSymptoms(chosenCategories);
    })();
  }, [chosenCategories]);

  const addSymptom = async (value) => {
    if (!value) return;
    await localStorage.addCustomSymptoms(value);
    setChosenCategories({ ...chosenCategories, [value]: true });
    logEvents.logCustomSymptomAdd();
  };

  const removeSymptom = async (value) => setChosenCategories({ ...chosenCategories, [value]: false });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View style={styles.titleContainer}>
          <SurveyMenu style={styles.image} width={30} height={30} />
          <Text style={styles.title}>
            Ajoutez vos <Text style={styles.bold}>propres items</Text> à votre suivi quotidien
          </Text>
        </View>
        <AddSymptom
          onChange={addSymptom}
          placeholder="Ajoutez un ressenti, une activité, un comportement, etc..."
        />
        <Text style={styles.subtitle}>Vous suivez actuellement :</Text>
        <View style={styles.listContainer}>
          {Object.keys(chosenCategories || {})
            .filter((e) => chosenCategories[e])
            .map((e, i) => (
              <TextTag
                key={i}
                value={displayedCategories[e] || e}
                selected={false}
                color="#D4F0F2"
                onPress={() => {}}
                enableClosed
                onClose={() => removeSymptom(e)}
              />
            ))}
        </View>

        {settings ? <OldCriteria chosenCategories={chosenCategories} addSymptom={addSymptom} /> : null}
        {!settings && (
          <View style={styles.buttonWrapper}>
            <Text style={[styles.h3, styles.spaceabove]}>
              Vous pourrez modifier à tout moment ce que vous suivez via le menu "Réglages" de l'application
            </Text>
            <Button title="Valider" onPress={() => navigation.navigate("onboarding-drugs")} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const OldCriteria = ({ chosenCategories, addSymptom }) => {
  const [showOldCriteria, setShowOldCriteria] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.flexRow} onPress={() => setShowOldCriteria((prev) => !prev)}>
        <Text style={styles.subtitle}>Réactiver les anciens critères</Text>
        {showOldCriteria ? (
          <Icon icon="ChevronUpSvg" width={20} height={20} color={colors.BLUE} />
        ) : (
          <Icon icon="ChevronDownSvg" width={20} height={20} color={colors.BLUE} />
        )}
      </TouchableOpacity>
      {showOldCriteria && (
        <View style={styles.listContainer}>
          {Object.keys(chosenCategories || {})
            .filter((e) => !chosenCategories[e])
            .map((e, i) => (
              <TextTag
                key={i}
                value={displayedCategories[e] || e}
                selected={false}
                color="#D4F0F2"
                onPress={() => addSymptom(e)}
                enableAdd
                onAdd={() => addSymptom(e)}
              />
            ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  titleContainer: {
    marginBottom: 13,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },
  title: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: "400",
  },
  bold: {
    fontWeight: "700",
  },
  subtitle: {
    color: colors.BLUE,
    fontSize: 18,
    marginVertical: 30,
    fontWeight: "400",
    textAlign: "center",
  },
  listContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
  },
  h3: {
    color: "#181818",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "300",
    textAlign: "center",
  },
  spaceabove: {
    marginTop: 15,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default CustomSymptomScreen;
