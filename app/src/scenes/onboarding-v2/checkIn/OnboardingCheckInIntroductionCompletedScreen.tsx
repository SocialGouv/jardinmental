import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from '../types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { COLORS } from '@/utils/constants';


type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingCheckInIntroductionCompleted: React.FC<Props> = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('OnboardingChooseIndicator');
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
          Vous avez commencé votre suivi, bravo!
        </Text>

        <Text 
          className="text-xl text-center mb-8 leading-8"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
            Pour aller plus loin, je vous propose quelques éléments à suivre régulièrement, en fonction de ce que vous avez partagé.
            {'\n\n'}
            Cela vous permettra de prendre du recul au quotidien sur ces sensations et ressentis. 
            {'\n\n'}
            Vous pourrez en ajouter d’autres, en retirer, ou les modifier à tout moment.
        </Text>
      </View>

      <NavigationButtons
        onNext={handleNext}
        showPrevious={false}
        nextText="Continuer vers mon suivi personnalisé"
      />
    </SafeAreaView>
  );
};

export default OnboardingCheckInIntroductionCompleted
