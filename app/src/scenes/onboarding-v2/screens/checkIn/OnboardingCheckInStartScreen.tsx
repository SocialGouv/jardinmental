import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingV2ScreenProps } from '../../types';
import { COLORS } from '../../constants';
import NavigationButtons from '../../components/NavigationButtons';
import CheckInHeader from '../../components/CheckInHeader';

type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingCheckInStartScreen: React.FC<Props> = ({ navigation }) => {
  const { nextStep } = useOnboarding();

  const handleNext = () => {
    nextStep();
    navigation.navigate('OnboardingCheckInHowDoYouFeel');
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    // Logique pour passer cette étape si nécessaire
    handleNext();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CheckInHeader
        title=""
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        showPrevious={true}
        showSkip={true}
      />
      
      <View className="flex-1 justify-center items-center px-8">
        <Text 
          className="text-4xl font-bold text-center mb-6"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Un pas après l'autre vous avancez déjà
        </Text>

        <Text 
          className="text-xl text-center mb-8 leading-8"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Réalisons ensemble votre première observation.
        </Text>
      </View>

      <NavigationButtons
        onNext={handleNext}
        showPrevious={false}
        nextText="Continuer vers ma première observation"
      />
    </SafeAreaView>
  );
};

export default OnboardingCheckInStartScreen
