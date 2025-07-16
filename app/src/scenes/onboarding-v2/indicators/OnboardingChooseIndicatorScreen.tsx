import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { NavigationButtons } from '@/components/onboarding/NavigationButtons';
import { Difficulty, IndicatorItem, OnboardingV2ScreenProps } from '@/scenes/onboarding-v2/types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';
import { useUserProfile } from '@/context/userProfile';
import { BASE_INDICATORS, INDICATEURS, INDICATEURS_HUMEUR, INDICATEURS_LES_PLUS_COURANTS, INDICATEURS_SOMMEIL, INDICATORS, NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from '@/utils/liste_indicateurs.1';
import { generateIndicatorFromPredefinedIndicator, PredefineIndicatorSchemaType, INDICATOR_TYPE, INDICATORS_CATEGORIES, PredefineIndicatorSchema } from '@/entities/Indicator';
import localStorage from '@/utils/localStorage';
import { beforeToday, formatDay } from '@/utils/date/helpers';
import { DiaryDataContext } from '@/context/diaryData';
import { categories, TW_COLORS } from '@/utils/constants';
import { useAnimatedStyle } from 'react-native-reanimated';
import BannerHeader from '../BannerHeader';
import { SafeAreaViewWithOptionalHeader } from '@/scenes/onboarding/ProgressHeader';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import SelectionnableItem, { InputSelectionnableItem } from '@/components/SelectionnableItem';
import MultiSelect from 'react-native-multiple-select';
import { INDICATOR_CATEGORIES_DATA } from '../data/helperData';
import JMButton from '@/components/JMButton';
import InstructionText from '../InstructionText';
import IconBg from '@assets/svg/icon/IconBg'
import ChevronUp from '@assets/svg/icon/ChevronUp'
import ChevronDown from '@assets/svg/icon/ChevronDown'
import CircleCheckMark from '@assets/svg/icon/CircleCheckMark'
import ArrowIcon from '@assets/svg/icon/Arrow';
import { useBottomSheet } from '@/context/BottomSheetContext';
import IndicatorModal from './IndicatorModal';
import PlusIcon from '@assets/svg/icon/plus';

export function suggestIndicatorsForDifficulties(
  selectedDifficulties: NEW_INDICATORS_CATEGORIES[],
  selectedSubcategories: NEW_INDICATORS_SUBCATEGORIES[] = []
): PredefineIndicatorSchemaType[] {

  // Savoir si une de ses catégories a des sous-catégories sélectionnées

  // Filter indicators by selected categories and subcategories
  const filteredIndicators = INDICATORS.filter(indicator => {
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
    indicator: indicator.indicator || indicator.name || '',
    category: (indicator.categories[0] as unknown as INDICATORS_CATEGORIES),
    type: indicator.type as INDICATOR_TYPE || INDICATOR_TYPE.gauge,
    order: indicator.order as 'ASC' | 'DESC' || 'ASC'
  })).filter(ind => ind.uuid && ind.name);
}

type Props = OnboardingV2ScreenProps<'OnboardingChooseIndicator'>;

const NextRoute = 'OnboardingCheckInStart'

export const OnboardingChooseIndicatorScreen: React.FC<Props> = ({ navigation }) => {
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
  const [addedIndicators, setAddedIndicators] = useState<Record<NEW_INDICATORS_CATEGORIES, PredefineIndicatorSchemaType[]>>({})

  const { profile, isLoading } = useUserProfile()

  const recommendedIndicators = profile ? suggestIndicatorsForDifficulties(
    profile.selectedDifficulties,
    profile.selectedSubcategories || []
  ).filter(indicator => !BASE_INDICATORS.includes(indicator.uuid))
    : []
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(recommendedIndicators.map(indicator => indicator.uuid));

  const recommendedIndicatorsByCategory: Record<NEW_INDICATORS_CATEGORIES, PredefineIndicatorSchemaType[]> = recommendedIndicators.reduce((prev, curr) => {
    if (!prev[curr.category]) {
      prev[curr.category] = [];
    }
    prev[curr.category].push(curr);
    return prev;
  }, {} as Record<NEW_INDICATORS_CATEGORIES, PredefineIndicatorSchemaType[]>)
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
        const indicator = INDICATORS.find(ind => ind.uuid === id);
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

  const addIndicatorForCategory = (category: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorSchemaType[]) => {
    console.log('LCS ADD INDICATOR CATEGORY', indicators)
    setAddedIndicators(prev => ({
      ...prev,
      [category]: indicators
    }))
  }

  const renderIndicatorItem = (item: PredefineIndicatorSchemaType) => {
    const selected = selectedIndicators.includes(item.uuid)
    return <SelectionnableItem
      key={item.uuid}
      id={item.uuid}
      label={item.indicator}
      selected={selected}
      onPress={() => toggleIndicator(item.uuid)} />
  };

  const renderCategorySection = (categoryName: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorSchemaType[]) => (
    <CategoryCard
      indicators={indicators}
      categoryName={categoryName}
      renderIndicatorItem={renderIndicatorItem}
    />
  );

  return (
    <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
      <BannerHeader
        title={`Je vous propose de suivre ${recommendedIndicators.length} éléments importants`}
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
          {[NEW_INDICATORS_CATEGORIES.SUBSTANCE, NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR].filter(cat => profile?.selectedDifficulties.includes(cat)).map(cat => {
            return <CategoryCard
              type={'select-and-input'}
              indicators={addedIndicators[cat]}
              renderIndicatorItem={renderIndicatorItem}
              addIndicatorForCategory={addIndicatorForCategory}
              categoryName={cat} />
          })}
          {profile?.selectedDifficulties.includes(NEW_INDICATORS_CATEGORIES.LIFE_EVENT) && (
            <CategoryCard
              type="input"
              categoryName={NEW_INDICATORS_CATEGORIES.LIFE_EVENT} />
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

const MultiInput = ({
  categoryName,
  renderIndicatorItem,
  addIndicatorForCategory,
  indicators,
  type
}: {
  type: 'select' | 'select-and-input' | 'input'
  categoryName: NEW_INDICATORS_CATEGORIES,
  indicators?: PredefineIndicatorSchemaType[],
  addIndicatorForCategory?: (category: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorSchemaType[]) => void,
  renderIndicatorItem?: (item: PredefineIndicatorSchemaType) => JSX.Element
}) => {

  const [addedInputs, setAddedInputs] = useState([''])

  return <View className='flex'>
    {addedInputs.map((input, index) => <View className='rounded rounded-lg flex-1 flex-row mb-2'>
      <TextInput
        onChangeText={(text) => {
          addedInputs[index] = text
          setAddedInputs(addedInputs)
        }}
        placeholder={INDICATOR_CATEGORIES_DATA[categoryName].description}
        className={mergeClassNames(typography.textMdRegular, 'text-left border border-gray-300 p-2 rounded rounded-lg flex-1')} />
      <TouchableOpacity style={
        {
          position: 'absolute',
          right: 10,
          bottom: 5
        }
      } onPress={() => {
        //onPress(value)
        setAddedInputs((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
      }}>
        <Text className={mergeClassNames(typography.textMdSemibold, 'text-brand-800')}>Supprimer</Text>
      </TouchableOpacity>
    </View>)}
    <TouchableOpacity onPress={() => {
      setAddedInputs(prev => ([...prev, '']))
    }} className='flex-row ml-auto items-center justify-center mt-2'>
      <Text className={mergeClassNames(typography.textMdSemibold, 'text-brand-950 mr-1')}>Ajouter un autre événement</Text>
      <PlusIcon color={TW_COLORS.BRAND_700} />
    </TouchableOpacity>
  </View>
}


const CategoryCard = ({
  categoryName,
  renderIndicatorItem,
  addIndicatorForCategory,
  indicators,
  type
}: {
  type: 'select' | 'select-and-input' | 'input'
  categoryName: NEW_INDICATORS_CATEGORIES,
  indicators?: PredefineIndicatorSchemaType[],
  addIndicatorForCategory?: (category: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorSchemaType[]) => void,
  renderIndicatorItem?: (item: PredefineIndicatorSchemaType) => JSX.Element
}) => {

  const [showIndicators, setShowMoreIndicators] = useState<boolean>(false)
  const { showBottomSheet, closeBottomSheet } = useBottomSheet()

  return <View key={categoryName}
    className="mb-6 w-full rounded rounded-3xl border border-1 border-gray-300 bg-gray-50 py-4">
    <View className='px-4 gap-6 flex-colum mb-6'>
      <View className="flex-row items-center mb-2">
        <View className="items-center justify-center">
          <IconBg
            type={categoryName}
            frontSquareColor={TW_COLORS.GRAY_200}
            backSquareColor={TW_COLORS.BRAND_600}
          />
        </View>
        {indicators && <View className='ml-auto rounded py-1 px-2 border border-brand-800 bg-white flex-row justify-content items-center'>
          <Text
            className={mergeClassNames(
              typography.textSmBold,
              'text-brand-900 mr-2'
            )}
          >
            {indicators.length} indicateur{indicators.length > 1 ? 's' : ''}
          </Text>
          <CircleCheckMark />
        </View>}
        {!indicators && <View className='ml-auto rounded py-1 px-2 border border-brand-800 bg-gray-200 flex-row justify-content items-center'>
          <Text
            className={mergeClassNames(
              typography.textSmBold,
              'text-brand-900'
            )}
          >
            à préciser
          </Text>
        </View>}
      </View>
      <Text
        className={mergeClassNames(
          typography.textLgBold,
          'text-brand-900'
        )}
      >
        {INDICATOR_CATEGORIES_DATA[categoryName].name || categoryName}
      </Text>
      <Text className={mergeClassNames(typography.textMdRegular, 'text-gray-800 text-left')}>
        {INDICATOR_CATEGORIES_DATA[categoryName].indicatorText}
      </Text>
      {indicators && <TouchableOpacity
        onPress={() => setShowMoreIndicators(!showIndicators)}
        className='flex-row items-center justify-center'>
        <Text className={mergeClassNames(typography.textMdSemibold, 'text-brand-950 mr-2')}>Afficher les indicateurs</Text>
        <ChevronDown color={TW_COLORS.BRAND_700} />
      </TouchableOpacity>
      }
      {indicators && showIndicators && <View className='flex-column h-auto'>
        {indicators.map(indicator => {
          console.log('indicator', indicator)
          return renderIndicatorItem(indicator)
        })}
      </View>
      }
      {
        type === 'select-and-input' && <View className='flex-row'>
          <TouchableOpacity onPress={() => {
            showBottomSheet(<IndicatorModal
              category={categoryName}
              onClose={(categoryName: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorSchemaType[]) => {
                if (typeof addIndicatorForCategory === 'function') {
                  addIndicatorForCategory(categoryName, indicators)
                  closeBottomSheet()
                }
              }}
            />)
          }} className='flex-row ml-auto items-center justify-center'>
            <Text className={mergeClassNames(typography.textMdSemibold, 'text-brand-950 mr-1')}>Préciser</Text>
            <ArrowIcon color={TW_COLORS.BRAND_700} />
          </TouchableOpacity>
        </View>
      }
      {
        type === 'input' && <View className='flex-column'><MultiInput
          categoryName={categoryName} /></View>
      }
    </View>
  </View>
}


export default OnboardingChooseIndicatorScreen;
