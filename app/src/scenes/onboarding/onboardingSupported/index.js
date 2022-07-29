import React from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import Matomo from "../../../services/matomo";
import { MATOMO_DIMENSION, ONBOARDING_STEPS } from "../../../utils/constants";
import BackButton from "../../../components/BackButton";

const Supported = ({ navigation }) => {
  const handleClick = async (value) => {
    //send matomo
    logEvents.logSupportedSelect(value);
    Matomo.setDimensions({
      [MATOMO_DIMENSION.SUPPORTED]: value,
    });
    //navigate to tabs
    navigation.navigate("onboarding-explanation-screen-0");
    //set local storage
    await localStorage.setSupported(value);
  };

  React.useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SUPPORTED);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Faisons connaissance pour personnaliser votre expérience</Text>
          <Text style={styles.subtitle}>Vous êtes actuellement :</Text>
        </View>
        <Card
          title="Suivi et le professionnel qui me suit m’a recommandé l’application"
          color="#F4FCFD"
          handleClick={() => handleClick("YES")}
        />
        <Card
          title="Suivi et j’ai téléchargé moi-même l’application"
          color="#F4FCFD"
          handleClick={() => handleClick("YES_SOLO")}
        />
        <Card
          title="Sans suivi mais je le souhaite"
          color="#F4FCFD"
          handleClick={() => handleClick("NOT_YET")}
        />
        <Card title="Sans suivi" color="#F4FCFD" handleClick={() => handleClick("NO")} />
        <DarkCard title="Professionnel de santé" color="#F4FCFD" handleClick={() => handleClick("PRO")} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Card = ({ title, handleClick }) => {
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
const DarkCard = ({ title, handleClick }) => {
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.darkCard}>
        <Text style={styles.darkCardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  darkCard: {
    backgroundColor: colors.DARK_BLUE,
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
  scrollContainer: {
    paddingBottom: 150,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
  darkCardTitle: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
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
  },
  subtitle: {
    color: colors.DARK_BLUE,
    paddingBottom: 10,
    paddingTop: 10,
    fontWeight: "normal",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    flex: 1,
    display: "flex",
  },
});

export default Supported;
