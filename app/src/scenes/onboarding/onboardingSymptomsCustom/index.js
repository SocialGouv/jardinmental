import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Keyboard } from "react-native";

import BackButton from "../../../components/BackButton";
import { colors } from "../../../utils/colors";
import SurveyMenu from "../../../../assets/svg/SurveyMenu";
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
import { INDICATEURS_LISTE_PAR_CATEGORIE, INDICATEURS } from "../../../utils/liste_indicateurs";
import HeartBubble from "../../../../assets/svg/HeartBubble";

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
        .concat(...Object.keys(INDICATEURS))
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton style={styles.headerBackButton} onPress={navigation.goBack} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Mon questionnaire</Text>
        </View>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View style={styles.personnalizeContainer}>
          <HeartBubble size={40} />
          <View style={styles.personnalizeTextContainer}>
            <Text style={styles.personnalizeTitle}>Personnaliser mon questionnaire</Text>
            <Text style={styles.personnalizeText}>
              Gérez vos indicateurs, ajoutez-en de nouveaux et choisissez la manière dont vous les évaluez !
            </Text>
          </View>
        </View>

        <View style={styles.sectionRowContainer}>
          <View>
            <Text style={styles.headerText}>Mes indicateurs</Text>
          </View>
          <View style={styles.circleNumber}>
            <Text style={styles.circleText}>{indicators.length}</Text>
          </View>
        </View>
        <View>
          {indicators.map((e, i) => (
            <View style={styles.indicatorItem} key={INDICATEURS[e] || displayedCategories[e] || e}>
              <Text>{INDICATEURS[e] || displayedCategories[e] || e}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* TODO: add navigation */}
      <View style={styles.bottomButtonsContainer}>
        <Button
          buttonStyle={{ backgroundColor: "#1FC6D5", marginBottom: 20 }}
          textStyle={{ color: "white", textAlign: "center" }}
          onPress={() => navigation.navigate("ADD_INDICATOR")}
          title="Ajouter un indicateur"
        />
        <Button
          buttonStyle={{ backgroundColor: "white", borderColor: "#26387C", borderWidth: 1 }}
          textStyle={{ color: "#26387C", textAlign: "center" }}
          onPress={() => {}}
          title="Modifier mon questionnaire"
        />
      </View>
    </SafeAreaView>
  );
};

const OldCriteria = ({ chosenCategories, addSymptom }) => {
  const [showOldCriteria, setShowOldCriteria] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.flexRow} onPress={() => setShowOldCriteria((prev) => !prev)}>
        <Text style={[styles.subtitle, styles.underline]}>Réactiver vos anciens indicateurs</Text>
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
                options={indicateurs.map((e) => ({ id: e, label: INDICATEURS[e] }))}
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
    backgroundColor: "#1FC6D5",
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

  //

  // divider: {
  //   height: 1,
  //   backgroundColor: "#E0E0E0",
  //   marginVertical: 10,
  //   width: "50%",
  //   alignSelf: "center",
  // },
  // safe: {
  //   flex: 1,
  //   backgroundColor: "white",
  // },

  // container: {
  //   paddingHorizontal: 20,
  //   backgroundColor: "white",
  // },
  // scrollContainer: {
  //   paddingBottom: 80,
  // },
  // titleContainer: {
  //   marginBottom: 13,
  //   display: "flex",
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // image: {
  //   color: colors.BLUE,
  //   height: 40,
  //   width: 40,
  //   marginVertical: 0,
  //   marginRight: 10,
  // },
  // title: {
  //   flex: 1,
  //   color: colors.BLUE,
  //   fontSize: 22,
  //   fontWeight: "400",
  //   textAlign: "center",
  // },
  // bold: {
  //   color: colors.BLUE,
  //   fontWeight: "700",
  // },
  // subtitle: {
  //   color: colors.BLUE,
  //   fontSize: 18,
  //   marginVertical: 30,
  //   fontWeight: "400",
  //   textAlign: "center",
  // },
  // underline: {
  //   textDecorationLine: "underline",
  // },
  // listContainer: {
  //   display: "flex",
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  // },
  // buttonWrapper: {
  //   display: "flex",
  //   justifyContent: "flex-end",
  //   alignItems: "center",
  //   padding: 15,
  // },
  // h3: {
  //   color: "#181818",
  //   fontSize: 14,
  //   marginBottom: 10,
  //   fontWeight: "300",
  //   textAlign: "center",
  // },
  // spaceabove: {
  //   marginTop: 15,
  // },
  // flexRow: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
});
export default CustomSymptomScreen;
