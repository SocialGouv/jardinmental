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

type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingPersonalizationStartScreen: React.FC<Props> = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('PersonalizationDifficulties');
  };

  // const animatedStatusBarColor = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: TW_COLORS.PRIMARY,
  //   };
  // })

  // const animatedTextColor = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: 'transparent',
  //     color: TW_COLORS.WHITE,
  //     alignContent: 'center',
  //     textAlign: 'center'
  //   };
  // })

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
        // animatedStatusBarColor={animatedStatusBarColor}
        // animatedTextColor={animatedTextColor}
        header={SHARED_HEADER || PROGRESS_BAR || PROGRESS_BAR_AND_HEADER ? undefined : <ProgressIndicator currentStep={2} totalSteps={3} />}
        title={'Sur quoi avez-vous ressenti une difficulté ou une gêne ces deux dernières semaines?'}
        handlePrevious={handlePrevious}
        handleSkip={handleSkip}
      />}
      {/* <CheckInHeader
        title=""
        onPrevious={() => navigation.goBack()}
        onSkip={handleNext}
        showPrevious={true}
        showSkip={true}
      /> */}
      {/* <ProgressIndicator currentStep={1} totalSteps={4} /> */}

      <View className="flex-1 justify-center items-center px-8">
        {/* Titre principal */}
        {/* <Text
          className="text-2xl font-bold text-center mb-6"
          style={{ color: TW_COLORS.TEXT_PRIMARY }}
        >
          Créons ensemble un suivi qui vous ressemble
        </Text> */}

        <Text
          className="text-lg text-left mb-8 font-bold text-primary"
        >
          Commençons avec quelques questions, simples et sans jugement, pour personnaliser vos observations
        </Text>
        <Text
          className="text-base text-left mb-8"
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
        >
          Il n’y a pas de bonnes ou mauvaises réponses.{'\n'}
          Vous pourrez ajuster vos choix à tout moment.{'\n'}
          Sentez vous libre d’avancer à votre rythme.{'\n'}
        </Text>
      </View>

      <NavigationButtons
        onNext={handleNext}
        showPrevious={false}
        nextText="Créer mon suivi personnalisé"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default OnboardingPersonalizationStartScreen
