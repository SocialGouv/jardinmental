import React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, Image } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import Matomo from "../../../services/matomo";
import { MATOMO_DIMENSION, ONBOARDING_STEPS } from "../../../utils/constants";
import { SafeAreaViewWithOptionalHeader } from "../ProgressHeader";
import { OnboardingBackButton } from "../BackButton";

const Supported = ({ navigation }) => {
  const handleClick = async (value) => {
    //send matomo
    logEvents.logSupportedSelect(value);
    Matomo.setDimensions({
      [MATOMO_DIMENSION.SUPPORTED]: value,
    });
    //navigate to explanation
    navigation.navigate("onboarding-explanation-indicator-1");
    //set local storage
    await localStorage.setSupported(value);
  };

  React.useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SUPPORTED);
    })();
  }, []);

  return (
    <SafeAreaViewWithOptionalHeader style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <OnboardingBackButton onPress={navigation.goBack} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Faisons connaissance</Text>
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

        <View style={styles.hintContainer}>
          <Image
            source={require("../../../../assets/imgs/onboarding/professionnel-sante.png")}
            style={styles.hintImage}
          />
          <Text style={styles.hintText}>
            N’hésitez pas à montrer l’application à un professionnel de santé pour vous aider
          </Text>
        </View>
      </ScrollView>
    </SafeAreaViewWithOptionalHeader>
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
    paddingBottom: 40,
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
    overflow: "visible",
  },
  hintContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#26387C",
  },
  hintImage: {
    width: 41,
    height: 41,
    marginRight: 12,
  },
  hintText: {
    flex: 1,
    fontFamily: "Karla",
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 15,
    color: "#26387C",
  },
});

export default Supported;
