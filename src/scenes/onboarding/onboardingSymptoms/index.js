import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, ScrollView, View, SafeAreaView } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import { displayedCategories } from "../../../utils/constants";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import SurveyMenu from "../../../../assets/svg/SurveyMenu";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import RoundButtonIcon from "../../../components/RoundButtonIcon";
import { INDICATEURS_LISTE_PAR_CATEGORIE } from "../../../utils/liste_indicateurs";
import TextTag from "../../../components/TextTag";
import AjoutIndicateurPerso from "./AjoutIndicateurPerso";

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
    navigation.navigate("onboarding-symptoms-custom");
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.titleContainer}>
          <SurveyMenu style={styles.image} width={30} height={30} />
          <Text style={styles.title}>Que souhaitez-vous suivre quotidiennement ?</Text>
        </View>
        {Object.keys(INDICATEURS_LISTE_PAR_CATEGORIE).map((categorie) => {
          const indicateurs = INDICATEURS_LISTE_PAR_CATEGORIE[categorie];
          return (
            <CategorieElements
              title={categorie}
              options={indicateurs.map((e) => ({ id: e, label: e }))}
              onClick={({ id, value }) => setToggleIndicateur({ indicateur: id, valeur: value })}
              indicateursSelection={indicateursSelection}
              handleAddNewSymptom={handleAddNewSymptom}
            />
          );
        })}
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Vous avez sélectionné&nbsp;:</Text>
        <View style={styles.indicateursSelectionContainer}>
          {Object.keys(indicateursSelection || {})
            .filter((e) => indicateursSelection[e])
            .map((e, i) => (
              <TextTag key={i} value={displayedCategories[e] || e} selected={false} color="#D4F0F2" />
            ))}
        </View>
        <View style={styles.buttonWrapper}>
          {getSelectionVide() ? (
            <Text style={[styles.alert, styles.spaceabove]}>Ajouter ou sélectionner au moins 1 élément</Text>
          ) : (
            <Text style={[styles.h3, styles.spaceabove]}>
              Vous pourrez modifier à tout moment ce que vous suivez via le menu "Réglages" de l'application
            </Text>
          )}
          <Button title="Suivant" onPress={nextOnboardingScreen} disabled={getSelectionVide()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CategorieElements = ({ title, options, onClick, indicateursSelection, handleAddNewSymptom }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [listeComplementaire, setListeComplementaire] = useState([]);
  return (
    <>
      <TouchableOpacity style={stylesA.categorieContainer} onPress={() => setIsOpen((e) => !e)}>
        <Text style={stylesA.categorieTitre}>{title}</Text>
        <View>
          <RoundButtonIcon
            icon="toggle"
            visible
            onPress={() => setIsOpen((e) => !e)}
            isToggled={isOpen}
            small
          />
        </View>
      </TouchableOpacity>
      {isOpen ? (
        <View style={stylesA.listeContainer}>
          {(options || []).concat(listeComplementaire).map((option) => {
            const indicateurSelectionne = indicateursSelection[option.id];
            return (
              <TouchableOpacity
                key={`${title}_${option.id}`}
                style={[
                  stylesA.choixContainer,
                  indicateurSelectionne ? stylesA.choixContainerSelected : null,
                ]}
                onPress={() => onClick({ id: option.id, value: !indicateurSelectionne })}
              >
                <Text style={stylesA.choixLabel}>{option.label}</Text>
                {indicateurSelectionne ? (
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
              </TouchableOpacity>
            );
          })}
          <AjoutIndicateurPerso
            onChange={(v) => {
              if (Object.keys(indicateursSelection).find((e) => e === v)) return;
              setListeComplementaire((prev) => [...prev, { id: v, label: v }]);
              handleAddNewSymptom(v);
            }}
          />
        </View>
      ) : null}
    </>
  );
};

const stylesA = StyleSheet.create({
  categorieContainer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#D4F0F2",
    borderWidth: 0.5,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44, // standard
  },
  categorieTitre: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
  choixContainer: {
    backgroundColor: "#fff",
    borderColor: "#dadada",
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44, // standard
  },
  choixContainerSelected: {
    backgroundColor: "#EFFDEF",
  },
  listeContainer: {
    marginBottom: 44,
  },
  choixLabel: {
    fontSize: 15,
    color: "#000",
    flex: 1,
  },
});

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
  title: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: "700",
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
