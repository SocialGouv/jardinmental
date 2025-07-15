import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { Difficulty, IndicatorItem, OnboardingV2ScreenProps } from '@/scenes/onboarding-v2/types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { useUserProfile } from '@/context/userProfile';
import { BASE_INDICATORS, INDICATEURS, INDICATEURS_HUMEUR, INDICATEURS_LES_PLUS_COURANTS, INDICATEURS_SOMMEIL, indicators, NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from '@/utils/liste_indicateurs.1';
import { generateIndicatorFromPredefinedIndicator, PredefineIndicatorSchemaType, INDICATOR_TYPE, INDICATORS_CATEGORIES } from '@/entities/Indicator';
import localStorage from '@/utils/localStorage';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { DiaryDataContext } from '@/context/diaryData';
import { categories, TW_COLORS } from '@/utils/constants';
import { useAnimatedStyle } from 'react-native-reanimated';
import BannerHeader from '../BannerHeader';
import { SafeAreaViewWithOptionalHeader } from '@/scenes/onboarding/ProgressHeader';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import SelectionnableItem from '@/components/SelectionnableItem';
import MultiSelect from 'react-native-multiple-select';
import { INDICATOR_CATEGORIES_DATA } from '../data/helperData';
import JMButton from '@/components/JMButton';
import InstructionText from '../InstructionText';

export function suggestIndicatorsForDifficulties(
  selectedDifficulties: NEW_INDICATORS_CATEGORIES[],
  selectedSubcategories: NEW_INDICATORS_SUBCATEGORIES[] = []
): PredefineIndicatorSchemaType[] {

  // Savoir si une de ses catégories a des sous-catégories sélectionnées

  // Filter indicators by selected categories and subcategories
  const filteredIndicators = indicators.filter(indicator => {
    const hasMatchingCategory = indicator.categories?.some(cat => selectedDifficulties.includes(cat));

    // Trouver les sous-catégories sélectionnées qui appartiennent à une des catégories de l'indicateur
    const relevantSubcategories = selectedSubcategories.filter(subcat =>
      indicator.subcategories?.includes(subcat)
    );

    const requiresSubcategoryMatch = !!indicator.subcategories?.length

    const matchesSubcategory = relevantSubcategories.length > 0;

    return (
      hasMatchingCategory &&
      (!requiresSubcategoryMatch || matchesSubcategory) &&
      indicator.uuid
    );
  });

  // Sort by priority (P0 first, then P1, then P2)
  const sortedIndicators = filteredIndicators.sort((a, b) => {
    const priorityA = a.priority ?? 999;
    const priorityB = b.priority ?? 999;
    return priorityA - priorityB;
  });

  // Get P0 indicators first
  const p0Indicators = sortedIndicators.filter(ind => ind.priority === 0);

  // If we have less than 7 P0 indicators, add P1 indicators
  let finalIndicators = [...p0Indicators];
  if (finalIndicators.length < 7) {
    const p1Indicators = sortedIndicators.filter(ind => ind.priority === 1);
    const remainingSlots = 7 - finalIndicators.length;
    finalIndicators = [...finalIndicators, ...p1Indicators.slice(0, remainingSlots)];
  }

  // Convert to PredefineIndicatorSchemaType format
  return finalIndicators.map(indicator => ({
    uuid: indicator.uuid || '',
    name: indicator.indicator || indicator.name || '',
    category: (indicator.categories[0] as unknown as INDICATORS_CATEGORIES),
    type: indicator.type as INDICATOR_TYPE || INDICATOR_TYPE.gauge,
    order: indicator.order as 'ASC' | 'DESC' || 'ASC'
  })).filter(ind => ind.uuid && ind.name);
}

type Props = OnboardingV2ScreenProps<'OnboardingChooseIndicator'>;

const NextRoute = 'OnboardingCheckInStart'

export const OnboardingChooseIndicatorScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [showMoreIndicators, setShowMoreIndicators] = useState(false);
  const [customIndicators, setCustomIndicators] = useState<PredefineIndicatorSchemaType[]>([]);

  // Special category states - organized by category
  const [selectedItemsByCategory, setSelectedItemsByCategory] = useState<Record<NEW_INDICATORS_CATEGORIES, string[]>>({
    [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: [],
    [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: [],
    [NEW_INDICATORS_CATEGORIES.SLEEP]: [],
    [NEW_INDICATORS_CATEGORIES.WORK]: [],
    [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: [],
    [NEW_INDICATORS_CATEGORIES.EMOTIONS]: [],
    [NEW_INDICATORS_CATEGORIES.ENERGY]: [],
    [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: [],
    [NEW_INDICATORS_CATEGORIES.FOOD]: [],
    [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: [],
    [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: [],
    [NEW_INDICATORS_CATEGORIES.COGNITIVE]: [],
  });
  const [customNames, setCustomNames] = useState<Record<NEW_INDICATORS_CATEGORIES, string>>({
    [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: '',
    [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: '',
    [NEW_INDICATORS_CATEGORIES.SLEEP]: '',
    [NEW_INDICATORS_CATEGORIES.WORK]: '',
    [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: '',
    [NEW_INDICATORS_CATEGORIES.EMOTIONS]: '',
    [NEW_INDICATORS_CATEGORIES.ENERGY]: '',
    [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: '',
    [NEW_INDICATORS_CATEGORIES.FOOD]: '',
    [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: '',
    [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: '',
    [NEW_INDICATORS_CATEGORIES.COGNITIVE]: '',
  });
  const [lifeEventName, setLifeEventName] = useState('');
  const [lifeEventIndicatorUUID, setLifeEventIndicatorUUID] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState<Record<NEW_INDICATORS_CATEGORIES, boolean>>({
    [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: false,
    [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: false,
    [NEW_INDICATORS_CATEGORIES.SLEEP]: false,
    [NEW_INDICATORS_CATEGORIES.WORK]: false,
    [NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS]: false,
    [NEW_INDICATORS_CATEGORIES.EMOTIONS]: false,
    [NEW_INDICATORS_CATEGORIES.ENERGY]: false,
    [NEW_INDICATORS_CATEGORIES.INTRUSIVE_THOUGHTS]: false,
    [NEW_INDICATORS_CATEGORIES.FOOD]: false,
    [NEW_INDICATORS_CATEGORIES.SOCIAL_RELATIONS]: false,
    [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: false,
    [NEW_INDICATORS_CATEGORIES.COGNITIVE]: false,
  });

  // State for managing custom inputs for indicators with needCustom
  const [customInputs, setCustomInputs] = useState<Record<string, string[]>>({});
  const [currentCustomInput, setCurrentCustomInput] = useState<Record<string, string>>({});

  const { profile, isLoading } = useUserProfile()
  console.log('=== LCS PROFILE =====', profile)

  const recommendedIndicators = profile ? suggestIndicatorsForDifficulties(
    profile.selectedDifficulties,
    profile.selectedSubcategories || []
  ).filter(indicator => !BASE_INDICATORS.includes(indicator.uuid))
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

  // Helper function to generate UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Create custom indicator
  const createCustomIndicator = (name: string, category: INDICATORS_CATEGORIES): PredefineIndicatorSchemaType => {
    return {
      uuid: generateUUID(),
      name,
      category,
      type: INDICATOR_TYPE.boolean,
      order: 'DESC' as const
    };
  };

  // Handle selection for specific categories
  const handleCategorySelection = (category: NEW_INDICATORS_CATEGORIES, selectedItems: string[]) => {
    setSelectedItemsByCategory(prev => ({
      ...prev,
      [category]: selectedItems
    }));

    // Update main selected indicators
    setSelectedIndicators(prev => {
      // Remove previous selections for this category
      const otherCategorySelections = prev.filter(id => {
        const indicator = indicators.find(ind => ind.uuid === id);
        return !indicator?.categories.includes(category);
      });

      // Add new selections for this category
      return [...otherCategorySelections, ...selectedItems];
    });
  };

  // Add custom indicator for specific category
  const addCustomIndicator = (category: NEW_INDICATORS_CATEGORIES) => {
    const customName = customNames[category];
    if (customName.trim()) {
      const customIndicator = createCustomIndicator(customName, INDICATORS_CATEGORIES['Comportements']);
      setCustomIndicators(prev => [...prev, customIndicator]);
      setSelectedIndicators(prev => [...prev, customIndicator.uuid]);
      setCustomNames(prev => ({ ...prev, [category]: '' }));
      setShowOtherInput(prev => ({ ...prev, [category]: false }));
    }
  };

  // Handle custom input for indicators with needCustom
  const addCustomInputForIndicator = (indicatorId: string) => {
    const inputValue = currentCustomInput[indicatorId];
    if (inputValue && inputValue.trim()) {
      const customIndicator = createCustomIndicator(inputValue, INDICATORS_CATEGORIES['Comportements']);
      setCustomIndicators(prev => [...prev, customIndicator]);
      setSelectedIndicators(prev => [...prev, customIndicator.uuid]);

      // Add to custom inputs list for this indicator
      setCustomInputs(prev => ({
        ...prev,
        [indicatorId]: [...(prev[indicatorId] || []), inputValue]
      }));

      // Clear current input
      setCurrentCustomInput(prev => ({ ...prev, [indicatorId]: '' }));
    }
  };

  // Add life event indicator
  const addLifeEventIndicator = () => {
    if (lifeEventName.trim()) {
      const customIndicator = createCustomIndicator(lifeEventName, INDICATORS_CATEGORIES['Emotions/sentiments']);
      setCustomIndicators(prev => [...prev, customIndicator]);
      setSelectedIndicators(prev => [...prev, customIndicator.uuid]);
      setLifeEventName('');
    }
  };

  const handleNext = async () => {
    // Get predefined indicators
    const predefinedIndicatorsToSave = INDICATEURS.filter(indicator =>
      [...BASE_INDICATORS, ...selectedIndicators].includes(indicator.uuid)
    );

    // Get custom indicators that are selected
    const customIndicatorsToSave = customIndicators.filter(indicator =>
      selectedIndicators.includes(indicator.uuid)
    );

    if (lifeEventName.trim()) {
      const lifeEventIndicator = createCustomIndicator(lifeEventName, INDICATORS_CATEGORIES['Emotions/sentiments']);
      customIndicatorsToSave.push(lifeEventIndicator)
    }

    // Convert predefined indicators
    const predefinedConverted = predefinedIndicatorsToSave.map(generateIndicatorFromPredefinedIndicator);

    // Convert custom indicators
    const customConverted = customIndicatorsToSave.map(indicator => ({
      uuid: indicator.uuid,
      name: indicator.name,
      category: indicator.category,
      categories: indicator.categories,
      type: indicator.type,
      order: indicator.order,
      version: 1,
      active: true,
      position: 0,
      created_at: new Date()
    }));

    // Combine all indicators
    const allIndicators = [...predefinedConverted, ...customConverted];

    await localStorage.setIndicateurs(allIndicators);
    await localStorage.setOnboardingDone(true);
    navigation.navigate(NextRoute);
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
    <View key={categoryName} className="mb-6 w-full">
      <View className="flex-row items-center">
        {INDICATOR_CATEGORIES_DATA[categoryName].icon && (
          <View className="w-10 h-10 items-center justify-center">
            {React.createElement(INDICATOR_CATEGORIES_DATA[categoryName].icon)}
          </View>
        )}
        <Text
          className={mergeClassNames(
            typography.textSmBold,
            'text-brand-900 capitalize'
          )}
        >
          {INDICATOR_CATEGORIES_DATA[categoryName].label || categoryName}
        </Text>
      </View>
      {indicators.map(indicator => renderIndicatorItem(indicator))}
    </View>
  );

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeader
        // animatedStatusBarColor={animatedStatusBarColor}
        // animatedTextColor={animatedTextColor}    
        title={`Je vous propose de suivre 9 éléments importants`}
        handlePrevious={() => navigation.goBack()}
        handleSkip={handleNext}
      />
      <ScrollView
        className="flex-1 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
      <View className='px-6'>
        <InstructionText>Voici les éléments que je vous propose de suivre au quotidien. Vous pouvez en enlever ou en ajouter.</InstructionText>
      </View>
        {/* indicators grouped by categories */}
        <View className="px-2">
          {Object.entries(recommendedIndicatorsByCategory)
          .filter(([cat]) => {
            return ![NEW_INDICATORS_CATEGORIES.SUBSTANCE, NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR].includes(cat)
          }).map(([category, indicators]) =>
            renderCategorySection(category, indicators)
          )}
        </View>

        {[NEW_INDICATORS_CATEGORIES.SUBSTANCE, NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR].filter(cat => profile?.selectedDifficulties.includes(cat)).map(cat => {
          const categoryLabel = cat === NEW_INDICATORS_CATEGORIES.SUBSTANCE ? 'Consommation de produits' : 'Comportements à risque';
          const categoryItems = indicators.filter(indicator => indicator.categories.includes(cat));
          const selectedItems = selectedItemsByCategory[cat];

          return (
            <View key={cat} className="mb-6 px-6">
              <Text className={mergeClassNames(typography.textSmBold, 'text-brand-900 mb-3 capitalize')}>
                {categoryLabel}
              </Text>
              <MultiSelect
                items={categoryItems.map(item => ({
                  id: item.uuid,
                  name: item.indicator
                }))}
                uniqueKey="id"
                onSelectedItemsChange={(items) => handleCategorySelection(cat, items)}
                selectedItems={selectedItems}
                selectText={`Sélectionner ${categoryLabel.toLowerCase()}...`}
                searchInputPlaceholderText="Rechercher..."
                displayKey="name"
                // Styling to match SelectionnableItem
                styleDropdownMenu={{
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selectedItems.length > 0 ? '#158993' : '#D1D5DB',
                  backgroundColor: selectedItems.length > 0 ? '#F0FDFF' : 'transparent',
                  height: 50,
                  paddingLeft: 10,
                  marginHorizontal: 0,
                  marginBottom: 12,
                }}
                styleDropdownMenuSubsection={{
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  backgroundColor: 'transparent',
                }}
                styleRowList={{
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  marginBottom: 12,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: '#D1D5DB',
                  backgroundColor: 'transparent',
                }}
                styleTextDropdown={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#134449',
                  textAlign: 'left',
                }}
                styleTextDropdownSelected={{
                  color: '#134449',
                  fontWeight: '500',
                }}
                styleInputGroup={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  marginBottom: 16,
                }}
                searchInputStyle={{
                  color: '#134449',
                  fontSize: 16,
                  paddingHorizontal: 0,
                  padding: 5,
                }}
                tagRemoveIconColor="#158993"
                tagBorderColor="#158993"
                tagTextColor="#134449"
                selectedItemTextColor="#134449"
                selectedItemIconColor="#158993"
                itemTextColor="#134449"
                submitButtonColor="#158993"
                hideSubmitButton={true}
                submitButtonText="Valider"
                styleMainWrapper={{
                  backgroundColor: 'transparent',
                }}
                styleSelectorContainer={{
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selectedItems.length > 0 ? '#158993' : '#D1D5DB',
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                }}
              />

              {/* Show custom inputs for indicators with needCustom */}
              {selectedItems.map(itemId => {
                const indicator = categoryItems.find(item => item.uuid === itemId);
                const originalIndicator = indicators.find(ind => ind.uuid === itemId);

                if (originalIndicator?.needCustom) {
                  return (
                    <View key={itemId} className="mt-3">
                      <Text className={mergeClassNames(typography.textSmBold, 'text-brand-900 mb-2')}>
                        Vous avez sélectionné autre :
                      </Text>

                      {/* Show existing custom inputs */}
                      {customInputs[itemId]?.map((customInput, index) => (
                        <View key={index} className="mb-2 p-3 bg-gray-100 rounded-lg">
                          <Text className="text-gray-700">{customInput}</Text>
                        </View>
                      ))}

                      {/* Input for new custom entry */}
                      <TextInput
                        className="border border-gray-300 rounded-lg p-3 mb-2"
                        placeholder="Préciser..."
                        value={currentCustomInput[itemId] || ''}
                        onChangeText={(text) => setCurrentCustomInput(prev => ({ ...prev, [itemId]: text }))}
                      />
                      <JMButton
                        title='Ajouter'
                        onPress={() => addCustomInputForIndicator(itemId)}
                      />
                    </View>
                  );
                }
                return null;
              })}

              {showOtherInput[cat] && (
                <View className="mt-3">
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-2"
                    placeholder={`Nommer ce ${categoryLabel.toLowerCase()}...`}
                    value={customNames[cat]}
                    onChangeText={(text) => setCustomNames(prev => ({ ...prev, [cat]: text }))}
                  />
                  <TouchableOpacity
                    className="bg-blue-500 rounded-lg p-3"
                    onPress={() => addCustomIndicator(cat)}
                  >
                    <Text className="text-white text-center font-medium">Ajouter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {profile?.selectedDifficulties.includes(NEW_INDICATORS_CATEGORIES.LIFE_EVENT) && (
          <View className="mb-6 px-6">
            <Text className={mergeClassNames(typography.textSmBold, 'text-brand-900 mb-3 capitalize')}>
              Évènement de vie difficile
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-2"
              // onChange={addLifeEventIndicator}
              placeholder="Nommer cet évènement..."
              value={lifeEventName}
              onChangeText={setLifeEventName}
            />
          </View>
        )}

        {/* Custom indicators */}
        {/* {customIndicators.length > 0 && (
          <View className="mb-6">
            <Text className={mergeClassNames(typography.textSmBold, 'text-brand-900 mb-3 mx-8 capitalize')}>
              Indicateurs personnalisés
            </Text>
            {customIndicators.map(indicator => renderIndicatorItem(indicator))}
          </View>
        )} */}
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
        showPrevious={true}
        onPrevious={() => (
          navigation.goBack()
        )}
        onNext={handleNext}
        nextDisabled={selectedIndicators.length === 0}
        nextText="Continuer"
      />
    </SafeAreaViewWithOptionalHeader>
  );
};

export default OnboardingChooseIndicatorScreen;
