import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { OnboardingV2ScreenProps, Difficulty } from '../types';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { useUserProfile } from '@/context/userProfile';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { HEADER_WITH_BANNER, PROGRESS_BAR, PROGRESS_BAR_AND_HEADER, SHARED_HEADER, TW_COLORS } from '@/utils/constants';
import BannerHeader from '../BannerHeader';
import { useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaViewWithOptionalHeader, useOnboardingProgressHeader } from '@/scenes/onboarding/ProgressHeader';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import SelectionnableItem from '@/components/SelectionnableItem';

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
    name: 'Mon Humeur',
    selected: false
  },
  {
    id: 'anxiety',
    name: `Mon niveau d'énergie`,
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

const NextScreen = 'PersonalizationObjective'

export const DifficultiesScreen: React.FC<Props> = ({ navigation }) => {
  const { updateUserDifficulties } = useUserProfile();
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(difficultiesData);
  const { setSlideIndex, setNextPath } = useOnboardingProgressHeader();

  // useEffect(() => {
  //   setNextPath(() => handleNext)
  // }, [])

  const handleSkip = useCallback(() => {
    navigation.navigate(NextScreen);
  }, [navigation]);

  useEffect(() => {
    setNextPath(handleSkip);
  }, [handleSkip])

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
    navigation.navigate(NextScreen);
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  // const animatedStatusBarColor = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: TW_COLORS.PRIMARY,
  //   };
  // })

  // const animatedTextColor = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: 'transparent',
  //     color: TW_COLORS.WHITE,
  //     alignContent: 'center',
  //     textAlign: 'center'
  //   };
  // })

  const selectedCount = selectedDifficulties.filter(d => d.selected).length;

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      {<BannerHeader
        hidden={HEADER_WITH_BANNER}
        hideHeader={PROGRESS_BAR_AND_HEADER}
        header={SHARED_HEADER || PROGRESS_BAR || PROGRESS_BAR_AND_HEADER ? undefined : <ProgressIndicator currentStep={2} totalSteps={3} />}
        title={'Sur quoi avez-vous ressenti une difficulté ou une gêne ces deux dernières semaines?'}
        handleSkip={handleSkip}
      />}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        <View className="px-6 py-4">
          <Text
            className={mergeClassNames(typography.textSmMedium, 'text-brand-900')}
          >
            Sélectionnez les domaines sur lesquels vous aimeriez travailler
          </Text>
        </View>

        <View style={{ paddingVertical: 8 }}>
          {selectedDifficulties.map((item) => (
            <SelectionnableItem
              key={item.id}
              onPress={() => toggleDifficulty(item.id)}
              id={item.id}
              label={item.name}
              selected={item.selected}>
            </SelectionnableItem>
          ))}
        </View>
      </ScrollView>
      <NavigationButtons
        absolute={true}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        nextDisabled={!selectedCount}
        showSkip={true}
        nextText="Continuer"
        skipText="Passer cette étape"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default DifficultiesScreen;
