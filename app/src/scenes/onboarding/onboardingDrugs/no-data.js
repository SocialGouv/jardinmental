import React from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";

import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import localStorage from "../../../utils/localStorage";
import { onboardingStyles } from "../styles";

import Logo from "../../../../assets/svg/traitement";
import { StickyButtonContainer } from "../StickyButton";

export default ({ navigation, route }) => {
  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    navigation.navigate("onboarding-custom-more");
  };
  const handleDrugInformation = async () => {
    navigation.navigate("onboarding-drugs-information", { onboarding: true });
  };

  return (
    <>
      <ScrollView style={onboardingStyles.scroll} contentContainerStyle={onboardingStyles.scrollContentContainer}>
        <View style={onboardingStyles.container}>
          <View style={onboardingStyles.imageContainer}>
            <Logo style={styles.image} width={100} height={100} />
          </View>
          <View style={onboardingStyles.containerBottom}>
            <View style={onboardingStyles.containerBottomTitle}>
              <Text style={onboardingStyles.h1}>Suivez vos prises de traitement</Text>
            </View>
            <View style={onboardingStyles.containerBottomText}>
              <Text style={onboardingStyles.presentationText}>
                Cela vous permettra de mieux comprendre leurs effets sur votre état de santé mentale
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button
          textStyle={{ fontSize: 16, fontWeight: "bold" }}
          onPress={() => {
            navigation.navigate("onboarding-drugs-list", { onboarding: route?.params?.onboarding });
          }}
          title="Je renseigne mon traitement"
        />
        <TouchableOpacity style={stylesButton.button} onPress={handleNoTreatment}>
          <Text style={stylesButton.text}>Je n'en ai pas / Je le ferai plus tard</Text>
        </TouchableOpacity>
      </StickyButtonContainer>
    </>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    bottom: 10,
    paddingHorizontal: 20,
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
    fontSize: 15,
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
