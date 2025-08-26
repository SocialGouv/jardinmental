import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { OnboardingV2ScreenProps } from "../types";
import CheckInHeader from "@/components/onboarding/CheckInHeader";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { TW_COLORS } from "@/utils/constants";

type Props = OnboardingV2ScreenProps<"Intro">;

export const OnboardingCheckInIntroductionCompleted: React.FC<Props> = ({ navigation }) => {
  // useFocusEffect(
  //   useCallback(() => {
  //     setCustomColor(TW_COLORS.PRIMARY);
  //     return () => {
  //       // Optional cleanup here
  //     };
  //   }, [])
  // );

  const handleNext = () => {
    navigation.navigate("OnboardingChooseIndicator");
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CheckInHeader title="" onPrevious={handlePrevious} onSkip={handleSkip} showPrevious={true} showSkip={true} />
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-4xl font-bold text-center mb-6" style={{ color: TW_COLORS.TEXT_PRIMARY }}>
          👏 Un pas de plus vers une meilleure connaissance de vous 2.
        </Text>

        <Text className="text-xl text-center mb-8 leading-8" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
          Votre observation du jour a bien été enregistrée.
        </Text>
        <Text className="text-s text-center mb-8 leading-8" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
          Vous pouvez revenir chaque jour pour observez votre état et suivre ces éléments.
        </Text>
      </View>

      <NavigationButtons onNext={handleNext} showPrevious={false} nextText="Passer au bilan sommeil" />
    </SafeAreaView>
  );
};

export default OnboardingCheckInIntroductionCompleted;
