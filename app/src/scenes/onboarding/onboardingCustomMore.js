import React from "react";
import { View, ScrollView, Image } from "react-native";
import Text from "../../components/MyText";
import Button from "../../components/Button";
import { onboardingStyles } from "./styles";
import { StickyButtonContainer } from "./StickyButton";
import { SafeAreaViewWithOptionalHeader } from "./ProgressHeader";
import { OnboardingBackButton } from "./BackButton";

export const OnboardingCustomMore = ({ navigation }) => {
  return (
    <SafeAreaViewWithOptionalHeader style={onboardingStyles.safe}>
      <View style={onboardingStyles.topContainer}>
        <OnboardingBackButton onPress={navigation.goBack} />
      </View>
      <ScrollView style={onboardingStyles.scroll} contentContainerStyle={onboardingStyles.scrollContentContainer}>
        <View style={onboardingStyles.containerCentered}>
          <View style={onboardingStyles.imageContainer} key="image">
            <Image source={require("../../../assets/imgs/onboarding/custom-more.png")} style={onboardingStyles.imageSize} />
          </View>
          <View style={onboardingStyles.containerBottom}>
            <View style={onboardingStyles.containerBottomTitle}>
              <Text style={onboardingStyles.h1}>Personnalisez vos indicateurs et vos objectifs</Text>
            </View>
            <View style={onboardingStyles.containerBottomText}>
              <Text style={onboardingStyles.presentationText}>
                Vous trouverez d’autres exemples et vous pourrez créer les vôtres dans les paramètres de l’application
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StickyButtonContainer>
        <Button
          title="J'y penserai !"
          onPress={() => {
            navigation.navigate("onboarding-felicitation");
          }}
          buttonStyle={{ minWidth: 0 }}
        />
      </StickyButtonContainer>
    </SafeAreaViewWithOptionalHeader>
  );
};
