import React from "react";
import Text from "../../components/MyText";
import CheckBox from "@react-native-community/checkbox";

import WelcomeIcon from "../../../assets/svg/WelcomeIcon";
import Support from "../../../assets/svg/Support";
import IllustrationOnboarding from "../../../assets/svg/IllustrationOnboarding";

import { StyleSheet, View, Dimensions } from "react-native";
export const buttonHeight = 43;
export const buttonSmallHeight = 30;
export const defaultPadding = Math.min(Dimensions.get("window").width * 0.7, 30);
export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;
export const menuHeight = 80;
const size = screenHeight * (Dimensions.get("window").height > 700 ? 0.15 : 0.1);

export const Screen0 = () => (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <WelcomeIcon height="60%" width="60%" style={styles.image} />
    </View>
    <View style={styles.containerBottom}>
      <Text style={styles.presentationText}>
        <Text style={styles.h1}>Bienvenue !</Text>
        {"\n\n"}
        Tenez <Text style={styles.bold}>chaque jour</Text> un journal de suivi des{" "}
        <Text style={styles.bold}>indicateurs</Text> de votre état de{" "}
        <Text style={styles.bold}>santé mentale</Text>
      </Text>
    </View>
  </View>
);
export const Screen1 = () => (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <IllustrationOnboarding height="60%" width="60%" style={[styles.image]} />
    </View>
    <View style={styles.containerBottom}>
      <Text style={styles.presentationText}>
        <Text style={styles.h1}>Apprenez à mieux vous connaître</Text>
        {"\n\n"}
        En montrant vos <Text style={styles.bold}>analyses</Text> à votre{" "}
        <Text style={styles.bold}>professionnel</Text> de santé qui pourra vous{" "}
        <Text style={styles.bold}>accompagner</Text>
      </Text>
    </View>
  </View>
);
export const Screen2 = ({ navigation, isCguChecked, setIsCguChecked }) => {
  const onCguClick = () => navigation.navigate("cgu");
  const onLegalMentionsClick = () => navigation.navigate("legal-mentions");
  const onPrivacyClick = () => navigation.navigate("privacy");

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Support height="60%" width="60%" style={[styles.image]} />
        </View>
        <View style={styles.containerBottom}>
          <Text style={styles.presentationText}>
            <Text style={styles.h1}>En toute confiance</Text>
            {"\n\n"}
            C’est <Text style={styles.bold}>gratuit, anonyme</Text> et sans{" "}
            <Text style={styles.bold}>aucune récupération</Text> de vos saisies personnelles
          </Text>
          <View style={styles.cgu}>
            <CheckBox
              animationDuration={0.2}
              tintColor="#1FC6D5"
              tintColors={{ true: "#1FC6D5", false: "grey" }}
              boxType="square"
              style={styles.checkbox}
              value={isCguChecked}
              onValueChange={(newValue) => setIsCguChecked(newValue)}
            />
            <Text style={styles.textCgu}>
              En cochant cette case, vous acceptez nos{" "}
              <Text onPress={onCguClick} style={styles.underlined}>
                Conditions Générales d’Utilisation
              </Text>
              , notre{" "}
              <Text onPress={onPrivacyClick} style={styles.underlined}>
                Politique de Confidentialité
              </Text>{" "}
              et nos{" "}
              <Text onPress={onLegalMentionsClick} style={styles.underlined}>
                Mentions Légales
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerBottom: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: Dimensions.get("window").height > 700 ? 20 : 60,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "stretch",
  },
  emphasis: {
    color: "#1FC6D5",
  },
  h1: {
    fontFamily: "Karla",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 33,
    textAlign: "center",
    color: "#26387C",
  },
  bold: {
    fontWeight: "bold",
    color: "#26387C",
  },
  presentationText: {
    textAlign: "center",
    padding: 20,
    fontSize: Dimensions.get("window").height > 700 ? 20 : 17,
    color: "#0A215C",
    display: "flex",
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    color: "#C3C7D5",
    marginVertical: 0,
  },
  cgu: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
  },
  textCgu: {
    flex: 1,
    fontSize: Dimensions.get("window").height > 700 ? 16 : 12,
  },
  underlined: {
    textDecorationLine: "underline",
  },
  checkbox: {
    marginRight: 20,
  },
});
