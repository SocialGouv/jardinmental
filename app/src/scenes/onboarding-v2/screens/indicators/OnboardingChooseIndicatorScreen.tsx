import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationButtons } from '../../components/NavigationButtons';
import { useOnboarding } from '../../context/OnboardingContext';
import { COLORS } from '../../constants';
import { IndicatorItem, OnboardingV2ScreenProps } from '../../types';

// Données des indicateurs selon les spécifications
const indicatorsData: IndicatorItem[] = [
  // Catégorie Sommeil
  {
    id: 'sleep_wake_ups',
    name: 'Vos réveils nocturnes',
    category: 'sommeil',
    selected: false
  },
  {
    id: 'sleep_ease',
    name: 'Votre facilité à vous endormir',
    category: 'sommeil',
    selected: false
  },
  // Catégorie Émotions
  {
    id: 'irritability',
    name: 'Votre niveau d\'irritabilité',
    category: 'émotions',
    selected: false
  },
  {
    id: 'anxiety_level',
    name: 'Votre niveau d\'anxiété',
    category: 'émotions',
    selected: false
  },
  // Catégorie Comportements
  {
    id: 'avoidance',
    name: 'Évitements de certaines situations',
    category: 'comportements',
    selected: false
  }
];

// Indicateurs "Les plus suivis"
const popularIndicatorsData: IndicatorItem[] = [
  {
    id: 'anxiety_popular',
    name: 'Anxiété',
    description: 'Suivez votre niveau d\'anxiété au quotidien',
    category: 'populaire',
    selected: false
  },
  {
    id: 'stress_popular',
    name: 'Stress',
    description: 'Mesurez votre niveau de stress',
    category: 'populaire',
    selected: false
  },
  {
    id: 'anger_popular',
    name: 'Colère',
    description: 'Observez vos épisodes de colère',
    category: 'populaire',
    selected: false
  }
];

// Icônes par catégorie
const categoryIcons: Record<string, string> = {
  sommeil: '😴',
  émotions: '💭',
  comportements: '🎯',
  populaire: '⭐'
};

type Props = OnboardingV2ScreenProps<'OnboardingChooseIndicator'>;

export const OnboardingChooseIndicatorScreen: React.FC<Props> = ({ navigation }) => {
  const { updateIndicators } = useOnboarding();
  const [selectedIndicators, setSelectedIndicators] = useState<IndicatorItem[]>(indicatorsData);
  const [selectedPopularIndicators, setSelectedPopularIndicators] = useState<IndicatorItem[]>(popularIndicatorsData);
  const [showMoreIndicators, setShowMoreIndicators] = useState(false);

  const toggleIndicator = (id: string, isPopular: boolean = false) => {
    if (isPopular) {
      setSelectedPopularIndicators(prev =>
        prev.map(indicator =>
          indicator.id === id
            ? { ...indicator, selected: !indicator.selected }
            : indicator
        )
      );
    } else {
      setSelectedIndicators(prev =>
        prev.map(indicator =>
          indicator.id === id
            ? { ...indicator, selected: !indicator.selected }
            : indicator
        )
      );
    }
  };

  const handleNext = () => {
    const allSelected = [
      ...selectedIndicators.filter(i => i.selected),
      ...selectedPopularIndicators.filter(i => i.selected)
    ];
    updateIndicators(allSelected);
    // Navigation vers l'étape suivante
    console.log('Indicateurs sélectionnés:', allSelected);
    navigation.navigate('OnboardingReminder')
  };

  const selectedCount = selectedIndicators.filter(i => i.selected).length + 
                       selectedPopularIndicators.filter(i => i.selected).length;

  // Grouper les indicateurs par catégorie
  const groupedIndicators = selectedIndicators.reduce((acc, indicator) => {
    if (!acc[indicator.category]) {
      acc[indicator.category] = [];
    }
    acc[indicator.category].push(indicator);
    return acc;
  }, {} as Record<string, IndicatorItem[]>);

  const renderIndicatorItem = (item: IndicatorItem, isPopular: boolean = false) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => toggleIndicator(item.id, isPopular)}
      className="mx-4 mb-3 p-4 rounded-xl border-2"
      style={{
        borderColor: item.selected ? COLORS.PRIMARY : COLORS.GRAY_LIGHT,
        backgroundColor: item.selected ? COLORS.PRIMARY + '10' : COLORS.WHITE,
      }}
    >
      <View className="flex-row items-center">
        <Text className="text-2xl mr-3">
          {categoryIcons[item.category] || '📝'}
        </Text>
        <View className="flex-1">
          <Text 
            className="text-lg font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {item.name}
          </Text>
          {item.description && (
            <Text 
              className="text-sm mt-1"
              style={{ color: COLORS.TEXT_SECONDARY }}
            >
              {item.description}
            </Text>
          )}
        </View>
        {item.selected && (
          <View 
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategorySection = (categoryName: string, indicators: IndicatorItem[]) => (
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
          {Object.entries(groupedIndicators).map(([category, indicators]) =>
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
            {selectedPopularIndicators.map(indicator => renderIndicatorItem(indicator, true))}
          </View>
        )}

        {/* Espacement pour le bouton fixe */}
        <View className="h-20" />
      </ScrollView>

      {/* Bouton fixe en bas */}
      <NavigationButtons
        onNext={handleNext}
        nextDisabled={selectedCount === 0}
        nextText="Continuer"
      />
    </SafeAreaView>
  );
};

export default OnboardingChooseIndicatorScreen;
