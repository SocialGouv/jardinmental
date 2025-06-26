import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { OnboardingV2ScreenProps } from '../../types';
import { TW_COLORS } from '@/utils/constants';
import { useAnimatedStyle } from 'react-native-reanimated';
import { moodBackgroundColors, moodEmojis } from '@/utils/mood';
import BannerHeader from '../../BannerHeader';


type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingCheckInMoodSummaryScreen: React.FC<Props> = ({ navigation, route }) => {

  const handleNext = () => {
    navigation.navigate('OnboardingCheckInSleep');
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleNext();
  };

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: route.params?.mood !== null ? moodBackgroundColors[route.params?.mood] : TW_COLORS.WHITE,
    };
  })

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: 'transparent',
      color: TW_COLORS.PRIMARY,
      alignContent: 'center',
      textAlign: 'center'
    };
  })

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BannerHeader
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        title={`Votre bilan d'aujourd'hui`}
        handlePrevious={handlePrevious}
        handleSkip={handleSkip}
      >
        {route.params?.mood !== null && <View className='justify-center items-center mt-4'>
          {moodEmojis[route.params?.mood]?.icon}
        </View>}
      </BannerHeader>
      <View className="flex-1 justify-center items-center p-4">
        <View className="p-8 rounded-3xl bg-[#FDF2E7] w-full">
          <Text
            className="text-2xl text-left mb-6 text-primary"
            style={{ color: TW_COLORS.TEXT_PRIMARY }}
          >
            Merci c'est une première étape précieuse.
          </Text>
          <Text
            className="text-lg text-left mb-8 leading-8 text-base"
            style={{ color: TW_COLORS.TEXT_SECONDARY }}
          >
            Observer votre humeur au fil du temps peut aider à mieux comprendre ce qui vous influence.
          </Text>
        </View>
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
