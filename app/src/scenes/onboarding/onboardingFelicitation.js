import React from "react";
import { StyleSheet, SafeAreaView, View, ScrollView } from "react-native";
import Text from "../../components/MyText";
import Button from "../../components/Button";
import { colors } from "../../utils/colors";
import Felicitation from "../../../assets/svg/felicitation";
import BackButton from "../../components/BackButton";
import localStorage from "../../utils/localStorage";

const Onboarding = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
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
      </ScrollView>
      <View style={stylesButton.buttonWrapper}>
        <Button
          textStyle={{ fontSize: 16, fontWeight: "bold" }}
          onPress={async () => {
            await localStorage.setOnboardingDone(true);
            navigation.navigate("tabs", { onboarding: true });
          }}
          title="Je démarre"
        />
        <Button
          textStyle={stylesButton.text}
          buttonStyle={stylesButton.button}
          onPress={() => {
            navigation.navigate("onboarding-explanation-details", { onboarding: true });
          }}
          title="J'ai besoin d'explication"
        />
      </View>
    </SafeAreaView>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 20,
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
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
    paddingHorizontal: 20,
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
    flexGrow: 1,
  },
  title: {
    textAlign: "left",
    fontWeight: "700",
    color: colors.BLUE,
    fontSize: 18,
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
