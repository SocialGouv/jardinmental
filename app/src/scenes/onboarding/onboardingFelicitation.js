import React from "react";
import { StyleSheet, SafeAreaView, View, ScrollView } from "react-native";
import Text from "../../components/MyText";
import Button from "../../components/Button";
import { colors } from "../../utils/colors";
import Felicitation from "../../../assets/svg/felicitation";

const Onboarding = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.containerSvg}>
          <Felicitation width={100} height={100} />
        </View>
        <View>
          <Text style={styles.title}>
            Félicitations ! Vous êtes désormais prêt(e) à démarrer votre suivi quotidien
          </Text>
        </View>
        <View style={styles.defaultContainer}>
          <Text style={styles.body}>
            Si vous le souhaitez, je peux d’abord vous expliquer les outils de suivi que vous trouverez dans
            la partie “mes analyses”
          </Text>
        </View>
        <View style={styles.buttonPrimaryWrapper}>
          <Button
            textStyle={{ fontSize: 16, fontWeight: "bold" }}
            onPress={() => {
              navigation.navigate("tabs", { onboarding: true });
            }}
            title="Je démarre"
          />
        </View>
        <View style={styles.buttonSecondaryWrapper}>
          <Button
            textStyle={styles.buttonSecondaryText}
            buttonStyle={styles.buttonSecondary}
            onPress={() => {
              navigation.navigate("onboarding-explanation-details", { onboarding: true });
            }}
            title="J'ai besoin d'explication"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonSecondary: {
    backgroundColor: colors.WHITE,
    borderWidth: 2,
    borderColor: colors.LIGHT_BLUE,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.LIGHT_BLUE,
  },
  buttonPrimaryWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    position: "absolute",
    bottom: 60,
  },
  buttonSecondaryWrapper: {
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
