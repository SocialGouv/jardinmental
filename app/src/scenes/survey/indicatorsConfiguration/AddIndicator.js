import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Keyboard } from "react-native";

import BackButton from "../../../components/BackButton";
import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import { categories, displayedCategories, reliquatCategories } from "../../../utils/constants";
import Button from "../../../components/Button";
import Text from "../../../components/MyText";
import Plus from "../../../../assets/svg/Plus";
import ArrowUpSvg from "../../../../assets/svg/arrow-up.svg";
import { INDICATEURS, INDICATEURS_LISTE_PAR_CATEGORIE } from "../../../utils/liste_indicateurs";
import { toggleState } from "../../../utils";
import ExistingIndicators from "./ExistingIndicators";
import IndicatorCategoryToggle from "./IndicatorCategoryToggle";
import DangerIcon from "../../../../assets/svg/DangerIcon";

const AddIndicator = ({ navigation, route }) => {
  const [chosenCategories, setChosenCategories] = useState();
  const [exemplesVisible, setExemplesVisible] = useState(false);
  const [existingIndicators, setExistingIndicators] = useState();
  const [existingIndicatorsVisible, setExistingIndicatorsVisible] = useState(false);
  const [currentExempleVisible, setCurrentExempleVisible] = useState(null);

  const toggleCurrentExempleVisible = (clicked) =>
    currentExempleVisible === clicked ? setCurrentExempleVisible(null) : setCurrentExempleVisible(clicked);

  const setToogleCheckbox = (cat, value) => {
    let res = { ...chosenCategories };
    res[cat] = value;
    setChosenCategories(res);
  };

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
      setExistingIndicators(Object.keys(selected).filter((cat) => !selected[cat]));
    })();
  }, []);

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

  const indicators = Object.keys(chosenCategories || {}).filter((e) => chosenCategories[e]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton style={styles.headerBackButton} onPress={navigation.goBack} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Ajouter un indicateur</Text>
        </View>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View style={styles.personnalizeContainer}>
          <View style={styles.personnalizeTextContainer}>
            <Text style={styles.personnalizeTitle}>Créez votre indicateur personnalisé</Text>
            <Text style={styles.personnalizeText}>
              Vous pouvez choisir la manière dont vous souhaitez l’évaluer
            </Text>
            <Button
              buttonStyle={{
                marginTop: 20,
                backgroundColor: "white",
                borderColor: "#26387C",
                borderWidth: 1,
              }}
              textStyle={{ color: "#26387C", textAlign: "center" }}
              onPress={() => {}}
              title="Créer un indicateur"
              Icon={<Plus style={styles.plusButton} opacity={1} color={"#000"} width={19} height={19} />}
            />
          </View>
        </View>

        {exemplesVisible && (
          <View style={styles.warningContainer}>
            <DangerIcon />
            <Text style={styles.warningText}>
              Essayez de ne pas sélectionner plus de <Text style={styles.bold}>8</Text> indicateurs{" "}
              <Text style={styles.bold}>au total</Text>
            </Text>
          </View>
        )}

        <View
          style={{
            height: 40,
          }}
        />
        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => toggleState(exemplesVisible, setExemplesVisible)}
          style={styles.toggleContainer}
        >
          <Text style={styles.bold}>Choisir parmi des exemples</Text>
          {exemplesVisible ? (
            <ArrowUpSvg color={colors.BLUE} />
          ) : (
            <ArrowUpSvg
              style={{
                transform: [{ rotateX: "180deg" }],
              }}
              color={colors.BLUE}
            />
          )}
        </TouchableOpacity>
        {exemplesVisible && (
          <>
            <IndicatorCategoryToggle
              exempleName={"Emotions/sentiments"}
              currentExempleVisible={currentExempleVisible}
              toggleCurrentExempleVisible={toggleCurrentExempleVisible}
              chosenCategories={chosenCategories}
              setChosenCategories={setChosenCategories}
              setToogleCheckbox={setToogleCheckbox}
            />
            <IndicatorCategoryToggle
              exempleName={"Manifestations physiques"}
              currentExempleVisible={currentExempleVisible}
              toggleCurrentExempleVisible={toggleCurrentExempleVisible}
              chosenCategories={chosenCategories}
              setChosenCategories={setChosenCategories}
              setToogleCheckbox={setToogleCheckbox}
            />
            <IndicatorCategoryToggle
              exempleName={"Pensées"}
              currentExempleVisible={currentExempleVisible}
              toggleCurrentExempleVisible={toggleCurrentExempleVisible}
              chosenCategories={chosenCategories}
              setChosenCategories={setChosenCategories}
              setToogleCheckbox={setToogleCheckbox}
            />
            <IndicatorCategoryToggle
              exempleName={"Comportements"}
              currentExempleVisible={currentExempleVisible}
              toggleCurrentExempleVisible={toggleCurrentExempleVisible}
              chosenCategories={chosenCategories}
              setChosenCategories={setChosenCategories}
              setToogleCheckbox={setToogleCheckbox}
            />
          </>
        )}

        <View
          style={{
            height: 15,
          }}
        />
        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => toggleState(existingIndicatorsVisible, setExistingIndicatorsVisible)}
          style={styles.toggleContainer}
        >
          <Text style={styles.bold}>Réactiver un ancien indicateur</Text>
          {existingIndicatorsVisible ? (
            <ArrowUpSvg color={colors.BLUE} />
          ) : (
            <ArrowUpSvg
              style={{
                transform: [{ rotateX: "180deg" }],
              }}
              color={colors.BLUE}
            />
          )}
        </TouchableOpacity>
        {existingIndicatorsVisible && (
          <>
            <View
              style={{
                height: 10,
              }}
            />
            <ExistingIndicators
              chosenCategories={chosenCategories}
              setChosenCategories={setChosenCategories}
              setToogleCheckbox={setToogleCheckbox}
              existingIndicatorsList={existingIndicators}
            />
          </>
        )}

        <View
          style={{
            height: 15,
          }}
        />
        <View style={styles.divider} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: "700",
  },
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
  plusButton: {
    marginRight: 10,
  },

  warningContainer: {
    backgroundColor: "rgba(254,170,90,0.1)",
    borderColor: "#FEAA5B",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingRight: 20,
    marginTop: 20,
  },
  warningText: {
    color: colors.BLUE,
    fontSize: 17,
    flex: 1,
    marginLeft: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 15,
    width: "100%",
    alignSelf: "center",
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingEnd: 5,
    marginBottom: 15,
    marginTop: 15,
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
export default AddIndicator;
