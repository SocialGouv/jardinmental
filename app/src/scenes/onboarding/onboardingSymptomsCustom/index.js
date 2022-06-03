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
import AjoutIndicateurPerso from "../onboardingSymptoms/AjoutIndicateurPerso";
import CategorieElements from "../onboardingSymptoms/CategorieElements";
import { INDICATEURS_LISTE_PAR_CATEGORIE, INDICATEURS_LISTE } from "../../../utils/liste_indicateurs";

const CustomSymptomScreen = ({ navigation, route, settings = false }) => {
  const [chosenCategories, setChosenCategories] = useState();

  useEffect(() => {
    (async () => {
      const preselectedCategories = await localStorage.getSymptoms();
      if (!preselectedCategories || !Object.keys(preselectedCategories).length) {
        return;
      }

      const customSymptoms = await localStorage.getCustomSymptoms();
      let selected = {};
      Object.keys(categories)
        .concat(...Object.keys(reliquatCategories))
        .concat(customSymptoms)
        .concat(INDICATEURS_LISTE)
        .forEach((cat) => {
          const [categoryName] = cat.split("_");
          // select it if we add it to the list (old and new version)
          // cat is the full name (SYMPTOM_FREQUENCE)
          // categoryName is the new format (SYMPTOM)
          if (
            Object.keys(preselectedCategories).includes(cat) ||
            Object.keys(preselectedCategories).includes(categoryName)
          ) {
            selected[categoryName] = preselectedCategories[cat] || preselectedCategories[categoryName];
          }
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
    if (!chosenCategories || chosenCategories === undefined) return;
    (async () => {
      const isCustom = (e) => !displayedCategories[e] && !INDICATEURS_LISTE.includes(e);
      const isDefault = (e) => !!displayedCategories[e] || INDICATEURS_LISTE.includes(e);

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
            <Text style={styles.bold}>Personnalisez votre questionnaire</Text> en ajoutant vos{" "}
            <Text style={styles.bold}>propres éléments</Text>
          </Text>
        </View>
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
        <AjoutIndicateurPerso
          onChange={(v) => {
            if (Object.keys(chosenCategories || {}).find((e) => e === v)) return;
            handleAddNewSymptom(v);
          }}
        />
        <View style={styles.divider} />
        {settings ? (
          <>
            <Exemples
              chosenCategories={chosenCategories}
              addSymptom={handleAddNewSymptom}
              setToggleIndicateur={setToggleIndicateur}
              enableAddNewElement={false}
            />
            <View style={styles.divider} />
            <OldCriteria chosenCategories={chosenCategories} addSymptom={handleAddNewSymptom} />
          </>
        ) : null}
        {!settings && (
          <View style={styles.buttonWrapper}>
            <Text style={[styles.h3, styles.spaceabove]}>
              Vous pourrez modifier à tout moment ce que vous suivez via le menu "Réglages" de l'application
            </Text>
            <Button title="Valider" onPress={() => navigation.navigate("reminder", { onboarding: true })} />
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
        <Text style={[styles.subtitle, styles.underline]}>Réactiver vos anciens éléments</Text>
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

const Exemples = ({ chosenCategories, addSymptom, setToggleIndicateur }) => {
  const [showOldCriteria, setShowOldCriteria] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.flexRow} onPress={() => setShowOldCriteria((prev) => !prev)}>
        <Text style={[styles.subtitle, styles.underline]}>Choisir parmi des exemples</Text>
        {showOldCriteria ? (
          <Icon icon="ChevronUpSvg" width={20} height={20} color={colors.BLUE} />
        ) : (
          <Icon icon="ChevronDownSvg" width={20} height={20} color={colors.BLUE} />
        )}
      </TouchableOpacity>
      {showOldCriteria && (
        <>
          {Object.keys(INDICATEURS_LISTE_PAR_CATEGORIE).map((categorie) => {
            const indicateurs = INDICATEURS_LISTE_PAR_CATEGORIE[categorie];
            return (
              <CategorieElements
                key={categorie}
                title={categorie}
                options={indicateurs.map((e) => ({ id: e, label: e }))}
                onClick={({ id, value }) => setToggleIndicateur({ indicateur: id, valeur: value })}
                indicateursSelection={chosenCategories}
                handleAddNewSymptom={addSymptom}
              />
            );
          })}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
    width: "50%",
    alignSelf: "center",
  },
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
    textAlign: "center",
  },
  bold: {
    color: colors.BLUE,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.BLUE,
    fontSize: 18,
    marginVertical: 30,
    fontWeight: "400",
    textAlign: "center",
  },
  underline: {
    textDecorationLine: "underline",
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
