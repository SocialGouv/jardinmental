import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView, Switch, TouchableOpacity } from "react-native";

import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import LabelCheckBox from "./LabelCheckBox";
import {
  INDICATEURS_HUMEUR,
  INDICATEURS_SOMMEIL,
  INDICATEURS_LISTE_ONBOARDING_HUMEUR,
  INDICATEURS_LISTE_ONBOARDING_SOMMEIL,
  INDICATEURS,
} from "../../../utils/liste_indicateurs";
import RoundButtonIcon from "../../../components/RoundButtonIcon";

const OnboardingSymptomStart = ({ navigation }) => {
  const [symptomSelection, setSymptomSelection] = useState({});
  const [isMoodTroubleEnable, setIsMoodTroubleEnabled] = useState(false);
  const [isSleepTroubleEnable, setIsSleepTroubleEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const symptoms = (await await localStorage.getSymptoms()) || {};
      INDICATEURS_LISTE_ONBOARDING_HUMEUR.forEach((v) => (symptoms[v] = false));
      INDICATEURS_LISTE_ONBOARDING_SOMMEIL.forEach((v) => (symptoms[v] = false));
      if (!Object.keys(symptoms).includes(INDICATEURS_HUMEUR)) symptoms[INDICATEURS_HUMEUR] = true;
      if (!Object.keys(symptoms).includes(INDICATEURS_SOMMEIL)) symptoms[INDICATEURS_SOMMEIL] = true;

      setSymptomSelection(symptoms);
    })();
  }, []);

  useEffect(() => {
    const symptoms = { ...symptomSelection };
    if (!isMoodTroubleEnable) {
      INDICATEURS_LISTE_ONBOARDING_HUMEUR.forEach((v) => (symptoms[v] = false));
      setSymptomSelection(symptoms);
    }
    if (!isSleepTroubleEnable) {
      INDICATEURS_LISTE_ONBOARDING_SOMMEIL.forEach((v) => (symptoms[v] = false));
      setSymptomSelection(symptoms);
    }
  }, [isMoodTroubleEnable, isSleepTroubleEnable]);

  const handleNext = async () => {
    const symptoms = { ...symptomSelection };
    if (!isMoodTroubleEnable) INDICATEURS_LISTE_ONBOARDING_HUMEUR.forEach((v) => (symptoms[v] = false));
    if (!isSleepTroubleEnable) INDICATEURS_LISTE_ONBOARDING_SOMMEIL.forEach((v) => (symptoms[v] = false));

    await localStorage.setSymptoms(symptoms);
    navigation.navigate("onboarding-symptoms-1");
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
          <Text style={styles.title}>Commençons par deux indicateurs que je vous recommande</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.subtitle}>Votre humeur générale indique votre état de bien-être global</Text>
          <TouchableOpacity
            style={[
              stylesA.choixContainer,
              symptomSelection[INDICATEURS_HUMEUR] ? stylesA.choixContainerSelected : null,
            ]}
            onPress={() =>
              setSymptomSelection((prev) => ({ ...prev, [INDICATEURS_HUMEUR]: !prev[INDICATEURS_HUMEUR] }))
            }
          >
            {symptomSelection[INDICATEURS_HUMEUR] ? (
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
            <Text style={stylesA.choixLabel}>{INDICATEURS[INDICATEURS_HUMEUR]}</Text>
          </TouchableOpacity>
          <Text style={styles.question}>
            Avez-vous un trouble spécifique qui fait varier votre humeur au cours de la journée ?
          </Text>
          <View style={styleSwitch.container}>
            <Text style={styleSwitch.label}>Non</Text>
            <Switch
              onValueChange={() => setIsMoodTroubleEnabled(!isMoodTroubleEnable)}
              value={isMoodTroubleEnable}
            />
            <Text style={styleSwitch.label}>Oui</Text>
          </View>
          {isMoodTroubleEnable && (
            <View>
              <Text style={styles.description}>
                Renseignez les variations de votre humeur au cours de la journée avec :
              </Text>
              <CheckBoxList
                list={INDICATEURS_LISTE_ONBOARDING_HUMEUR}
                symptomSelection={symptomSelection}
                setSymptomSelection={setSymptomSelection}
              />
            </View>
          )}
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.subtitle}>
            Le sommeil influe fortement sur votre état de santé mentale et peut souvent expliquer ses
            variations
          </Text>
          <TouchableOpacity
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
          <Text style={styles.question}>
            Avez-vous un trouble du sommeil important qui nécessite un suivi ?
          </Text>
          <View style={styleSwitch.container}>
            <Text style={styleSwitch.label}>Non</Text>
            <Switch
              onValueChange={() => setIsSleepTroubleEnabled(!isSleepTroubleEnable)}
              value={isSleepTroubleEnable}
              trackColor={{ true: colors.LIGHT_BLUE }}
              thumbColor="#EFEFEF"
            />
            <Text style={styleSwitch.label}>Oui</Text>
          </View>
          {isSleepTroubleEnable && (
            <View>
              <Text style={styles.description}>Vous pouvez suivre plus en détails votre sommeil avec :</Text>
              <CheckBoxList
                list={INDICATEURS_LISTE_ONBOARDING_SOMMEIL}
                symptomSelection={symptomSelection}
                setSymptomSelection={setSymptomSelection}
              />
            </View>
          )}
        </View>
        <View style={stylesButton.buttonWrapper}>
          <Button title={`Suivant`} onPress={handleNext} buttonStyle={{ minWidth: 0 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CheckBoxList = ({ list, symptomSelection, setSymptomSelection }) => {
  return (
    <>
      {list.map((id) => {
        return (
          <TouchableOpacity
            key={id}
            style={[stylesA.choixContainer, symptomSelection[id] ? stylesA.choixContainerSelected : null]}
            onPress={() =>
              setSymptomSelection((prev) => ({
                ...prev,
                [id]: !prev[id],
              }))
            }
          >
            {symptomSelection[id] ? (
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
            <Text style={stylesA.choixLabel}>{id}</Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    marginTop: 50,
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

const styleSwitch = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: "#000",
    fontSize: 15,
    marginHorizontal: 5,
  },
});

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
    width: "50%",
    alignSelf: "center",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollContainer: {
    paddingBottom: 80,
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
  description: {
    paddingVertical: 15,
    textAlign: "left",
    flex: 1,
    color: colors.BLUE,
    fontSize: 15,
    fontWeight: "400",
  },
  subtitle: {
    paddingVertical: 15,
    textAlign: "left",
    flex: 1,
    color: colors.BLUE,
    fontSize: 15,
    fontWeight: "700",
  },
  question: {
    paddingVertical: 15,
    textAlign: "left",
    flex: 1,
    color: colors.BLUE,
    fontSize: 15,
    fontWeight: "400",
    fontStyle: "italic",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  buttonWrapper: {
    paddingTop: 20,
    display: "flex",
    alignItems: "center",
  },
});

export default OnboardingSymptomStart;
