import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { COLORS } from '../../constants';
import NavigationButtons from '../../components/NavigationButtons';
import ProgressIndicator from '../../components/ProgressIndicator';
import { OnboardingV2ScreenProps } from '../../types';

type Props = OnboardingV2ScreenProps<'Intro'>;

export const OnboardingPersonalizationStartScreen: React.FC<Props> = ({ navigation }) => {
  const { nextStep } = useOnboarding();

  const handleNext = () => {
    nextStep();
    navigation.navigate('PersonalizationDifficulties');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">      
      <ProgressIndicator currentStep={1} totalSteps={4} />
  
      <View className="flex-1 justify-center items-center px-8">
        {/* Titre principal */}
        <Text 
          className="text-4xl font-bold text-center mb-6"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Créons ensemble un suivi qui vous ressemble
        </Text>

        <Text 
          className="text-xl text-center mb-8 leading-8"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          Commençons avec quelques questions, simples et sans jugement, pour personnaliser vos observations
          {'\n\n'}
          Il n’y a pas de bonnes ou mauvaises réponses.{'\n'}
          Vous pourrez ajuster vos choix à tout moment.{'\n'}
          Sentez vous libre d’avancer à votre rythme.{'\n'}
        </Text>

        <Text 
          className="text-base text-center leading-6"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >

        </Text>
      </View>

      <NavigationButtons
        onNext={handleNext}
        showPrevious={false}
        nextText="Créer mon suivi personnalisé"
      />
    </SafeAreaView>
  );
};

export default OnboardingPersonalizationStartScreen
