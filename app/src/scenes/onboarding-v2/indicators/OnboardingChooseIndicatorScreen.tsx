import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { NavigationButtons } from "@/components/onboarding/NavigationButtons";
import { OnboardingV2ScreenProps } from "@/scenes/onboarding-v2/types";
import { useUserProfile } from "@/context/userProfile";
import {
  BASE_INDICATORS,
  INDICATEURS_HUMEUR,
  INDICATEURS_SOMMEIL,
  INDICATORS,
  NEW_INDICATORS_CATEGORIES,
  NEW_INDICATORS_SUBCATEGORIES,
} from "@/utils/liste_indicateurs.1";
import { generateIndicatorFromPredefinedIndicator, PredefineIndicatorV2SchemaType, Indicator } from "@/entities/Indicator";
import localStorage from "@/utils/localStorage";
import { TW_COLORS } from "@/utils/constants";
import { useOnboardingProgressHeader } from "@/scenes/onboarding/ProgressHeader";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import SelectionnableItem from "@/components/SelectionnableItem";
import { INDICATOR_CATEGORIES_DATA } from "../data/helperData";
import InstructionText from "../InstructionText";
import IconBg from "@assets/svg/icon/IconBg";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { useBottomSheet } from "@/context/BottomSheetContext";
import IndicatorModal from "./IndicatorModal";
import PlusIcon from "@assets/svg/icon/plus";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { useFocusEffect } from "@react-navigation/native";
import AlertBanner from "../AlertBanner";

const BASE_INDICATORS_FOR_CUSTOM_CATEGORIES = {
  [NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR]: [INDICATORS.find((ind) => ind.uuid === "1d4c3f59-dc3e-4b45-ae82-2ea77a62e6c6")],
  [NEW_INDICATORS_CATEGORIES.LIFE_EVENT]: [INDICATORS.find((ind) => ind.uuid === "9f8cfd7a-bf90-4b45-8f84-4f5f1a0e8f88")],
  [NEW_INDICATORS_CATEGORIES.SUBSTANCE]: [INDICATORS.find((ind) => ind.uuid === "ac7c85b6-e015-4b46-bd14-13e01f7d7a85")],
};

const INDICATORS_WITH_CUSTOM_OPTIONS = [
  NEW_INDICATORS_CATEGORIES.SUBSTANCE,
  NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR,
  NEW_INDICATORS_CATEGORIES.LIFE_EVENT,
];

export function suggestIndicatorsForDifficulties(
  selectedDifficulties: NEW_INDICATORS_CATEGORIES[],
  selectedSubcategories: NEW_INDICATORS_SUBCATEGORIES[] = []
): PredefineIndicatorV2SchemaType[] {
  // Filter indicators by selected categories and subcategories
  const filteredIndicators = INDICATORS.filter((indicator) => {
    const hasMatchingCategory = indicator.categories?.some((cat) => selectedDifficulties.includes(cat));

    // Trouver les sous-catégories sélectionnées qui appartiennent à une des catégories de l'indicateur
    const relevantSubcategories = selectedSubcategories.filter((subcat) => indicator.subcategories?.includes(subcat as any));

    const requiresSubcategoryMatch = selectedSubcategories.length && !!indicator.subcategories?.length;

    const matchesSubcategory = relevantSubcategories.length > 0;

    return hasMatchingCategory && (!requiresSubcategoryMatch || matchesSubcategory) && indicator.uuid;
  });

  let finalIndicators: PredefineIndicatorV2SchemaType[] = [];

  // For each selectedDifficulty, automatically select all priority === 0 indicators
  selectedDifficulties.forEach((difficulty) => {
    const difficultyIndicators = filteredIndicators.filter((indicator) => indicator.categories?.includes(difficulty));

    const p0Indicators = difficultyIndicators.filter((ind) => ind.priority === 0);
    finalIndicators.push(...p0Indicators);
  });

  // Remove duplicates (in case an indicator belongs to multiple selected difficulties)
  const uniqueP0Indicators = Array.from(new Map(finalIndicators.map((indicator) => [indicator.uuid, indicator])).values());

  // If total number of priority === 0 indicators across all selectedDifficulties is under 7,
  // also add priority === 1 indicators for each difficulty
  if (uniqueP0Indicators.length < 7) {
    const p1IndicatorsToAdd: PredefineIndicatorV2SchemaType[] = [];

    selectedDifficulties.forEach((difficulty) => {
      const difficultyIndicators = filteredIndicators.filter((indicator) => indicator.categories?.includes(difficulty));

      const p1Indicators = difficultyIndicators.filter((ind) => ind.priority === 1);
      p1IndicatorsToAdd.push(...p1Indicators);
    });

    // Remove duplicates from P1 indicators
    const uniqueP1Indicators = Array.from(new Map(p1IndicatorsToAdd.map((indicator) => [indicator.uuid, indicator])).values());

    // Add P1 indicators to reach closer to 7 (but don't strictly limit to 7)
    finalIndicators = [...uniqueP0Indicators, ...uniqueP1Indicators];
  } else {
    finalIndicators = uniqueP0Indicators;
  }
  return finalIndicators;
}

type Props = OnboardingV2ScreenProps<"OnboardingChooseIndicator">;

const NextRoute = "StartFirstSurvey";

export const OnboardingChooseIndicatorScreen: React.FC<Props> = ({ navigation, route }) => {
  const [showMoreIndicators, setShowMoreIndicators] = useState(false);
  const [customIndicators, setCustomIndicators] = useState<PredefineIndicatorV2SchemaType[]>([]);

  const [addedIndicators, setAddedIndicators] = useState<Record<NEW_INDICATORS_CATEGORIES, PredefineIndicatorV2SchemaType[]>>({});
  const { setSlideIndex, setIsVisible } = useOnboardingProgressHeader();
  const { profile, isLoading } = useUserProfile();

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setIsVisible(false);
      setSlideIndex(-1);
    }, [])
  );

  const recommendedIndicators = profile
    ? suggestIndicatorsForDifficulties(
        profile.selectedDifficulties.filter(
          (difficulty) =>
            ![
              // ignore this as it is the user that will select specific indicators
              NEW_INDICATORS_CATEGORIES.RISK_BEHAVIOR,
              NEW_INDICATORS_CATEGORIES.SUBSTANCE,
              NEW_INDICATORS_CATEGORIES.LIFE_EVENT,
              NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS,
            ].includes(difficulty)
        ),
        profile.selectedSubcategories || []
      ).filter((indicator) => !BASE_INDICATORS.includes(indicator.uuid))
    : [];
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  const recommendedIndicatorsByCategory: Record<NEW_INDICATORS_CATEGORIES, PredefineIndicatorV2SchemaType[]> = recommendedIndicators.reduce(
    (prev, curr) => {
      if (!prev[curr.mainCategory]) {
        prev[curr.mainCategory] = [];
      }
      prev[curr.mainCategory].push(curr);
      return prev;
    },
    {} as Record<NEW_INDICATORS_CATEGORIES, PredefineIndicatorV2SchemaType[]>
  );

  const toggleIndicator = useCallback((id: string) => {
    setSelectedIndicators((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  }, []);

  const handleNext = async () => {
    // Get predefined indicators
    const indicators = [...INDICATORS, ...Object.values(addedIndicators).flat()];

    // Filter only the ones whose uuid is in BASE_INDICATORS or selectedIndicators
    const filteredIndicators = indicators.filter((indicator) => [...BASE_INDICATORS, ...selectedIndicators].includes(indicator.uuid));

    // Deduplicate based on uuid
    const predefinedIndicatorsToSave = Array.from(
      new Map([INDICATEURS_HUMEUR, INDICATEURS_SOMMEIL, ...filteredIndicators].map((indicator) => [indicator.uuid, indicator])).values()
    );
    // Get custom indicators that are selected
    const customIndicatorsToSave = customIndicators.filter((indicator) => selectedIndicators.includes(indicator.uuid));

    // Convert predefined indicators
    const predefinedConverted: Indicator[] = predefinedIndicatorsToSave.map(generateIndicatorFromPredefinedIndicator);

    // Convert custom indicators
    const customConverted: Indicator[] = customIndicatorsToSave.map((indicator) => ({
      uuid: indicator.uuid,
      name: indicator.name,
      category: indicator.category,
      mainCategory: indicator.mainCategory,
      newCategories: indicator.categories,
      type: indicator.type,
      order: indicator.order,
      version: 1,
      active: true,
      position: 0,
      created_at: new Date(),
    }));

    // Combine all indicators
    const allIndicators: Indicator[] = [...predefinedConverted, ...customConverted];
    await localStorage.setIndicateurs(allIndicators);
    await localStorage.setOnboardingDone(true);
    navigation.navigate(NextRoute);
  };

  const addIndicatorForCategory = (category: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorV2SchemaType[]) => {
    setAddedIndicators((prev) => ({
      ...prev,
      [category]: indicators,
    }));
    setSelectedIndicators((prev) => {
      return [
        // filter base indicator if we define indicators
        ...prev.filter((indicator) => !BASE_INDICATORS_FOR_CUSTOM_CATEGORIES[category].map((cat) => cat.uuid).includes(indicator)),
        ...indicators.map((indicator) => indicator.uuid),
      ];
    });
  };

  const renderIndicatorItem = useCallback(
    (item: PredefineIndicatorV2SchemaType) => {
      const selected = selectedIndicators.includes(item.uuid);
      return <SelectionnableItem key={item.uuid} id={item.uuid} label={item.name} selected={selected} onPress={() => toggleIndicator(item.uuid)} />;
    },
    [selectedIndicators, toggleIndicator]
  );

  const handlePrevious = () => {
    if (route.params?.skippedScreen) {
      navigation.navigate(route.params.skippedScreen);
    } else if (profile?.selectedDifficulties.find((cat) => INDICATOR_CATEGORIES_DATA[cat].subCat)) {
      navigation.navigate("SubCategoriesScreen");
    } else {
      navigation.navigate("PersonalizationDifficulties");
    }
  };
  const indicatorsWithCustomCount = INDICATORS_WITH_CUSTOM_OPTIONS.filter((cat) => profile?.selectedDifficulties.includes(cat)).length;
  const indicatorsCount =
    Object.values(recommendedIndicatorsByCategory).reduce((acc, indicators) => indicators.length + acc, 0) + indicatorsWithCustomCount;
  const recommendedIndicatorsUuid = recommendedIndicators.map((reco) => reco.uuid);
  const indicatorsTotalCount = selectedIndicators.length;
  const hasSelectedDifficulties = !!(profile?.selectedDifficulties && profile.selectedDifficulties.length);
  const title = hasSelectedDifficulties
    ? `Je vous propose de suivre ${indicatorsCount} élément${indicatorsCount > 1 ? "s" : ""} important${indicatorsCount > 1 ? "s" : ""}`
    : `Choisissez ce que vous souhaitez suivre`;

  return (
    <AnimatedHeaderScrollScreen
      title={title}
      dynamicTitle={"Indicateurs"}
      navigation={navigation}
      hasProgressBar={false}
      handlePrevious={handlePrevious}
      bottomComponent={
        <NavigationButtons
          absolute={true}
          onNext={handleNext}
          headerContent={
            <View>
              {selectedIndicators.length >= 9 && <AlertBanner text={`Nous vous recommandons de ne pas choisir plus de 8 éléments pour commencer`} />}
              <View className="my-2">
                <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800 text-center")}>
                  Vous pourrez modifier cette sélection plus tard
                </Text>
              </View>
            </View>
          }
          onSkip={handleNext}
          showSkip={true}
          nextDisabled={selectedIndicators.length === 0}
          nextText={`Valider ${indicatorsTotalCount} élément${indicatorsTotalCount > 1 ? "s" : ""} à suivre`}
          skipText="Passer cette étape"
        />
      }
    >
      {hasSelectedDifficulties && (
        <>
          <View className="px-6 py-4 pb-0">
            <InstructionText>
              Choisissez au moins un élément que vous souhaitez suivre au quotidien. Vous pourrez modifier vos choix et en ajouter d’autres plus tard.
            </InstructionText>
          </View>
          {/* indicators grouped by categories */}
          <View className="px-4 flex-1">
            {Object.entries(recommendedIndicatorsByCategory)
              .filter(([cat]) => {
                return !INDICATORS_WITH_CUSTOM_OPTIONS.includes(cat as NEW_INDICATORS_CATEGORIES);
              })
              .map(([category, indicators]) => (
                <CategoryCard
                  type="select"
                  key={category}
                  indicators={indicators}
                  selectedIndicators={selectedIndicators}
                  categoryName={category as NEW_INDICATORS_CATEGORIES}
                  renderIndicatorItem={renderIndicatorItem}
                />
              ))}
            {INDICATORS_WITH_CUSTOM_OPTIONS.filter((cat) => profile?.selectedDifficulties.includes(cat)).map((cat) => {
              return (
                <CategoryCard
                  key={cat}
                  type={"select-and-input"}
                  selectedIndicators={selectedIndicators}
                  indicators={addedIndicators[cat] && addedIndicators[cat].length ? addedIndicators[cat] : BASE_INDICATORS_FOR_CUSTOM_CATEGORIES[cat]}
                  renderIndicatorItem={renderIndicatorItem}
                  addIndicatorForCategory={addIndicatorForCategory}
                  categoryName={cat}
                />
              );
            })}
          </View>
          <View className="px-4 mb-4">
            <TouchableOpacity onPress={() => setShowMoreIndicators(!showMoreIndicators)} className="py-3 px-4">
              <Text
                className="text-center font-medium"
                style={{
                  textDecorationLine: "underline",
                }}
              >
                {showMoreIndicators ? "Masquer" : "Voir plus d'indicateurs"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {!profile?.selectedDifficulties ||
        (!profile.selectedDifficulties.length && (
          <>
            <View className="px-6 py-4 pb-0">
              <InstructionText>
                Voici les éléments les plus suivis sur Jardin Mental. Séléctionnez au moins un élément pour démarrer (vous pourrez modifier vos choix
                et en ajouter d’autres plus tard)
              </InstructionText>
            </View>
          </>
        ))}

      {(showMoreIndicators || !hasSelectedDifficulties) && (
        <View className="mb-6 px-4 flex-1">
          <Text className="text-xl font-bold mb-4 mx-0" style={{ color: TW_COLORS.TEXT_PRIMARY }}>
            Les plus suivis
          </Text>
          {INDICATORS.filter(
            (indicator) =>
              indicator.priority === 0 &&
              !indicator.isGeneric &&
              ![recommendedIndicatorsUuid, INDICATEURS_HUMEUR.uuid, INDICATEURS_SOMMEIL.uuid].includes(indicator.uuid)
          ).map((indicator, index) => (
            <React.Fragment key={`popular-${indicator.uuid}-${index}`}>{renderIndicatorItem(indicator)}</React.Fragment>
          ))}
        </View>
      )}

      <View className="h-20" />
    </AnimatedHeaderScrollScreen>
  );
};

const MultiInput = ({ categoryName }: { categoryName: NEW_INDICATORS_CATEGORIES }) => {
  const [addedInputs, setAddedInputs] = useState([""]);

  return (
    <View className="flex">
      {addedInputs.map((input, index) => (
        <View className="rounded rounded-lg flex-1 flex-row mb-2">
          <TextInput
            onChangeText={(text) => {
              addedInputs[index] = text;
              setAddedInputs(addedInputs);
            }}
            placeholder={INDICATOR_CATEGORIES_DATA[categoryName].description}
            className={mergeClassNames(typography.textMdRegular, "text-left border border-gray-300 p-2 rounded rounded-lg flex-1")}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              bottom: 5,
            }}
            onPress={() => {
              setAddedInputs((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
            }}
          >
            <Text className={mergeClassNames(typography.textMdSemibold, "text-brand-800")}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => {
          setAddedInputs((prev) => [...prev, ""]);
        }}
        className="flex-row ml-auto items-center justify-center mt-2"
      >
        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mr-1")}>Ajouter un autre événement</Text>
        <PlusIcon color={TW_COLORS.BRAND_700} />
      </TouchableOpacity>
    </View>
  );
};

const CategoryCard = ({
  categoryName,
  renderIndicatorItem,
  selectedIndicators,
  addIndicatorForCategory,
  indicators,
  type,
}: {
  type: "select" | "select-and-input" | "input";
  categoryName: NEW_INDICATORS_CATEGORIES;
  indicators: PredefineIndicatorV2SchemaType[];
  selectedIndicators: string[];
  addIndicatorForCategory?: (category: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorV2SchemaType[]) => void;
  renderIndicatorItem?: (item: PredefineIndicatorV2SchemaType) => JSX.Element;
}) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  return (
    <View key={categoryName} className="mb-6 w-full rounded rounded-3xl border border-1 border-gray-300 bg-gray-50 py-4 flex-1">
      <View className="px-4 gap-6 flex-col mb-6">
        <View className="flex-row items-center mb-2">
          <View className="items-center justify-center mr-4">
            <IconBg type={categoryName} frontSquareColor={TW_COLORS.CNAM_CYAN_50_LIGHTEN_90} backSquareColor={TW_COLORS.CNAM_CYAN_200_LIGHTEN_60} />
          </View>
          <Text className={mergeClassNames(typography.textLgBold, "text-cnam-primary-900 ")}>
            {INDICATOR_CATEGORIES_DATA[categoryName].name || categoryName}
          </Text>
          {!indicators && (
            <View className="ml-auto rounded py-1 px-2 border border-brand-800 bg-gray-200 flex-row justify-content items-center">
              <Text className={mergeClassNames(typography.textSmBold, "text-cnam-primary-900")}>à préciser</Text>
            </View>
          )}
        </View>
        {indicators && <View className="flex-col h-auto">{indicators.map((indicator, index) => renderIndicatorItem(indicator))}</View>}
        {type === "select-and-input" && (
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => {
                showBottomSheet(
                  <IndicatorModal
                    category={categoryName}
                    addedIndicators={indicators}
                    initialSelectedIndicators={selectedIndicators}
                    onClose={(categoryName: NEW_INDICATORS_CATEGORIES, indicators: PredefineIndicatorV2SchemaType[]) => {
                      if (typeof addIndicatorForCategory === "function") {
                        addIndicatorForCategory(categoryName, indicators);
                        closeBottomSheet();
                      }
                    }}
                  />
                );
              }}
              className="flex-row ml-auto items-center justify-center"
            >
              <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mr-1")}>Préciser</Text>
              <ArrowIcon color={TW_COLORS.BRAND_700} />
            </TouchableOpacity>
          </View>
        )}
        {type === "input" && (
          <View className="flex-col">
            <MultiInput categoryName={categoryName} />
          </View>
        )}
      </View>
    </View>
  );
};

export default OnboardingChooseIndicatorScreen;
