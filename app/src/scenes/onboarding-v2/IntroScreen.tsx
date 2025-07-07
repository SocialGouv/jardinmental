import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from './types';
import { NavigationButtons } from '../../components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BannerHeader from './BannerHeader';
import { useAnimatedStyle } from 'react-native-reanimated';
import BannerHeaderIntro from './BannerHeaderIntro';
import { SafeAreaViewWithOptionalHeader } from '../onboarding/ProgressHeader';
import { useUserProfile } from '@/context/userProfile';
import { typography } from '@/utils/typography';
import { mergeClassNames } from '@/utils/className';

type Props = OnboardingV2ScreenProps<'Intro'>;

export const IntroScreen: React.FC<Props> = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('Carousel');
  };

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: TW_COLORS.SECONDARY,
    };
  })

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: 'transparent',
      color: TW_COLORS.WHITE,
      alignContent: 'center',
      textAlign: 'center'
    };
  })


  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeaderIntro
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        title={`Jardin Mental est un outil de suivi de votre santé mentale.`}
        handlePrevious={() => { }}
        handleSkip={() => { }}
      >
      </BannerHeaderIntro>
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className={mergeClassNames(typography.textXlMedium, 'text-primary')}
        >
          Gratuit à vie.{'\n'}
          Totalement anonyme.{'\n'}
          Sans inscription.
        </Text>
      </View>
      <View className="px-10">
        <Text
          className={mergeClassNames(typography.textSmSemibold, 'text-center')}
          style={{ color: TW_COLORS.SECONDARY }}
        >
          Créer avec des professionels et{'\n'}soutenu par la CNAM
        </Text>
      </View>
      <NavigationButtons
        onNext={handleNext}
        showPrevious={false}
        nextText="Découvrir Jardin Mental"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default IntroScreen;
