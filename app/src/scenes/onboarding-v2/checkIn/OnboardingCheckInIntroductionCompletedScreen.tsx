import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from '../types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BeigeWrapperScreen from '../BeigeWrapperScreen';
import BeigeCard from '../BeigeCard';


type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingCheckInIntroductionCompleted: React.FC<Props> = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('OnboardingChooseIndicator');
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleNext();
  };

  return <BeigeWrapperScreen
    handleSkip={handleSkip}
    handlePrevious={handlePrevious}
    handleNext={handleNext}>
                  <BeigeCard>
      
    <Text
      className="text-2xl font-bold text-center mb-6"
      style={{ color: TW_COLORS.TEXT_PRIMARY }}
    >
      Vous avez commencé votre suivi, bravo!
    </Text>

    <Text
      className="text-xl text-center mb-8 leading-8"
      style={{ color: TW_COLORS.TEXT_SECONDARY }}
    >
      Pour aller plus loin, je vous propose quelques éléments à suivre régulièrement, en fonction de ce que vous avez partagé.
    </Text> 
    </BeigeCard>

  </BeigeWrapperScreen>

};

export default OnboardingCheckInIntroductionCompleted
