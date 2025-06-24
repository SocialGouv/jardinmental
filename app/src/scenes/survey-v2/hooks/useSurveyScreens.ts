import { useMemo } from 'react';
import { Indicator } from '@/entities/Indicator';
import { translateCategories } from '@/utils/constants';
import { ENCOURAGEMENT_DATA } from '@/scenes/survey-v2/data/encouragementData';
import { SurveyScreenInterface, SurveyScreenType } from '@/entities/SurveyScreen';
import { BASE_INDICATORS } from '@/utils/liste_indicateurs.1';


const FEATURE_ADD_ENCOURAGEMENT = true

export const useSurveyScreens = (userIndicateurs: Indicator[], { isOnboarding } : { isOnboarding: boolean }): SurveyScreenInterface[] => {
  return useMemo(() => {
    const screens: SurveyScreenInterface[] = [];


    const filterOnboardingIndicator = (indicator: Indicator) => {
      if (isOnboarding) {
        // if we are not in the onboarding, we filter the "humeur" and "sleep" screens
        // @todo wait to know exactly how we share onboarding checkIn screens et and daily checkin
        // to adapt this clause
        return !BASE_INDICATORS.includes(indicator.uuid)
      }
      return true
    }
    
    // Filter active indicators and sort by position
    const activeIndicators = userIndicateurs
      .filter(indicator => indicator.active)
      .filter(filterOnboardingIndicator)
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
          title: ENCOURAGEMENT_DATA[categoryScreen.category]?.title || `Ok !`,
          description: ENCOURAGEMENT_DATA[categoryScreen.category]?.description || 'Merci d’avoir pris ce moment pour compléter cette information.',
          extraInfo: ENCOURAGEMENT_DATA[categoryScreen.category]?.extraInfo || undefined
        });
      });
    }

    // Create individual screens for uncategorized indicators
    const individualScreens = uncategorizedIndicators.map(indicator => ({
      id: `individual-${indicator.uuid}`,
      type: SurveyScreenType.individual as const,
      title: indicator.name,
      indicators: [indicator]
    }));
    screens.push(...individualScreens);

    // Add final screens
    screens.push(
      {
        id: 'context',
        type: SurveyScreenType.context,
        title: 'Contexte'
      },
      {
        id: 'toxic',
        type: SurveyScreenType.toxic,
        title: 'Substances'
      },
      {
        id: 'final',
        type: SurveyScreenType.encouragement,
        title: '👏 Un pas de plus vers une meilleure connaissance de vous.',
        description: 'Votre observation du jour a bien été enregistrée.'
      }
    );

    return screens;
  }, [userIndicateurs]);
};
