import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, ScrollView, Image } from "react-native";

import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import logEvents from "../../services/logEvents";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";
import localStorage from "../../utils/localStorage";

const OnboardingExplanation = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    currentIndex < 3 ? setCurrentIndex(currentIndex + 1) : setCurrentIndex(3);
    logEvents.logOnboardingExplainNext(currentIndex);
  };
  const handleStart = async () => {
    logEvents.logOnboardingExplainStart();
    await localStorage.setOnboardingDone(true);
    navigation.navigate("tabs");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <Text style={styles.title}>Apprendre à mieux se connaître au fil du temps</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {currentIndex === 0 && <ScreenStats />}
        {currentIndex === 1 && <ScreenFriezes />}
        {currentIndex === 2 && <ScreenCurves />}
        {currentIndex === 3 && <ScreenTriggers />}
      </ScrollView>
      <View style={stylesButton.buttonWrapper}>
        {currentIndex === 3 ? (
          <Button style={styles.validationButton} title="Je démarre" onPress={handleStart} />
        ) : (
          <Button style={styles.validationButton} title="Suivant" onPress={handleNext} />
        )}
      </View>
    </SafeAreaView>
  );
};

const ScreenStats = () => (
  <View style={styles.container}>
    <Text style={styles.presentationText}>
      Les <Text style={styles.bold}>statistiques</Text> vous donneront un bilan de chaque indicateur sur la
      période de votre choix, ainsi que votre observance de vos prises de traitement
    </Text>
    <Image style={styles.image} source={require("../../../assets/imgs/onboarding/screen_stats_1.png")} />
  </View>
);

const ScreenFriezes = () => (
  <View style={styles.container}>
    <Text style={styles.presentationText}>
      Les <Text style={styles.bold}>frises</Text> vous permettront de suivre l’évolution de vos indicateurs,
      de comprendre les corrélations entre eux, ainsi que les effets de votre traitement
    </Text>
    <Image style={styles.image} source={require("../../../assets/imgs/onboarding/screen_frises.png")} />
  </View>
);
const ScreenCurves = () => (
  <View style={styles.container}>
    <Text style={styles.presentationText}>
      Les <Text style={styles.bold}>courbes</Text> vous permettront de suivre votre évolution et de retrouver
      rapidement le détail de chaque journée en cliquant sur le point correspondant.
    </Text>
    <Image style={styles.image} source={require("../../../assets/imgs/onboarding/screen_courbes.png")} />
  </View>
);
const ScreenTriggers = () => (
  <View style={styles.container}>
    <Text style={styles.presentationText}>
      Les <Text style={styles.bold}>déclencheurs</Text> vous aideront à comprendre ce qui influe sur votre
      état de santé mentale, en retrouvant vos notes personnelles liées à l’indicateur et son intensité de
      votre choix.
    </Text>
    <Image style={styles.image} source={require("../../../assets/imgs/onboarding/screen_declencheurs.png")} />
  </View>
);

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
  scrollContainer: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    marginTop: 20,
    height: 280,
    resizeMode: "contain",
  },
  title: {
    color: colors.BLUE,
    fontSize: 18,
    padding: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  container: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    display: "flex",
    alignItems: "center",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  validationButton: {
    width: 4,
  },
  bold: {
    fontWeight: "700",
    color: colors.BLUE,
  },
  presentationText: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.BLUE,
  },
});

export default OnboardingExplanation;
