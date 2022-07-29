import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView, Switch } from "react-native";


import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import LabelCheckBox from "./LabelCheckBox";
import { INDICATEURS } from "../../../utils/liste_indicateurs";

// MOVE TO liste_indicateur.js ??
const INDICATEURS_LIST_ONBOARDING_MOOD = [
  "Humeur matinale",
  "Humeur à la mi-journée",
  "Humeur au coucher"
];
const INDICATEURS_LIST_ONBOARDING_SLEEP = [
  "Durée sommeil",
  "Facilité endormissement",
  "Se coucher tôt"
];


const OnboardingSymptomStart = ({ navigation }) => {
  const [symptomSelection, setSymptomSelection] = useState({});
  const [isMoodTroubleEnable, setIsMoodTroubleEnabled] = useState(false);
  const [isSleepTroubleEnable, setIsSleepTroubleEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const symptoms = await await localStorage.getSymptoms() || {};
      INDICATEURS_LIST_ONBOARDING_MOOD.forEach((v) => { if (!Object.keys(symptoms).includes(v)) symptoms[v] = false; });
      INDICATEURS_LIST_ONBOARDING_SLEEP.forEach((v) => { if (!Object.keys(symptoms).includes(v)) symptoms[v] = false; });
      symptoms["Humeur générale"] = true;
      symptoms["Qualité générale du sommeil"] = true;

      setSymptomSelection(symptoms);
    })();
  }, []);

  const handleNext = async () => {
    const symptoms = { ...symptomSelection };
    if (!isMoodTroubleEnable) INDICATEURS_LIST_ONBOARDING_MOOD.forEach((v) => symptoms[v] = false);
    if (!isSleepTroubleEnable) INDICATEURS_LIST_ONBOARDING_SLEEP.forEach((v) => symptoms[v] = false);

    await localStorage.setSymptoms(symptoms);
    navigation.navigate("tabs");
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
        <View style={styles.titleContainer}>
          <Text style={styles.description}>Vous pouvez tout de même décider de ne pas les suivre en les décochant</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.subtitle}>Votre humeur générale indique votre état de bien-être global</Text>
          <LabelCheckBox
            value={symptomSelection["Humeur générale"]}
            onValueChange={(v) => setSymptomSelection((prev) => ({ ...prev, "Humeur générale": v }))}
            label="Humeur générale"
          />
          <Text style={styles.question}>Avez-vous un trouble spécifique qui fait varier votre humeur au cours de la journée ?</Text>
          <Switch
            onValueChange={() => setIsMoodTroubleEnabled(!isMoodTroubleEnable)}
            value={isMoodTroubleEnable}
          />
          {
            isMoodTroubleEnable && <View>
              <Text style={styles.description}>Vous pouvez suivre plus en détails les variations de votre humeur avec :</Text>
              <CheckBoxList
                list={INDICATEURS_LIST_ONBOARDING_MOOD}
                selected={symptomSelection}
                setSelected={(id, value) => setSymptomSelection((prev) => ({ ...prev, [id]: value }))}
              />
            </View>
          }
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.subtitle}>Votre humeur générale indique votre état de bien-être global</Text>

          <LabelCheckBox
            value={symptomSelection["Qualité générale du sommeil"]}
            onValueChange={(v) => setSymptomSelection((prev) => ({ ...prev, "Qualité générale du sommeil": v }))}
            label="Qualité générale du sommeil"
          />
          <Text style={styles.subtitle}>Avez-vous un trouble du sommeil important qui nécessite un suivi ?</Text>
          <Switch
            onValueChange={() => setIsSleepTroubleEnabled(!isSleepTroubleEnable)}
            value={isSleepTroubleEnable}
          />
          {
            isSleepTroubleEnable && <View>
              <Text style={styles.description}>Vous pouvez suivre plus en détails les variations de votre humeur avec :</Text>
              <CheckBoxList
                list={INDICATEURS_LIST_ONBOARDING_SLEEP}
                selected={symptomSelection}
                setSelected={(id, value) => setSymptomSelection((prev) => ({ ...prev, [id]: value }))}
              />
            </View>
          }
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
      {
        list.map((id, index) => {
          return <LabelCheckBox
            key={index}
            value={selected[id]}
            label={INDICATEURS[id]}
            onValueChange={(v) => setSelected(id, v)}
          />
        })
      }
    </>
  )
}



const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 40,
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
    textAlign: "center",
    flex: 1,
    color: colors.BLUE,
    fontSize: 15,
    fontWeight: "400"
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
    fontStyle: "italic"
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  }
});

export default OnboardingSymptomStart;
