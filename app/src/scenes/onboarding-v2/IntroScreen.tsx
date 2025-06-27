import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from './types';
import { NavigationButtons } from '../../components/onboarding/NavigationButtons';
import { TW_COLORS } from '@/utils/constants';
import BannerHeader from './BannerHeader';
import { useAnimatedStyle } from 'react-native-reanimated';

type Props = OnboardingV2ScreenProps<'Intro'>;

export const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate('Profile');
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
    <SafeAreaView className="flex-1 bg-white">
      {/* <View className="flex-1 justify-center items-center px-8">
        <View className="mb-8">
          <View
            className="w-40 h-40 rounded-full items-center justify-center"
            style={{ backgroundColor: TW_COLORS.PRIMARY + '20' }}
          >
            <Text className="text-6xl">🌱</Text>
          </View>
        </View>

        <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: TW_COLORS.TEXT_PRIMARY }}
        >
          Jargin Mental est un outils de suivi de votre santé mentale.
        </Text>

        <Text
          className="text-xl text-center mb-8 leading-8"
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
        >
          Gratuit à vie{'\n'}
          Totalement anonyme{'\n'}
          Sans inscription
        </Text>

        <Text
          className="text-base text-center leading-6"
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
        >
          Créer avec des professionels et soutenu par la CNAM
        </Text>
      </View> */}

      <BannerHeader
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        title={`Jardin Mental est un outils de suivi de votre santé mentale.`}
        handlePrevious={() => { }}
        handleSkip={() => { }}
      >
      </BannerHeader>
      <View className="flex-1 justify-center items-center px-8">
        {/* <View className="mb-8">
          <View
            className="w-40 h-40 rounded-full items-center justify-center"
            style={{ backgroundColor: TW_COLORS.PRIMARY + '20' }}
          >
            <Text className="text-6xl">🌱</Text>
          </View>
        </View> */}

        {/* <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: TW_COLORS.TEXT_PRIMARY }}
        >
          Jardin Mental est un outils de suivi de votre santé mentale.
        </Text> */}

        <Text
          className="text-xl text-center mb-8 leading-8"
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
        >
          Gratuit à vie{'\n'}
          Totalement anonyme{'\n'}
          Sans inscription
        </Text>
      </View>
      <View className="px-8">
        <Text
          className="text-base text-center leading-6"
          style={{ color: TW_COLORS.TEXT_SECONDARY }}
        >
          Créer avec des professionels et soutenu par la CNAM
        </Text>
      </View>
      <NavigationButtons
        onNext={handleNext}
        showPrevious={false}
        nextText="Découvrir Jardin Mental"
      />
    </SafeAreaView>
  );
};

export default IntroScreen;
