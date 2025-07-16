import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { OnboardingV2ScreenProps, Objective } from '../types';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { useUserProfile } from '@/context/userProfile';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { HEADER_WITH_BANNER, PROGRESS_BAR, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from '@/utils/constants';
import { SafeAreaViewWithOptionalHeader, useOnboardingProgressHeader } from '@/scenes/onboarding/ProgressHeader';
import BannerHeader from '../BannerHeader';
import { useAnimatedStyle } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import SelectionnableItem from '@/components/SelectionnableItem';

type Props = OnboardingV2ScreenProps<'PersonalizationObjective'>;

// @todo what do we do when others is selected, is this the final list ?
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


const NextScreen = 'OnboardingChooseIndicator'

export const ObjectiveScreen: React.FC<Props> = ({ navigation, route }) => {
  const { updateUserObjectives, profile } = useUserProfile();
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const { setSlideIndex, setIsVisible } = useOnboardingProgressHeader();

  const handleNext = async () => {
    if (selectedObjective) {

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

      navigation.navigate(NextScreen);
      setSlideIndex(-1);
      setIsVisible(false)
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.navigate(NextScreen);
  };

  const renderObjectiveItem = ({ item }: { item: Objective }) => (
    <SelectionnableItem
      onPress={() => setSelectedObjective(item)}
      key={item.id}
      id={item.id}
      label={item.title}
      selected={selectedObjective?.id === item.id}>
    </SelectionnableItem>
  );

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: TW_COLORS.PRIMARY,
    };
  })

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: 'transparent',
      // color: TW_COLORS.WHITE,
      alignContent: 'left',
      textAlign: 'left'
    };
  })

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      {<BannerHeader
        hidden={HEADER_WITH_BANNER}
        hideHeader={PROGRESS_BAR_AND_HEADER}
        animatedStatusBarColor={animatedStatusBarColor}
        animatedTextColor={animatedTextColor}
        header={SHARED_HEADER || PROGRESS_BAR || PROGRESS_BAR_AND_HEADER ? undefined : <ProgressIndicator currentStep={2} totalSteps={3} />}
        title={'Quelle est votre priorité aujourd’hui dans Jardin Mental ?'}
        handleSkip={handleSkip}
      />}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* En-tête */}
        <View className="px-6 py-4">
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: TW_COLORS.TEXT_PRIMARY }}
          >
          </Text>
          <Text
            className={mergeClassNames(typography.textSmMedium, 'text-brand-900 text-left')}
          >
            Votre réponse nous aide à vous orienter vers un suivi plus utile.
          </Text>
        </View>
        <View className="px-6 py-4">
          {objectivesData.map((item) => renderObjectiveItem({ item }))}
        </View>
      </ScrollView>

      <NavigationButtons
        absolute={true}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        showSkip={true}
        nextDisabled={!selectedObjective}
        nextText="Continuer"
        skipText="Passer cette étape"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default ObjectiveScreen;
