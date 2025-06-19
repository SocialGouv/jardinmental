import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import SurveyMenu from "../../../../assets/svg/SurveyMenu";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import {
  INDICATEURS_LIST,
  INDICATEURS_LISTE_PAR_CATEGORIE,
} from "../../../utils/liste_indicateurs.1";
import TextTag from "../../../components/TextTag";
import CategorieElements from "./CategorieElements";
import OnboardingElements from "./OnboardingElements";
import AjoutIndicateurPerso from "./AjoutIndicateurPerso";
import { useFocusEffect } from "@react-navigation/native";

const SymptomScreen = ({ navigation, route }) => {
  const [indicateursSelection, setIndicateursSelection] = useState({});
  const [customSymptomsAdded, setCustomSymptomsAdded] = useState(0);

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const localStorageIndicateurs = await localStorage.getSymptoms();
        if (!localStorageIndicateurs || !Object.keys(localStorageIndicateurs).length) {
          return init();
        }
        setIndicateursSelection(localStorageIndicateurs);
      })();
    }, [])
  );
  useEffect(() => {
    console.log(indicateursSelection);
  }, [indicateursSelection]);

  const init = () => {
    let res = {};
    Object.keys(indicateursSelection).forEach((ind) => {
      res[ind] = false;
    });
    setIndicateursSelection(res);
  };

  const setToggleIndicateur = ({ indicateur, valeur }) => {
    setIndicateursSelection((prev) => ({ ...prev, [indicateur]: valeur }));
  };

  const getSelectionVide = () => !Object.keys(indicateursSelection).some((i) => indicateursSelection[i]);

  const nextOnboardingScreen = async () => {
    if (getSelectionVide()) {
      return;
    }
    await localStorage.setSymptoms(indicateursSelection);
    navigation.navigate("onboarding-symptoms-recap", { onboarding: true });
  };

  const handleAddNewSymptom = async (value) => {
    if (!value) return;
    await localStorage.addCustomSymptoms(value);
    setIndicateursSelection((prev) => ({ ...prev, [value]: true }));
    logEvents.logCustomSymptomAdd();
  };

  const countObjectifs = () =>
    (Object.keys(indicateursSelection)
      .filter((indicateur) => !!indicateursSelection[indicateur])
      .filter(
        (indicateur) =>
          INDICATEURS_LISTE_PAR_CATEGORIE["Se faire plaisir"].includes(indicateur) ||
          INDICATEURS_LISTE_PAR_CATEGORIE["Prendre soin de sa santé"].includes(indicateur) ||
          INDICATEURS_LISTE_PAR_CATEGORIE["Au quotidien"].includes(indicateur)
      ).length || 0) + customSymptomsAdded;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>On se fixe des objectifs quotidiens ?</Text>
        </View>
        <View style={styles.sousTitreContainer}>
          <Text style={styles.sousTitre}>
            Réaliser certaines activités peut vous faire du bien. Voici quelques exemples, et pouvez aussi
            créer vos propres objectifs.
          </Text>
        </View>
        <View style={styles.dividerS} />
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            Se fixer <Text style={styles.bold}>5</Text> objectifs <Text style={styles.bold}>maximum</Text> est
            un bon départ
          </Text>
        </View>
        <>
          {Object.keys(INDICATEURS_LISTE_PAR_CATEGORIE)
            .filter((categorie) =>
              ["Se faire plaisir", "Prendre soin de sa santé", "Au quotidien"].includes(categorie)
            )
            .map((categorie) => {
              const indicateurs = INDICATEURS_LISTE_PAR_CATEGORIE[categorie];
              return (
                <CategorieElements
                  key={categorie}
                  title={categorie}
                  options={indicateurs.map((e) => ({ id: e, label: INDICATEURS_LIST[e] }))}
                  onClick={({ id, value }) => setToggleIndicateur({ indicateur: id, valeur: value })}
                  indicateursSelection={indicateursSelection}
                  handleAddNewSymptom={(e) => {
                    handleAddNewSymptom(e);
                    setCustomSymptomsAdded((p) => p + 1);
                  }}
                  enableAddNewElement
                  labelAddSymptom="Créer un objectif personnalisé"
                />
              );
            })}
        </>
        {getSelectionVide() ? (
          <View style={styles.buttonWrapperError}>
            <Text style={[styles.alert, styles.spaceabove, styles.spacebottom]}>
              Ajouter ou sélectionner au moins 1 indicateur
            </Text>
          </View>
        ) : null}
      </ScrollView>
      <View style={stylesButton.buttonWrapper}>
        <Button
          title={`Continuer avec ${countObjectifs()} objectif${countObjectifs() > 1 ? "s" : ""}`}
          onPress={nextOnboardingScreen}
          disabled={getSelectionVide()}
          buttonStyle={{ minWidth: 0 }}
        />
      </View>
    </SafeAreaView>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    bottom: 20,
    paddingHorizontal: 20,
    left: 0,
    right: 0,
  },
  buttonSecondary: {
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderColor: "#bbb",
    borderWidth: 1,
  },
});

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: "#FEFFE4",
    borderColor: "#EDF053",
    borderWidth: 0.5,
    marginBottom: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  alertText: {
    display: "flex",
    flex: 1,
  },
  indicateursSelectionContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subtitle: {
    color: "#000",
    fontSize: 15,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 40,
    width: "50%",
    alignSelf: "center",
  },
  dividerS: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
    width: "50%",
    alignSelf: "center",
  },
  image: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },

  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 35,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  ValidationButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  bottom: {
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  checkbox: {
    marginHorizontal: 10,
    width: 25,
    height: 25,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  titleContainer: {
    marginBottom: 13,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  sousTitreContainer: {
    marginBottom: 0,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  titleTextContainer: {
    flex: 1,
    borderColor: "red",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: "700",
  },
  sousTitre: {
    paddingVertical: 5,
    textAlign: "left",
    flex: 1,
    color: colors.BLUE,
    fontSize: 15,
    fontWeight: "400",
  },
  bold: {
    fontWeight: "700",
  },
  medium: {
    fontWeight: "500",
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
  spacebottom: {
    marginBottom: 15,
  },
  alert: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  categories: {
    backgroundColor: "#F4FCFD",
    borderColor: "#D4F0F2",
    borderWidth: 0.5,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 17,
    fontWeight: "600",
  },
  labelAddSymptom: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  plusIcon: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "300",
    margin: -10,
    marginRight: 10,
  },
  addSymptom: {
    backgroundColor: colors.LIGHT_BLUE,
    color: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  backButtonContainer: {
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginTop: 20,
  },
  backButton: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  textInput: {
    fontSize: 20,
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  buttonWrapperError: {
    display: "flex",
    alignItems: "center",
  },
  okButtonText: {
    marginTop: 20,
    marginRight: 20,
    fontWeight: "bold",
    color: colors.BLUE,
  },
  lightblue: {
    color: colors.LIGHT_BLUE,
  },
});

export default SymptomScreen;
