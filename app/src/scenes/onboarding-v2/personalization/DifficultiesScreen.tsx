import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { OnboardingV2ScreenProps, Difficulty } from '../types';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { useUserProfile } from '@/context/userProfile';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { TW_COLORS } from '@/utils/constants';

type Props = OnboardingV2ScreenProps<'PersonalizationDifficulties'>;

// @todo defined which difficulties we keep
const difficultiesData: Difficulty[] = [
  {
    id: 'sleep',
    name: 'Mon sommeil',
    selected: false
  },
  {
    id: 'mood',
    name: 'Humeur',
    selected: false
  },
  {
    id: 'anxiety',
    name: 'Anxiété',
    selected: false
  },
  {
    id: 'stress',
    name: 'Stress',
    selected: false
  },
  {
    id: 'concentration',
    name: 'Concentration',
    selected: false
  },
  {
    id: 'motivation',
    name: 'Motivation',
    selected: false
  },
  {
    id: 'social_relations',
    name: 'Relations sociales',
    selected: false
  },
  {
    id: 'self_esteem',
    name: 'Estime de soi',
    selected: false
  },
  {
    id: 'work_stress',
    name: 'Stress professionnel',
    selected: false
  },
  {
    id: 'family_issues',
    name: 'Problèmes familiaux',
    selected: false
  }
];

const categoryIcons: Record<Difficulty['name'], string> = {
  mood: '💭',
  anxiety: '💭',
  stress: '💭',
  self_esteem: '💭',
  sleep: '💪',
  concentration: '🧠',
  motivation: '🎯',
  social: '👥',
  environmental: '🏢'
};

export const DifficultiesScreen: React.FC<Props> = ({ navigation }) => {
  const { updateUserDifficulties } = useUserProfile();
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

  const handleNext = async () => {
    const selected = selectedDifficulties.filter(d => d.selected);
    await updateUserDifficulties(selected);
    navigation.navigate('PersonalizationObjective');
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = async () => {
    await updateUserDifficulties([]);
    navigation.navigate('PersonalizationObjective');
  };

  const selectedCount = selectedDifficulties.filter(d => d.selected).length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CheckInHeader
        title=""
        onPrevious={handlePrevious}
        onSkip={handleNext}
        showPrevious={true}
        showSkip={true}
      />   
      <ProgressIndicator currentStep={2} totalSteps={4} />
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-6 py-4">
          <Text 
            className="text-2xl font-bold text-center mb-2"
            style={{ color: TW_COLORS.TEXT_PRIMARY }}
          >
            Sur quoi avez-vous ressenti une difficulté ?
          </Text>
          <Text 
            className="text-base text-center mb-2"
            style={{ color: TW_COLORS.TEXT_SECONDARY }}
          >
            Sélectionnez les domaines sur lesquels vous aimeriez travailler
          </Text>
        </View>

        <View style={{ paddingVertical: 8 }}>
          {selectedDifficulties.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleDifficulty(item.id)}
              className="mx-4 mb-3 p-4 rounded-xl border-2"
              style={{
                borderColor: item.selected ? TW_COLORS.PRIMARY : TW_COLORS.GRAY_LIGHT,
                backgroundColor: item.selected ? TW_COLORS.PRIMARY + '10' : TW_COLORS.WHITE,
              }}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">
                  {categoryIcons[item.id] || '📝'}
                </Text>
                <View className="flex-1">
                  <Text 
                    className="text-lg font-medium"
                    style={{ color: TW_COLORS.TEXT_PRIMARY }}
                  >
                    {item.name}
                  </Text>
                </View>
                {item.selected && (
                  <View 
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: TW_COLORS.PRIMARY }}
                  >
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <NavigationButtons
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          nextDisabled={!selectedCount}
          showSkip={true}
          nextText="Continuer"
          skipText="Passer cette étape"
        />
    </SafeAreaView>
  );
};

export default DifficultiesScreen;
