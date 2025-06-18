import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { OnboardingV2ScreenProps, Objective } from '../../types';
import { NavigationButtons } from '../../components/NavigationButtons';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { COLORS } from '../../constants';

type Props = OnboardingV2ScreenProps<'PersonalizationObjective'>;

const objectivesData: Objective[] = [
  {
    id: 'daily_tracking',
    title: 'Mieux gérer mon stress ou mon anxiété'
    // description: 'Suivre mon humeur et mes ressentis au quotidien',
    // icon: '📊',
  },
  {
    id: 'stress_management',
    title: 'M’aider à mieux comprendre mes ressentis',
  },
  {
    id: 'sleep_improvement',
    title: 'Suivre mon état entre deux rendez-vous thérapeutiques',
  },
  {
    id: 'mood_stability',
    title: 'Autre',
  },
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
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);

  const handleNext = () => {
    if (selectedObjective) {
      updateObjective(selectedObjective);
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
            {/* <View 
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: priorityColors[item.priority] + '20' }}
            >
              <Text 
                className="text-xs font-medium"
                style={{ color: priorityColors[item.priority] }}
              >
                {priorityLabels[item.priority]}
              </Text>
            </View> */}
          </View>
          {/* <Text 
            className="text-sm leading-5"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            {item.description}
          </Text> */}
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
