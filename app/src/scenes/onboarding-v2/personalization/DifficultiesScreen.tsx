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
import { INDICATOR_CATEGORIES_DATA } from '../data/helperData';
import { NEW_INDICATORS_CATEGORIES } from '@/utils/liste_indicateurs.1';

type Props = OnboardingV2ScreenProps<'PersonalizationDifficulties'>;

// @todo defined which difficulties we keep


const NextScreen = 'SubCategoriesScreen'



export const DifficultiesScreen: React.FC<Props> = ({ navigation }) => {
  const { updateUserDifficulties, profile } = useUserProfile();
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(Object.values(INDICATOR_CATEGORIES_DATA).map(d => ({
    ...d,
    selected: !!profile?.selectedDifficulties.includes(d.category)
  })).filter(cat => cat.category !== NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS))
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
    const selectedCategories = selected.map(d => d.category);
    await updateUserDifficulties(selectedCategories);
    if (selectedCategories.find(cat => INDICATOR_CATEGORIES_DATA[cat].subCat)) {
      navigation.navigate(NextScreen);
    } else {
      navigation.navigate('OnboardingChooseIndicator');
    }
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
        handlePrevious={handlePrevious}
      />}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}
      >
        <View className="px-6 py-4">
          <Text
            className={mergeClassNames(typography.textSmMedium, 'text-brand-900')}
          >
            Sélectionnez les domaines sur lesquels vous aimeriez travailler
          </Text>
        </View>

        <View className='px-4' style={{ paddingVertical: 8 }}>
          {selectedDifficulties.map((item) => (
            <SelectionnableItem
              icon={item.icon}
              key={item.id}
              description={item.description}
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
        headerContent={<View>
          {selectedCount >= 2 && <View className={'bg-[#FDF2E7] py-3 px-2 mb-1'}>
            <Text className={mergeClassNames(typography.textSmMedium, 'text-mood-1')}>
              Nous vous recommandons de ne pas choisir plus de 2 domaines pour commencer
            </Text>
          </View>}
          <View className='my-2'>
            <Text className={mergeClassNames(typography.textSmMedium, 'text-gray-700 text-center')}>Vous pourrez modifier cette sélection plus tard</Text>
          </View>
        </View>}
        // onPrevious={handlePrevious}
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
