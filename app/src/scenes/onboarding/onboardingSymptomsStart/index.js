import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView, Switch } from "react-native";

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
          <LabelCheckBox
            value={symptomSelection[INDICATEURS_HUMEUR]}
            onValueChange={(v) => setSymptomSelection((prev) => ({ ...prev, INDICATEURS_HUMEUR: v }))}
            label={INDICATEURS_HUMEUR}
          />
          <Text style={styles.question}>
            Avez-vous un trouble spécifique qui fait varier votre humeur au cours de la journée ?
          </Text>
          <Switch
            onValueChange={() => setIsMoodTroubleEnabled(!isMoodTroubleEnable)}
            value={isMoodTroubleEnable}
          />
          {isMoodTroubleEnable && (
            <View>
              <Text style={styles.description}>
                Suivre les variations de votre humeur au cours de la journée avec :
              </Text>
              <CheckBoxList
                list={INDICATEURS_LISTE_ONBOARDING_HUMEUR}
                selected={symptomSelection}
                setSelected={(id, value) => setSymptomSelection((prev) => ({ ...prev, [id]: value }))}
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

          <LabelCheckBox
            value={symptomSelection[INDICATEURS_SOMMEIL]}
            onValueChange={(v) => setSymptomSelection((prev) => ({ ...prev, INDICATEURS_SOMMEIL: v }))}
            label={INDICATEURS_SOMMEIL}
          />
          <Text style={styles.question}>
            Avez-vous un trouble du sommeil important qui nécessite un suivi ?
          </Text>
          <Switch
            onValueChange={() => setIsSleepTroubleEnabled(!isSleepTroubleEnable)}
            value={isSleepTroubleEnable}
          />
          {isSleepTroubleEnable && (
            <View>
              <Text style={styles.description}>Vous pouvez suivre plus en détails votre sommeil avec :</Text>
              <CheckBoxList
                list={INDICATEURS_LISTE_ONBOARDING_SOMMEIL}
                selected={symptomSelection}
                setSelected={(id, value) => setSymptomSelection((prev) => ({ ...prev, [id]: value }))}
              />
            </View>
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <Button onPress={handleNext} title="Suivant" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CheckBoxList = ({ list, selected, setSelected }) => {
  return (
    <>
      {list.map((id, index) => {
        return (
          <LabelCheckBox
            key={index}
            value={selected[id]}
            label={INDICATEURS[id]}
            onValueChange={(v) => setSelected(id, v)}
          />
        );
      })}
    </>
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
