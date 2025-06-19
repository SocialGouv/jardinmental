import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { OnboardingV2ScreenProps, Objective } from '../../types';
import { NavigationButtons } from '../../components/NavigationButtons';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { useUserProfile } from '../../../../context/userProfile';
import { COLORS } from '../../constants';
import CheckInHeader from '../../components/CheckInHeader';

type Props = OnboardingV2ScreenProps<'PersonalizationObjective'>;

const objectivesData: Objective[] = [
  {
    id: 'stress_management',
    title: 'Mieux gérer mon stress ou mon anxiété',
  },
  {
    id: 'emotions_understanding',
    title: 'M’aider à mieux comprendre mes ressentis',
  },
  {
    id: 'daily_tracking',
    title: 'Suivre mon état entre deux rendez-vous thérapeutiques',
  },
  {
    id: 'other',
    title: 'Autre',
  }
];

const priorityColors = {
  high: COLORS.ERROR,
  medium: COLORS.WARNING,
  low: COLORS.SUCCESS
};

const priorityLabels = {
  high: 'Priorité haute',
  medium: 'Priorité moyenne',
  low: 'Priorité basse'
};

const NextScreen = 'OnboardingCheckInStart'

export const ObjectiveScreen: React.FC<Props> = ({ navigation, route }) => {
  const { updateObjective, nextStep, previousStep, state } = useOnboarding();
  const { updateUserObjectives, profile } = useUserProfile();
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);

  const handleNext = async () => {
    if (selectedObjective) {
      // Update onboarding context (for flow continuity)
      updateObjective(selectedObjective);
      
      // Update user profile (for permanent storage)
      if (profile) {
        const existingObjectives = profile.objectives || [];
        const updatedObjectives = [...existingObjectives];
        
        // Check if objective already exists, if not add it
        const existingIndex = updatedObjectives.findIndex(obj => obj.id === selectedObjective.id);
        if (existingIndex === -1) {
          updatedObjectives.push(selectedObjective);
        }
        
        await updateUserObjectives(updatedObjectives);
      }
      
      nextStep();
      navigation.navigate(NextScreen);
    }
  };

  const handlePrevious = () => {
    previousStep();
    navigation.goBack();
  };

  const handleSkip = () => {
    nextStep();
    navigation.navigate(NextScreen);
  };

  const renderObjectiveItem = ({ item }: { item: Objective }) => (
    <TouchableOpacity
      onPress={() => setSelectedObjective(item)}
      className="mx-4 mb-4 p-4 rounded-xl border-2"
      style={{
        borderColor: selectedObjective?.id === item.id ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
        backgroundColor: selectedObjective?.id === item.id ? COLORS.PRIMARY + '10' : COLORS.WHITE,
      }}
    >
      <View className="flex-row items-start">
        {/* <Text className="text-3xl mr-4">{item.icon}</Text> */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text 
              className="text-lg font-semibold"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              {item.title}
            </Text>
          </View>
        </View>
        {selectedObjective?.id === item.id && (
          <View 
            className="w-6 h-6 rounded-full items-center justify-center ml-2"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CheckInHeader
        title=""
        onPrevious={handlePrevious}
        onSkip={nextStep}
        showPrevious={true}
        showSkip={true}
      />   
      <ProgressIndicator currentStep={3} totalSteps={4} />
      
      <View className="flex-1">
        {/* En-tête */}
        <View className="px-6 py-4">
          <Text 
            className="text-2xl font-bold text-center mb-2"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Quel est votre priorité aujourd'hui dans Jardin Mental
          </Text>
          <Text 
            className="text-base text-center mb-2"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            Votre réponse nous aide à vous orienter vers un suivi plus utile.
          </Text>
        </View>

        {/* Liste des objectifs */}
        <FlatList
          data={objectivesData}
          keyExtractor={(item) => item.id}
          renderItem={renderObjectiveItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      <NavigationButtons
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        showSkip={true}
        nextDisabled={!selectedObjective}
        nextText="Continuer"
        skipText="Passer cette étape"
      />
    </SafeAreaView>
  );
};

export default ObjectiveScreen;
