import React, { useState } from 'react';
import { View, Text, SafeAreaView, Platform } from 'react-native';
import { OnboardingV2ScreenProps } from './types';
import { NavigationButtons } from '../../components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BannerHeader from './BannerHeader';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import BannerHeaderIntro from './BannerHeaderIntro';
import { SafeAreaViewWithOptionalHeader } from '../onboarding/ProgressHeader';
import { useUserProfile } from '@/context/userProfile';
import { typography } from '@/utils/typography';
import { mergeClassNames } from '@/utils/className';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = OnboardingV2ScreenProps<'Intro'>;

export const IntroScreen: React.FC<Props> = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('Carousel');
  };

  const insets = useSafeAreaInsets();

  const [dynamicMarginTop, setDynamicMarginTop] = useState(0); // Default fallback
  const measuredHeight = useSharedValue(0); // Store the measured natural height


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

  const handleBannerLayout = (event) => {
    if (measuredHeight.value === 0) { // Only measure once
      const bannerHeight = event.nativeEvent.layout.height;
      measuredHeight.value = bannerHeight;

      // Calculate total header height including safe area insets
      const totalHeaderHeight = bannerHeight + (Platform.OS === 'android' ? insets.top : 0);
      setDynamicMarginTop(totalHeaderHeight);

      console.log('Banner height measured:', bannerHeight);
      console.log('Total header height (with insets):', totalHeaderHeight);
    }
  };


  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeaderIntro
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        title={`Jardin Mental est un outil de suivi de votre santé mentale.`}
        handlePrevious={() => { }}
        handleSkip={() => { }}
        onBannerLayout={handleBannerLayout}
      />
      <View className="flex-1 justify-center items-center" style={{
        marginTop: dynamicMarginTop
      }}>
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
