import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { OnboardingV2ScreenProps, Difficulty } from '../../types';
import { NavigationButtons } from '../../components/NavigationButtons';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { COLORS } from '../../constants';

type Props = OnboardingV2ScreenProps<'PersonalizationDifficulties'>;

const difficultiesData: Difficulty[] = [
  {
    id: 'sleep',
    name: 'Mon sommeil',
    category: 'physical',
    selected: false
  },
  {
    id: 'mood',
    name: 'Humeur',
    category: 'emotional',
    selected: false
  },
  {
    id: 'anxiety',
    name: 'Anxiété',
    category: 'emotional',
    selected: false
  },
  {
    id: 'stress',
    name: 'Stress',
    category: 'emotional',
    selected: false
  },

  {
    id: 'concentration',
    name: 'Concentration',
    category: 'cognitive',
    selected: false
  },
  {
    id: 'motivation',
    name: 'Motivation',
    category: 'behavioral',
    selected: false
  },
  {
    id: 'social_relations',
    name: 'Relations sociales',
    category: 'social',
    selected: false
  },
  {
    id: 'self_esteem',
    name: 'Estime de soi',
    category: 'emotional',
    selected: false
  },
  {
    id: 'work_stress',
    name: 'Stress professionnel',
    category: 'environmental',
    selected: false
  },
  {
    id: 'family_issues',
    name: 'Problèmes familiaux',
    category: 'social',
    selected: false
  }
];

const categoryIcons: Record<string, string> = {
  emotional: '💭',
  physical: '💪',
  cognitive: '🧠',
  behavioral: '🎯',
  social: '👥',
  environmental: '🏢'
};

export const DifficultiesScreen: React.FC<Props> = ({ navigation }) => {
  const { updateDifficulties, nextStep, previousStep } = useOnboarding();
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(difficultiesData);

  const toggleDifficulty = (id: string) => {
    setSelectedDifficulties(prev =>
      prev.map(difficulty =>
        difficulty.id === id
          ? { ...difficulty, selected: !difficulty.selected }
          : difficulty
      )
    );
  };

  const handleNext = () => {
    const selected = selectedDifficulties.filter(d => d.selected);
    updateDifficulties(selected);
    nextStep();
    navigation.navigate('PersonalizationObjective');
  };

  const handlePrevious = () => {
    previousStep();
    navigation.goBack();
  };

  const handleSkip = () => {
    updateDifficulties([]);
    nextStep();
    navigation.navigate('PersonalizationObjective');
  };

  const selectedCount = selectedDifficulties.filter(d => d.selected).length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ProgressIndicator currentStep={2} totalSteps={4} />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* En-tête */}
        <View className="px-6 py-4">
          <Text 
            className="text-2xl font-bold text-center mb-2"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Sur quoi avez-vous ressenti une difficulté ?
          </Text>
          <Text 
            className="text-base text-center mb-2"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            Sélectionnez les domaines sur lesquels vous aimeriez travailler
          </Text>
        </View>

        {/* Liste des difficultés */}
        <View style={{ paddingVertical: 8 }}>
          {selectedDifficulties.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleDifficulty(item.id)}
              className="mx-4 mb-3 p-4 rounded-xl border-2"
              style={{
                borderColor: item.selected ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
                backgroundColor: item.selected ? COLORS.PRIMARY + '10' : COLORS.WHITE,
              }}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">
                  {categoryIcons[item.category] || '📝'}
                </Text>
                <View className="flex-1">
                  <Text 
                    className="text-lg font-medium"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    {item.name}
                  </Text>
                </View>
                {item.selected && (
                  <View 
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                  >
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <NavigationButtons
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          nextDisabled={!selectedCount}
          showSkip={true}
          nextText="Continuer"
          skipText="Passer cette étape"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DifficultiesScreen;
