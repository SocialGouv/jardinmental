import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { Difficulty, IndicatorItem, OnboardingV2ScreenProps } from '@/scenes/onboarding-v2/types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { useUserProfile } from '@/context/userProfile';
import { BASE_INDICATORS, INDICATEURS, INDICATEURS_HUMEUR, INDICATEURS_LES_PLUS_COURANTS, INDICATEURS_SOMMEIL } from '@/utils/liste_indicateurs.1';
import { generateIndicatorFromPredefinedIndicator, PredefineIndicatorSchemaType } from '@/entities/Indicator';
import localStorage from '@/utils/localStorage';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { DiaryDataContext } from '@/context/diaryData';
import { TW_COLORS } from '@/utils/constants';
import { useAnimatedStyle } from 'react-native-reanimated';
import BannerHeader from '../BannerHeader';
import { SafeAreaViewWithOptionalHeader } from '@/scenes/onboarding/ProgressHeader';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import SelectionnableItem from '@/components/SelectionnableItem';

// @todo generated with AI, see which values we want to keep
const DIFFICULTY_KEYWORDS: Record<string, string[]> = {
  sleep: ['sommeil', 'réveil', 'fatigue', 'endormissement'],
  mood: ['humeur', 'tristesse', 'colère', 'optimisme', 'plaisir'],
  anxiety: ['anxiété', 'angoisse', 'inquiétude', 'stress'],
  stress: ['stress', 'tension', 'irritabilité'],
  work_stress: ['stress', 'tension', 'irritabilité'],
  concentration: ['confiance', 'motivation', 'procrastination'],
  motivation: ['motivation', 'découragement'],
  social_relations: ['relation', 'soutien', 'seul', 'jugé', 'harcelé'],
  self_esteem: ['estime', 'confiance', 'culpabilité'],
  family_issues: ['famille', 'relation', 'soutien']
};

export function suggestIndicatorsForDifficulties(selectedDifficulties: Difficulty['id'][]): PredefineIndicatorSchemaType[] {
  const keywords = selectedDifficulties
    .flatMap(difficulty => DIFFICULTY_KEYWORDS[difficulty] || []);

  const uniqueIndicators = new Map<string, typeof INDICATEURS[number]>();

  INDICATEURS.forEach(ind => {
    const nameLower = ind.name.toLowerCase();
    if (keywords.some(keyword => nameLower.includes(keyword))) {
      uniqueIndicators.set(ind.uuid, ind);
    }
  });

  return Array.from(uniqueIndicators.values());
}

type Props = OnboardingV2ScreenProps<'OnboardingChooseIndicator'>;

export const OnboardingChooseIndicatorScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [showMoreIndicators, setShowMoreIndicators] = useState(false);
  const { profile, isLoading } = useUserProfile()
  const [diaryData] = useContext(DiaryDataContext);

  const recommendedIndicators = profile ? suggestIndicatorsForDifficulties(profile.selectedDifficulties.map(difficulty => (difficulty.id)))
    .filter(indicator => !BASE_INDICATORS.includes(indicator.uuid))
    : []
  const recommendedIndicatorsByCategory: Record<string, PredefineIndicatorSchemaType[]> = recommendedIndicators.reduce((prev, curr) => {
    if (!prev[curr.category]) {
      prev[curr.category] = [];
    }
    prev[curr.category].push(curr);
    return prev;
  }, {});
  const recommendedIndicatorsUuidList = recommendedIndicators.map(r => r.uuid)

  const popularIndicatorsByCategory: PredefineIndicatorSchemaType[] = INDICATEURS_LES_PLUS_COURANTS
    .filter(indicator => !recommendedIndicatorsUuidList.includes(indicator.uuid))
    .filter(indicator => !BASE_INDICATORS.includes(indicator.uuid))

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev => prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id])
  };

  const handleNext = async () => {
    const indicatorsToSave = INDICATEURS.filter(indicator => [...BASE_INDICATORS, ...selectedIndicators].includes(indicator.uuid))
    await localStorage.setIndicateurs(indicatorsToSave.map(generateIndicatorFromPredefinedIndicator));
    await localStorage.setOnboardingDone(true);
    const date = formatDay(beforeToday(0));
    const answers = diaryData[date] || {};
    const currentSurvey = { date, answers };
    return navigation.navigate("day-survey", {
      currentSurvey,
      editingSurvey: true,
      isOnboarding: true
    });
  };

  const renderIndicatorItem = (item: PredefineIndicatorSchemaType) => {
    const selected = selectedIndicators.includes(item.uuid)
    return <SelectionnableItem
      key={item.uuid}
      id={item.uuid}
      label={item.name}
      selected={selected}
      onPress={() => toggleIndicator(item.uuid)} />
  };

  const renderCategorySection = (categoryName: string, indicators: PredefineIndicatorSchemaType[]) => (
    <View key={categoryName} className="mb-6">
      <Text
        className={mergeClassNames(typography.textSmBold, 'text-brand-900 mb-3 mx-8 capitalize')}
      >
        {categoryName}
      </Text>
      {indicators.map(indicator => renderIndicatorItem(indicator))}
    </View>
  );

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
  //     textAlign: 'left'
  //   };
  // })

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeader
        // animatedStatusBarColor={animatedStatusBarColor}
        // animatedTextColor={animatedTextColor}    
        title={`Je vous recommande de suivre ces éléments au quotidien`}
        handlePrevious={() => navigation.goBack()}
        handleSkip={handleNext}
      />
      <ScrollView
        className="flex-1 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >


        {/* indicators grouped by categories */}
        <View>
          {Object.entries(recommendedIndicatorsByCategory).map(([category, indicators]) =>
            renderCategorySection(category, indicators)
          )}
        </View>
        <View className="px-4 mb-4">
          <TouchableOpacity
            onPress={() => setShowMoreIndicators(!showMoreIndicators)}
            className="py-3 px-4"
          >
            <Text
              className="text-center font-medium"
              style={{
                textDecorationLine: 'underline'
              }}
            >
              {showMoreIndicators ? 'Masquer' : 'Voir plus d\'indicateurs'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* popular indicators */}
        {showMoreIndicators && (
          <View className="mb-6">
            <Text
              className="text-xl font-bold mb-4 mx-4"
              style={{ color: TW_COLORS.TEXT_PRIMARY }}
            >
              Les plus suivis
            </Text>
            {popularIndicatorsByCategory.map(indicator => renderIndicatorItem(indicator))}
          </View>
        )}
        <View className="h-20" />
      </ScrollView>
      <NavigationButtons
        absolute={true}
        onNext={handleNext}
        nextDisabled={selectedIndicators.length === 0}
        nextText="Continuer"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default OnboardingChooseIndicatorScreen;
