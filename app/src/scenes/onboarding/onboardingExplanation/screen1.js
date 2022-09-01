import React from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import localStorage from "../../../utils/localStorage";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import CheckBoard from "../../../../assets/svg/CheckBoard";

const Explanation = ({ navigation }) => {
  React.useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_EXPLANATION);
    })();
  }, []);

  const handlePress = () => {
    navigation.navigate("onboarding-symptoms-start");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Je vais vous aider à choisir les indicateurs qui vous correspondent
          </Text>
          <CheckBoard />
          <Text style={styles.subtitle}>
            Ces indicateurs doivent refléter votre <Text style={styles.bold}>situation</Text>, pour vous
            permettre d’avoir une <Text style={styles.bold}>vision globale</Text> de votre état de santé
            mentale et de <Text style={styles.bold}>comprendre</Text> ce qui influe dessus
          </Text>
        </View>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button title="D’accord, c’est parti !" onPress={handlePress} />
      </View>
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
    flex: 1,
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
    fontWeight: "700",
    textAlign: "left",
    paddingBottom: 75,
  },
  subtitle: {
    color: colors.DARK_BLUE,
    paddingBottom: 10,
    fontWeight: "normal",
    fontSize: 15,
    paddingTop: 75,
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
