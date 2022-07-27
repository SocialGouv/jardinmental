import React from "react";
import { StyleSheet, SafeAreaView, View, ScrollView } from "react-native";
import Text from "../../components/MyText";
import Button from "../../components/Button";
import { colors } from "../../utils/colors";
import Temps from "./assets/Temps";

const Onboarding = ({}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.containerSvg}>
          <Temps width={100} height={100} />
        </View>
        <View>
          <Text style={styles.title}>Une dernière chose importante</Text>
        </View>
        <View style={styles.defaultContainer}>
          <Text style={styles.body}>Trouver les bons indicateurs de sa santé mentale prend du temps.</Text>
        </View>
        <View style={styles.defaultContainer}>
          <Text style={styles.body}>
            Faites <Text style={[styles.body, styles.bold]}>évoluer</Text> votre questionnaire à tout moment
            dans les <Text style={[styles.body, styles.bold]}>paramètres</Text> de l’application, pour suivre
            de nouveaux indicateurs ou <Text style={[styles.body, styles.bold]}>enlever</Text> ceux qui ne
            vous correspondent pas ou plus !
          </Text>
        </View>
        <View style={[styles.bordered, styles.defaultContainer]}>
          <Text style={[styles.body, styles.bold, styles.textCenter]}>
            Parlez-en à un professionnel de santé mentale pour vous aider à choisir les indicateurs adaptés{" "}
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button onPress={() => {}} title="Bien reçu !" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    position: "absolute",
    bottom: 0,
  },
  bold: {
    fontWeight: "bold",
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.BLUE,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  containerSvg: {
    alignItems: "center",
    marginVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  defaultContainer: {
    marginVertical: 15,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 80,
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
  },
  title: {
    textAlign: "left",
    fontWeight: "bold",
    color: colors.BLUE,
    fontSize: 28,
  },
  textCenter: {
    textAlign: "center",
  },
  textLeft: {
    textAlign: "left",
  },
  body: {
    fontSize: 15,
    color: colors.BLUE,
  },
});

export default Onboarding;
