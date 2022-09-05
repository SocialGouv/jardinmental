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
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Cela vous permettra de mieux comprendre leurs effets sur votre état de santé mentale
      </Text>
      <View style={stylesButton.buttonWrapper}>
        <Button
          textStyle={{ fontSize: 16, fontWeight: "bold" }}
          onPress={() => {
            navigation.navigate("onboarding-drugs-list");
          }}
          title="Je renseigne mon traitement"
        />
        <Button
          textStyle={stylesButton.text}
          buttonStyle={stylesButton.button}
          onPress={handleNoTreatment}
          title="Je n'en ai pas / Je le ferai plus tard"
        />
      </View>
    </View>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    borderColor: "red",
    borderWidth: 1,
    position: "absolute",
    bottom: 10,
    paddingHorizontal: 10,
    left: 0,
    right: 0,
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
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1f2937",
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
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
    flex: 1,
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
