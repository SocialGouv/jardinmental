import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import ProgressIndicator from '@/components/onboarding/ProgressIndicator';
import { OnboardingV2ScreenProps } from '../types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { HEADER_WITH_BANNER, PROGRESS_BAR, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from '@/utils/constants';
import { SafeAreaViewWithOptionalHeader } from '@/scenes/onboarding/ProgressHeader';
import BannerHeader from '../BannerHeader';
import { useAnimatedStyle } from 'react-native-reanimated';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';

type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingPersonalizationStartScreen: React.FC<Props> = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('PersonalizationDifficulties');
  };

  const handlePrevious = () => {
    navigation.goBack();
  }
  const handleSkip = () => {
    handleNext()
  }

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      {<BannerHeader
        hidden={HEADER_WITH_BANNER}
        hideHeader={PROGRESS_BAR_AND_HEADER}
        header={SHARED_HEADER || PROGRESS_BAR || PROGRESS_BAR_AND_HEADER ? undefined : <ProgressIndicator currentStep={2} totalSteps={3} />}
        title={'Créons ensemble un suivi qui vous ressemble.'}
        handleSkip={handleSkip}
      />}
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className={mergeClassNames(typography.textXlMedium, 'mb-8 text-brand-900 text-left')}
        >
          Commençons avec quelques questions simples pour, que le suivi vous ressemble vraiment.
        </Text>
        <Text
          className={mergeClassNames(typography.textMdMedium, 'text-left')}
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
        >
          {'\u2022'} Il n’y a pas de bonnes ou mauvaises réponses.{'\n'}
          {'\u2022'} Vous pourrez ajuster vos choix à tout moment.{'\n'}
          {'\u2022'} Sentez vous libre d’avancer à votre rythme.{'\n'}
        </Text>
      </View>
      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        showPrevious={false}
        nextText="Créer mon suivi personnalisé"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default OnboardingPersonalizationStartScreen
