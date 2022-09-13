import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView, TouchableOpacity } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import { displayedCategories } from "../../../utils/constants";
import localStorage from "../../../utils/localStorage";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import { INDICATEURS, INDICATEURS_LISTE_PAR_CATEGORIE } from "../../../utils/liste_indicateurs";
import TextTag from "../../../components/TextTag";

const SymptomScreen = ({ navigation, route }) => {
  const [indicateursSelection, setIndicateursSelection] = useState({});
  const [displayAlert, setDisplayAlert] = useState(false);

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

  useEffect(() => {
    const total =
      Object.keys(indicateursSelection).filter((indicateur) => !!indicateursSelection[indicateur]).length ||
      0;
    setDisplayAlert(total > 10);
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
    navigation.navigate("onboarding-hint", { onboarding: true });
  };

  const restart = () => navigation.navigate("onboarding-symptoms-1", { onboarding: true });

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
          <Text style={styles.title}>Chaque jour, vous allez évaluer :</Text>
        </View>
        <View style={styles.indicateursContainer}>
          {Object.keys(INDICATEURS_LISTE_PAR_CATEGORIE)
            .filter((e) => e !== "Les plus courants")
            .filter((categorie) => {
              const list_indicateurs = INDICATEURS_LISTE_PAR_CATEGORIE[categorie];
              return Object.keys(indicateursSelection || {}).some(
                (indicateur) =>
                  indicateursSelection[indicateur] && list_indicateurs.some((e) => e === indicateur)
              );
            })
            .map((categorie) => {
              const indicateurs = INDICATEURS_LISTE_PAR_CATEGORIE[categorie];
              return (
                <View key={categorie}>
                  <Text style={styles.categorieTitre}>{categorie}</Text>
                  <View style={styles.indicateursSelectionContainer}>
                    {indicateurs
                      .filter((e) => indicateursSelection[e])
                      .map((indicateur) => (
                        <TextTag
                          key={indicateur}
                          value={INDICATEURS[indicateur] || displayedCategories[indicateur] || indicateur}
                          selected={false}
                          color="#D4F0F2"
                          onPress={() => {}}
                          enableClosed
                          onClose={() => setToggleIndicateur({ indicateur: indicateur, valeur: false })}
                        />
                      ))}
                  </View>
                </View>
              );
            })}
        </View>
        {displayAlert ? (
          <View style={styles.alertContainer}>
            <Text style={[styles.bold, styles.alertText, { marginBottom: 15 }]}>
              Vous suivez plus de 10 indicateurs
            </Text>
            <Text style={styles.alertText}>
              Essayez de ne sélectionner que <Text style={styles.bold}>les plus pertinents</Text>. Vous
              pourrez aussi modifier votre choix plus tard dans l’application
            </Text>
          </View>
        ) : null}
        <View style={stylesButton.buttonWrapper}>
          <Button title={`Cela me correspond`} onPress={nextOnboardingScreen} buttonStyle={{ minWidth: 0 }} />
          <TouchableOpacity style={stylesButton.button} onPress={restart}>
            <Text style={stylesButton.text}>Modifier mes indicateurs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1f2937",
  },
});

const styles = StyleSheet.create({
  categorieTitre: {
    marginBottom: 10,
    fontWeight: "600",
  },
  alertContainer: {
    backgroundColor: "#FEFFE4",
    borderColor: "#EDF053",
    borderWidth: 0.5,
    marginBottom: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
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
    marginBottom: 30,
  },
  indicateursContainer: {
    flex: 1,
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
  scrollContainer: { flexGrow: 1 },
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
    display: "flex",
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
