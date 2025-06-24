import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingV2ScreenProps } from './types';
import { NavigationButtons } from '../../components/onboarding/NavigationButtons';
import { COLORS } from '@/utils/constants';

type Props = OnboardingV2ScreenProps<'Intro'>;

export const IntroScreen: React.FC<Props> = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">      
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo ou illustration */}
        <View className="mb-8">
          <View 
            className="w-40 h-40 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.PRIMARY + '20' }}
          >
            <Text className="text-6xl">🌱</Text>
          </View>
        </View>

        {/* Titre principal */}
        <Text 
          className="text-4xl font-bold text-center mb-6"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Jargin Mental est un outils de suivi de votre santé mentale.
        </Text>

        {/* Sous-titre */}
        <Text 
          className="text-xl text-center mb-8 leading-8"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Gratuit à vie{'\n'}
          Totalement anonyme{'\n'}
          Sans inscription
        </Text>

        {/* Description */}
        <Text 
          className="text-base text-center leading-6"
          style={{ color: COLORS.TEXT_SECONDARY }}
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
