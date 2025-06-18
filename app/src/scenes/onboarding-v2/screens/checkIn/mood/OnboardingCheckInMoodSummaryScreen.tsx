import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import CheckInHeader from '../../../components/CheckInHeader';
import NavigationButtons from '../../../components/NavigationButtons';
import { COLORS } from '../../../constants';
import { useOnboarding } from '../../../context/OnboardingContext';
import { OnboardingV2ScreenProps } from '../../../types';


type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingCheckInMoodSummaryScreen: React.FC<Props> = ({ navigation }) => {
  const { nextStep } = useOnboarding();

  const handleNext = () => {
    nextStep();
    navigation.navigate('OnboardingCheckInSleep');
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
          Merci c'est une première étape précieuse.
        </Text>

        <Text 
          className="text-xl text-center mb-8 leading-8"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Observer votre humeur au fil du temps peut aider à mieux comprendre ce qui vous influence.
        </Text>
      </View>

      <NavigationButtons
        onNext={handleNext}
        showPrevious={false}
        nextText="Passer au bilan sommeil"
      />
    </SafeAreaView>
  );
};

export default OnboardingCheckInMoodSummaryScreen
