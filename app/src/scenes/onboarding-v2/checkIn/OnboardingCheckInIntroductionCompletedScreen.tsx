import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from '../types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BeigeWrapperScreen from '../BeigeWrapperScreen';
import BeigeCard from '../BeigeCard';
import { typography } from '@/utils/typography';
import { mergeClassNames } from '@/utils/className';


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
    nextText='Continuer vers mon suivi'
    handleNext={handleNext}>
    <BeigeCard>

      <Text
        className={mergeClassNames(typography.displayXsRegular, 'text-brand-950 mb-8 px-12')}
      >
        Vous avez commencé votre suivi, bravo !
      </Text>

      <Text
        className={mergeClassNames(typography.textMdSemibold, 'text-brand-900 text-center px-12')}
      >
        Pour aller plus loin, je vous propose quelques éléments à suivre régulièrement, en fonction de ce que vous avez partagé.
      </Text>
    </BeigeCard>

  </BeigeWrapperScreen>

};

export default OnboardingCheckInIntroductionCompleted
