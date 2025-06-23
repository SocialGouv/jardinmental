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
import { COLORS } from '@/utils/constants';

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
  const [diaryData ] = useContext(DiaryDataContext);

  const recommendedIndicators = profile ? suggestIndicatorsForDifficulties(profile.selectedDifficulties.map(difficulty => (difficulty.id)))
    .filter(indicator => !BASE_INDICATORS.includes(indicator.uuid))
  : [] 
  const recommendedIndicatorsByCategory:  Record<string, PredefineIndicatorSchemaType[]> = recommendedIndicators.reduce((prev, curr) => {
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
    console.log('CURRENT SURVEY', currentSurvey)
    return navigation.navigate("day-survey", {
      currentSurvey,
      editingSurvey: true,
      isOnboarding: true
    });
    // navigation.navigate('OnboardingReminder')

  };

  const renderIndicatorItem = (item: PredefineIndicatorSchemaType) => {
    const selected = selectedIndicators.includes(item.uuid)
    return <TouchableOpacity
      key={item.uuid}
      onPress={() => toggleIndicator(item.uuid)}
      className="mx-4 mb-3 p-4 rounded-xl border-2"
      style={{
        borderColor: selected ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
        backgroundColor: selected ? COLORS.PRIMARY + '10' : COLORS.WHITE,
      }}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text 
            className="text-lg font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {item.name}
          </Text>
        </View>
        {selected && (
          <View 
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  };

  const renderCategorySection = (categoryName: string, indicators: PredefineIndicatorSchemaType[]) => (
    <View key={categoryName} className="mb-6">
      <Text 
        className="text-lg font-semibold mb-3 mx-4 capitalize"
        style={{ color: COLORS.TEXT_PRIMARY }}
      >
        {categoryName}
      </Text>
      {indicators.map(indicator => renderIndicatorItem(indicator))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <CheckInHeader
          title="Observation du jour"
          onPrevious={() => navigation.goBack()}
          onSkip={handleNext}
          showPrevious={true}
          showSkip={true}
        />
        {/* En-tête */}
        <View className="px-6 py-6">
          <Text 
            className="text-2xl font-bold text-center mb-2"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Je vous propose de suivre
          </Text>
        </View>

        {/* Indicateurs groupés par catégorie */}
        <View>
          {Object.entries(recommendedIndicatorsByCategory).map(([category, indicators]) =>
            renderCategorySection(category, indicators)
          )}
        </View>

        {/* Bouton "Voir plus d'indicateurs" */}
        <View className="px-4 mb-4">
          <TouchableOpacity
            onPress={() => setShowMoreIndicators(!showMoreIndicators)}
            className="py-3 px-4"
          >
            <Text 
              className="text-center font-medium"
              style={{
                textDecorationLine: 'underline' }}
            >
              {showMoreIndicators ? 'Masquer' : 'Voir plus d\'indicateurs'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section "Les plus suivis" */}
        {showMoreIndicators && (
          <View className="mb-6">
            <Text 
              className="text-xl font-bold mb-4 mx-4"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Les plus suivis
            </Text>
            {popularIndicatorsByCategory.map(indicator => renderIndicatorItem(indicator))}
          </View>
        )}

        {/* Espacement pour le bouton fixe */}
        <View className="h-20" />
      </ScrollView>

      {/* Bouton fixe en bas */}
      <NavigationButtons
        onNext={handleNext}
        nextDisabled={selectedIndicators.length === 0}
        nextText="Continuer"
      />
    </SafeAreaView>
  );
};

export default OnboardingChooseIndicatorScreen;
