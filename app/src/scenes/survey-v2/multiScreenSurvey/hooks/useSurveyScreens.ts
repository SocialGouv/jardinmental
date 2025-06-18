import { useMemo } from 'react';
import { Indicator } from '../../../../entities/Indicator';
import { translateCategories } from '../../../../utils/constants';
import { ENCOURAGEMENT_DATA } from '../../data/encouragementData';
import { SurveyScreenInterface, SurveyScreenType } from '../../../../entities/SurveyScreen';


const FEATURE_ADD_ENCOURAGEMENT = true

export const useSurveyScreens = (userIndicateurs: Indicator[]): SurveyScreenInterface[] => {
  return useMemo(() => {
    const screens: SurveyScreenInterface[] = [];
    
    // Filter active indicators and sort by position
    const activeIndicators = userIndicateurs
      .filter(indicator => indicator.active)
      .sort((a, b) => a.position - b.position);

    // Group indicators by category
    const categoryGroups = new Map<string, Indicator[]>();
    const uncategorizedIndicators: Indicator[] = [];

    activeIndicators.forEach(indicator => {
      if (indicator.category) {
        if (!categoryGroups.has(indicator.category)) {
          categoryGroups.set(indicator.category, []);
        }
        categoryGroups.get(indicator.category)!.push(indicator);
      } else {
        uncategorizedIndicators.push(indicator);
      }
    });

    // Create category screens (sorted by minimum position of indicators in each category)
    const categoryScreens = Array.from(categoryGroups.entries())
      .map(([category, indicators]) => ({
        category,
        indicators: indicators.sort((a, b) => a.position - b.position),
        minPosition: Math.min(...indicators.map(i => i.position))
      }))
      .sort((a, b) => a.minPosition - b.minPosition)
      .map(({ category, indicators }) => ({
        id: `category-${category}`,
        type: SurveyScreenType.category,
        title: translateCategories[category] || category,
        indicators,
        category
      }));

    // Add category screens with encouragement screens after each category
    if (FEATURE_ADD_ENCOURAGEMENT) {
      categoryScreens.forEach(categoryScreen => {
        screens.push(categoryScreen);
        screens.push({
          id: `encouragement-after-${categoryScreen.category}`,
          type: SurveyScreenType.encouragement,
          title: ENCOURAGEMENT_DATA[categoryScreen.category]?.title || `C'est noté`,
          description: ENCOURAGEMENT_DATA[categoryScreen.category]?.description || 'Merci d’avoir pris ce moment pour compléter cette information.',
          extraInfo: ENCOURAGEMENT_DATA[categoryScreen.category]?.extraInfo || undefined
        });
      });
    }

    // Create individual screens for uncategorized indicators
    const individualScreens = uncategorizedIndicators.map(indicator => ({
      id: `individual-${indicator.uuid}`,
      type: SurveyScreenType.individual,
      title: indicator.name,
      indicators: [indicator]
    }));

    screens.push(...individualScreens);

    // Add fixed final screens
    screens.push(
      // {
      //   id: 'goals',
      //   type: 'goals' as const,
      //   title: 'Mes objectifs'
      // },
      {
        id: 'context',
        type: 'context' as const,
        title: 'Contexte'
      },
      {
        id: 'toxic',
        type: 'toxic' as const,
        title: 'Substances'
      }
    );

    return screens;
  }, [userIndicateurs]);
};
