import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import { OnboardingV2ScreenProps } from '../../types';
import { TW_COLORS } from '@/utils/constants';
import { useAnimatedStyle } from 'react-native-reanimated';
import { moodBackgroundColors, moodEmojis } from '@/utils/mood';
import BannerHeader from '../../BannerHeader';
import { SafeAreaViewWithOptionalHeader } from '@/scenes/onboarding/ProgressHeader';
import { bg } from 'date-fns/locale';


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
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeader
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        headerTitle="Observation du jour"
      // handlePrevious={handlePrevious}
      // handleSkip={handleSkip}
      >

        <View className="p-8 rounded-3xl bg-white w-full">
          <Text
            className="text-2xl font-bold text-left mb-4"
            style={{ color: TW_COLORS.TEXT_PRIMARY }}
          >
            Votre bilan d'aujourd'hui
          </Text>
          {route.params?.mood !== null && <View className='justify-center items-center mt-2'>
            {moodEmojis[route.params?.mood]?.icon}
          </View>}
          {/* <View className='justify-center items-center mt-2'>
            {route.params?.mood !== null && <Text
              className="text-lg font-bold text-center"
              style={{ color: TW_COLORS.TEXT_PRIMARY }}
            >
              {moodEmojis[route.params?.mood]?.label}
            </Text>}
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
              // maxHeight: MAX_ROWS * TAG_HEIGHT + (MAX_ROWS - 1) * 8, // + gap between rows
            }}
          >
            {(route.params?.selectedMoods || []).map((mood, index) => (
              <View key={index} style={{ margin: 4 }}>
                <Tag
                  text={mood}
                  bgcolor={
                    route.params?.mood != null
                      ? moodBackgroundColors[route.params?.mood]
                      : TW_COLORS.WHITE
                  }
                />
              </View>
            ))}
          </View>
        </View>
      </BannerHeader>
      <View className="flex-1 justify-center items-center p-6">
        <View className="w-full">
          <Text
            className="text-2xl text-left mb-6 text-primary font-bold"
            style={{ color: TW_COLORS.TEXT_PRIMARY }}
          >
            Merci, c'est une première étape précieuse.
          </Text>
          <Text
            className="text-lg text-left mb-8 leading-8 text-base"
            style={{ color: TW_COLORS.TEXT_SECONDARY }}
          >
            Certains jours pèsent un peu plus que d’autres,  c’est déjà précieux de l’avoir noté.          </Text>
        </View>
      </View>

      <NavigationButtons
        onNext={handleNext}
        onPrevious={handlePrevious}
        showPrevious={false}
        nextText="Passer au bilan sommeil"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export const Tag = ({ text, bgcolor }: { text: string, bgcolor: string }) => {
  return (
    <View
      className="p-2 px-4 rounded-full"
      style={{
        backgroundColor: bgcolor,
      }}
    >
      <Text
        className="text-md text-center"
        style={{ color: TW_COLORS.TEXT_PRIMARY }}
      >
        {text}
      </Text>
    </View>
  );
}

export default OnboardingCheckInMoodSummaryScreen
