import React from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import localStorage from "../../../utils/localStorage";
import BackButton from "../../../components/BackButton";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import AllEmoji from "../../../../assets/svg/AllEmoji";

const Explanation = ({ navigation }) => {
  React.useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_EXPLANATION);
    })();
  }, []);

  const handlePress = () => {
    navigation.navigate("onboarding-explanation-screen-1");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Vous allez évaluer quotidiennement des indicateurs de votre état de santé mentale
          </Text>
          <Text style={styles.text}>Humeur</Text>
          <AllEmoji />
          <Text style={styles.text}>Anxiété</Text>
          <AllEmoji />
          <Text style={styles.text}>Fatigue</Text>
          <AllEmoji />
          <Text style={styles.subtitle}>
            Ces indicateurs peuvent être des <Text style={styles.bold}>émotions</Text>, des{" "}
            <Text style={styles.bold}>ressentis</Text>, des <Text style={styles.bold}>comportements</Text> ou
            même des <Text style={styles.bold}>activités</Text>
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Je comprends le principe" onPress={handlePress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollContainer: {
    paddingBottom: 150,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 15,
    alignItems: "center",
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    paddingBottom: 15,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 55,
  },
  subtitle: {
    color: colors.DARK_BLUE,
    paddingBottom: 10,
    paddingTop: 10,
    fontWeight: "normal",
    fontSize: 15,
    paddingTop: 75,
  },
  text: {
    fontFamily: "Karla",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 18,
    color: "#979797",
    paddingTop: 20,
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    flex: 1,
    display: "flex",
  },
  card: {
    backgroundColor: colors.LIGHT_BLUE,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: Dimensions.get("window").height > 700 ? 75 : 40,
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
  },
  bold: {
    fontWeight: "700",
    color: colors.DARK_BLUE,
  },
});

export default Explanation;
