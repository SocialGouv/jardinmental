import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView, Switch, TouchableOpacity } from "react-native";

import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import {
  OLD_INDICATEURS_HUMEUR,
  OLD_INDICATEURS_SOMMEIL,
  OLD_INDICATEURS_LISTE_ONBOARDING_HUMEUR,
  OLD_INDICATEURS_LISTE_ONBOARDING_SOMMEIL,
  INDICATEURS_LIST,
} from "../../../utils/liste_indicateurs.1";
import RoundButtonIcon from "../../../components/RoundButtonIcon";
import { useFocusEffect } from "@react-navigation/native";
import { TW_COLORS } from "@/utils/constants";

const OnboardingSymptomStart = ({ navigation }) => {
  const [symptomSelection, setSymptomSelection] = useState({});
  const [isMoodTroubleEnable, setIsMoodTroubleEnabled] = useState();
  const [isSleepTroubleEnable, setIsSleepTroubleEnabled] = useState();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const localStorageIndicateurs = (await localStorage.getSymptoms()) || {};

        // cocher par défaut si on a jamais enregistré notre choix
        if (!Object.keys(localStorageIndicateurs).includes(OLD_INDICATEURS_HUMEUR))
          localStorageIndicateurs[OLD_INDICATEURS_HUMEUR] = true;
        if (!Object.keys(localStorageIndicateurs).includes(OLD_INDICATEURS_SOMMEIL))
          localStorageIndicateurs[OLD_INDICATEURS_SOMMEIL] = true;

        // deplier par defaut si au moins un des enfants est selectionné
        if (
          Object.keys(localStorageIndicateurs).some(
            (e) => OLD_INDICATEURS_LISTE_ONBOARDING_HUMEUR.includes(e) && localStorageIndicateurs[e]
          )
        ) {
          setIsMoodTroubleEnabled(true);
        }
        if (
          Object.keys(localStorageIndicateurs).some(
            (e) => OLD_INDICATEURS_LISTE_ONBOARDING_SOMMEIL.includes(e) && localStorageIndicateurs[e]
          )
        ) {
          setIsSleepTroubleEnabled(true);
        }

        setSymptomSelection(localStorageIndicateurs);
      })();
    }, [])
  );

  useEffect(() => {
    const symptoms = { ...symptomSelection };
    if (!isMoodTroubleEnable && isMoodTroubleEnable !== undefined) {
      OLD_INDICATEURS_LISTE_ONBOARDING_HUMEUR.forEach((v) => (symptoms[v] = false));
      setSymptomSelection(symptoms);
    }
    if (!isSleepTroubleEnable && isSleepTroubleEnable !== undefined) {
      OLD_INDICATEURS_LISTE_ONBOARDING_SOMMEIL.forEach((v) => (symptoms[v] = false));
      setSymptomSelection(symptoms);
    }
  }, [isMoodTroubleEnable, isSleepTroubleEnable]);

  const handleNext = async () => {
    const symptoms = { ...symptomSelection };
    if (!isMoodTroubleEnable) OLD_INDICATEURS_LISTE_ONBOARDING_HUMEUR.forEach((v) => (symptoms[v] = false));
    if (!isSleepTroubleEnable) OLD_INDICATEURS_LISTE_ONBOARDING_SOMMEIL.forEach((v) => (symptoms[v] = false));

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
              symptomSelection[OLD_INDICATEURS_HUMEUR] ? stylesA.choixContainerSelected : null,
            ]}
            onPress={() =>
              setSymptomSelection((prev) => ({ ...prev, [OLD_INDICATEURS_HUMEUR]: !prev[OLD_INDICATEURS_HUMEUR] }))
            }
          >
            {symptomSelection[OLD_INDICATEURS_HUMEUR] ? (
              <View>
                <RoundButtonIcon
                  backgroundColor={TW_COLORS.SUCCESS}
                  iconColor="#fff"
                  borderWidth={0.5}
                  borderColor={TW_COLORS.SUCCESS}
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
            <Text style={stylesA.choixLabel}>{INDICATEURS_LIST[OLD_INDICATEURS_HUMEUR]}</Text>
          </TouchableOpacity>
          <Text style={styles.question}>
            Avez-vous un trouble spécifique qui fait varier votre humeur au cours de la journée ?
          </Text>
          <View style={styleSwitch.container}>
            <Text style={styleSwitch.label}>Non</Text>
            <Switch
              onValueChange={() => setIsMoodTroubleEnabled(!isMoodTroubleEnable)}
              value={isMoodTroubleEnable}
              trackColor={{ true: colors.LIGHT_BLUE }}
              thumbColor="#EFEFEF"
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
              symptomSelection[OLD_INDICATEURS_SOMMEIL] ? stylesA.choixContainerSelected : null,
            ]}
            onPress={() =>
              setSymptomSelection((prev) => ({ ...prev, [OLD_INDICATEURS_SOMMEIL]: !prev[OLD_INDICATEURS_SOMMEIL] }))
            }
          >
            {symptomSelection[OLD_INDICATEURS_SOMMEIL] ? (
              <View>
                <RoundButtonIcon
                  backgroundColor={TW_COLORS.SUCCESS}
                  iconColor="#fff"
                  borderWidth={0.5}
                  borderColor={TW_COLORS.SUCCESS}
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
            <Text style={stylesA.choixLabel}>{INDICATEURS_LIST[OLD_INDICATEURS_SOMMEIL]}</Text>
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
                  backgroundColor={TW_COLORS.SUCCESS}
                  iconColor="#fff"
                  borderWidth={0.5}
                  borderColor={TW_COLORS.SUCCESS}
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

export const stylesA = StyleSheet.create({
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
    marginLeft: 6,
  },
});

export const styleSwitch = StyleSheet.create({
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

export const styles = StyleSheet.create({
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
    //flex: 1,
    color: colors.BLUE,
    fontSize: 15,
    fontWeight: "400",
    //fontStyle: "italic",
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
