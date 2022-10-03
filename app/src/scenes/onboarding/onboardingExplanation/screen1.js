import React from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import localStorage from "../../../utils/localStorage";
import { ONBOARDING_STEPS } from "../../../utils/constants";
import CheckBoard from "../../../../assets/svg/CheckBoard";
import { onboardingStyles } from "../styles";
import { StickyButtonContainer } from "../StickyButton";

const Explanation = ({ navigation }) => {
  React.useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_EXPLANATION);
    })();
  }, []);

  const handlePress = () => {
    navigation.navigate("onboarding-symptoms-mood");
  };

  return (
    <SafeAreaView style={onboardingStyles.safe}>
      <View style={onboardingStyles.topContainer}>
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        style={onboardingStyles.scroll}
        contentContainerStyle={onboardingStyles.scrollContentContainer}
      >
        <View style={onboardingStyles.container}>
          <View style={onboardingStyles.imageContainer}>
            <CheckBoard />
          </View>
          <View style={onboardingStyles.containerBottom}>
            <View style={onboardingStyles.containerBottomTitle}>
              <Text style={onboardingStyles.h1}>Choisissons vos indicateurs</Text>
            </View>
            <View style={onboardingStyles.containerBottomText}>
              <Text style={onboardingStyles.presentationText}>
                Pas d’inquiétude, vous pourrez modifier votre sélection plus tard et créer vos propres
                indicateurs dans l’application
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button title={`D’accord, c’est parti !`} onPress={handlePress} buttonStyle={{ minWidth: 0 }} />
      </StickyButtonContainer>
    </SafeAreaView>
  );
};

export default Explanation;
