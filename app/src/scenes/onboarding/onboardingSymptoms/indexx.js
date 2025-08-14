import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import { displayedCategories } from "../../../utils/constants";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import SurveyMenu from "../../../../assets/svg/SurveyMenu";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import { INDICATEURS_LISTE_ONBOARDING, INDICATEURS_LIST } from "../../../utils/liste_indicateurs.1";
import TextTag from "../../../components/TextTag";
import CategorieElements from "./CategorieElements";
import OnboardingElements from "./OnboardingElements";

const SymptomScreen = ({ navigation, route }) => {
  const [indicateursSelection, setIndicateursSelection] = useState({});

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const localStorageIndicateurs = await localStorage.getSymptoms();
      if (!localStorageIndicateurs || !Object.keys(localStorageIndicateurs).length) {
        return init();
      }
      setIndicateursSelection(localStorageIndicateurs);
    })();
  }, []);

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
    navigation.navigate("onboarding-hint", { onboarding: true });
  };

  const handleAddNewSymptom = async (value) => {
    if (!value) return;
    await localStorage.addCustomSymptoms(value);
    setIndicateursSelection((prev) => ({ ...prev, [value]: true }));
    logEvents.logCustomSymptomAdd();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <SurveyMenu style={styles.image} width={30} height={30} />
          <Text style={styles.title}>Que voulez-vous suivre dans votre questionnaire quotidien ?</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.sousTitre}>
            Choisissez ou <Text style={[styles.sousTitre, styles.bold]}>créez vous-même</Text> les indicateurs qui vous semblent{" "}
            <Text style={[styles.sousTitre, styles.bold]}>pertinents</Text> pour évaluer votre état de santé mentale et ce qui influe dessus
          </Text>
        </View>
        <OnboardingElements
          key={"test"}
          title={"test"}
          options={INDICATEURS_LISTE_ONBOARDING.map((e) => ({ id: e, label: INDICATEURS_LIST[e] }))}
          onClick={({ id, value }) => setToggleIndicateur({ indicateur: id, valeur: value })}
          indicateursSelection={indicateursSelection}
          handleAddNewSymptom={handleAddNewSymptom}
          enableAddNewElement
        />
        {!getSelectionVide() ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>Vous avez sélectionné&nbsp;:</Text>
            <View style={styles.indicateursSelectionContainer}>
              {Object.keys(indicateursSelection || {})
                .filter((e) => indicateursSelection[e])
                .map((e, i) => (
                  <TextTag
                    key={i}
                    value={INDICATEURS_LIST[e] || displayedCategories[e] || e}
                    selected={false}
                    color="#D4F0F2"
                    onPress={() => {}}
                    enableClosed
                    onClose={() => setToggleIndicateur({ indicateur: e, valeur: false })}
                  />
                ))}
            </View>
          </>
        ) : null}
        {getSelectionVide() ? (
          <View style={styles.buttonWrapperError}>
            <Text style={[styles.alert, styles.spaceabove, styles.spacebottom]}>Ajouter ou sélectionner au moins 1 indicateur</Text>
          </View>
        ) : (
          <Text style={[styles.h3, styles.spaceabove, styles.spacebottom]}>
            Sélectionnez <Text style={[styles.h3, styles.spaceabove, styles.medium]}>moins de 10 indicateurs</Text> pour conserver un questionnaire
            rapide à remplir. Vous pourrez le faire évoluer à tout moment dans les{" "}
            <Text style={[styles.h3, styles.spaceabove, styles.medium]}>paramètres</Text> de l’application, où vous trouverez encore plus d’exemples !
          </Text>
        )}
        <View style={styles.buttonWrapper}>
          <Button title="Suivant" onPress={nextOnboardingScreen} disabled={getSelectionVide()} buttonStyle={{ minWidth: 0 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 15,
    textAlign: "center",
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
