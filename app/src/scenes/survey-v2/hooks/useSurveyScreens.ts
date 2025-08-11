import { useMemo } from "react";
import { Indicator, INDICATORS_CATEGORIES } from "@/entities/Indicator";
import { translateCategories } from "@/utils/constants";
import { ENCOURAGEMENT_DATA } from "@/scenes/survey-v2/data/encouragementData";
import { SurveyScreenInterface, SurveyScreenType } from "@/entities/SurveyScreen";
import { BASE_INDICATORS, INDICATEURS_HUMEUR, NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { INDICATOR_CATEGORIES_DATA } from "@/scenes/onboarding-v2/data/helperData";

const FEATURE_ADD_ENCOURAGEMENT = false;

export const useSurveyScreens = (userIndicateurs: Indicator[], { isOnboarding }: { isOnboarding: boolean }): SurveyScreenInterface[] => {
  return useMemo(() => {
    const screens: SurveyScreenInterface[] = [];

    const filterOnboardingIndicator = (indicator: Indicator) => {
      if (isOnboarding) {
        // if we are not in the onboarding, we filter the "humeur" and "sleep" screens
        // @todo wait to know exactly how we share onboarding checkIn screens et and daily checkin
        // to adapt this clause
        return !BASE_INDICATORS.includes(indicator.uuid);
      }
      return true;
    };

    // Filter active indicators and sort by position
    const activeIndicators = [...userIndicateurs]
      .filter((indicator) => indicator.active)
      .filter(filterOnboardingIndicator)
      .sort((a, b) => a.position - b.position);

    // Group indicators by category
    const categoryGroups = new Map<NEW_INDICATORS_CATEGORIES, Indicator[]>();
    const uncategorizedIndicators: Indicator[] = [];

    activeIndicators.forEach((indicator) => {
      if (indicator.mainCategory) {
        if (!categoryGroups.has(indicator.mainCategory)) {
          categoryGroups.set(indicator.mainCategory, []);
        }
        categoryGroups.get(indicator.mainCategory)!.push(indicator);
      } else {
        uncategorizedIndicators.push(indicator);
      }
    });

    // Create category screens (sorted by minimum position of indicators in each category)
    const categoryScreens = Array.from(categoryGroups.entries())
      .map(([category, indicators]) => ({
        category,
        indicators: indicators.sort((a, b) => a.position - b.position),
        minPosition: Math.min(...indicators.map((i) => i.position)),
      }))
      .sort((a, b) => a.minPosition - b.minPosition)
      .map(({ category, indicators }) => ({
        id: `category-${category}`,
        type: SurveyScreenType.category,
        title: INDICATOR_CATEGORIES_DATA[category].label,
        indicators,
        category,
      }));

    // Add category screens with encouragement screens after each category
    categoryScreens.forEach((categoryScreen) => {
      screens.push(categoryScreen);
      if (FEATURE_ADD_ENCOURAGEMENT) {
        screens.push({
          id: `encouragement-after-${categoryScreen.category}`,
          type: SurveyScreenType.encouragement,
          title: ENCOURAGEMENT_DATA[categoryScreen.category]?.title || `Ok !`,
          description: ENCOURAGEMENT_DATA[categoryScreen.category]?.description || "Merci d’avoir pris ce moment pour compléter cette information.",
          extraInfo: ENCOURAGEMENT_DATA[categoryScreen.category]?.extraInfo || undefined,
        });
      }
    });

    // Create individual screens for uncategorized indicators
    const individualScreens = uncategorizedIndicators.map((indicator) => ({
      id: `individual-${indicator.uuid}`,
      type: SurveyScreenType.individual as const,
      title: indicator.name,
      indicators: [indicator],
    }));
    screens.push(...individualScreens);

    // Add final screens
    screens.push(
      // {
      //   id: 'context',
      //   type: SurveyScreenType.context,
      //   title: 'Contexte'
      // },
      // {
      //   id: 'toxic',
      //   type: SurveyScreenType.toxic,
      //   title: 'Substances'
      // },
      {
        id: "final",
        type: SurveyScreenType.encouragement,
        headingTitle: "👏 Un pas de plus vers une meilleure connaissance de vous.",
        title: "Votre observation du jour a bien été enregistrée.",
        description: "Vous pourrez revenir chaque jour pour observer votre état et suivre ces éléments.",
      }
    );

    return screens;
  }, [userIndicateurs]);
};
