import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import localStorage from "../../../utils/localStorage";

export default ({ navigation }) => {
  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    navigation.navigate("onboarding-felicitation");
  };
  const handleDrugInformation = async () => {
    navigation.navigate("onboarding-drugs-information", { onboarding: true });
  };

  return (
    <View>
      <Text style={styles.subtitle}>
        Cela vous permettra de mieux comprendre leurs effets sur votre état de santé mentale
      </Text>
      <Button
        onPress={() => navigation.navigate("onboarding-drugs-list")}
        title="Je renseigne mon traitement"
        buttonStyle={styles.button}
        textStyle={{ fontSize: 16, fontWeight: "bold" }}
      />

      <Button
        onPress={handleNoTreatment}
        title="Je n'en ai pas / Je le ferais plus tard"
        buttonStyle={styles.darkButton}
        textStyle={{ fontSize: 16, fontWeight: "bold", color: colors.LIGHT_BLUE }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: { marginTop: "80%", height: 40, width: "100%", alignSelf: "center" },
  darkButton: {
    marginTop: 10,
    backgroundColor: colors.WHITE,
    height: 40,
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.LIGHT_BLUE,
  },
  subtitle: {
    color: colors.DARK_BLUE,
    fontSize: 18,
    fontWeight: "400",
  },
  link: {
    color: "#181818",
    textDecorationLine: "underline",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "300",
    textAlign: "center",
  },
  lightblue: {
    color: colors.LIGHT_BLUE,
  },
});
