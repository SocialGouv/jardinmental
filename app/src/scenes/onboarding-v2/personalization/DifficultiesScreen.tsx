import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { OnboardingV2ScreenProps, Difficulty } from "../types";
import { NavigationButtons } from "@/components/onboarding/NavigationButtons";
import { useUserProfile } from "@/context/userProfile";
import { useOnboardingProgressHeader } from "@/scenes/onboarding-v2/ProgressHeader";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import SelectionnableItem from "@/components/SelectionnableItem";
import { INDICATOR_CATEGORIES_DATA } from "../data/helperData";
import { NEW_INDICATORS_CATEGORIES } from "@/utils/liste_indicateurs.1";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import AlertBanner from "../AlertBanner";
import logEvents from "@/services/logEvents";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import { Typography } from "@/components/Typography";

type Props = OnboardingV2ScreenProps<"PersonalizationDifficulties">;

const NextScreen = "SubCategoriesScreen";

const DifficultiesScreen: React.FC<Props> = ({ navigation }) => {
  const { updateUserDifficulties, profile } = useUserProfile();
  const { setCustomColor } = useStatusBar();
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(
    Object.values(INDICATOR_CATEGORIES_DATA)
      .filter((d) => d.category !== NEW_INDICATORS_CATEGORIES.OTHER)
      .map((d) => ({
        ...d,
        selected: !!profile?.selectedDifficulties.includes(d.category),
      }))
      .filter((cat) => cat.category !== NEW_INDICATORS_CATEGORIES.PHYSICAL_SIGNS)
  );
  const { setSlideIndex, setNextCallback, setIsVisible, setSkipCallback } = useOnboardingProgressHeader();

  useFocusEffect(
    useCallback(() => {
      setCustomColor(TW_COLORS.PRIMARY);

      return () => {
        // Optional cleanup here
      };
    }, [])
  );

  const handleSkip = useCallback(() => {
    logEvents.logIndicatorObdPass(5);
    navigation.navigate("OnboardingChooseIndicator", {
      skippedScreen: "PersonalizationDifficulties",
    });
  }, [navigation]);

  const handleNext = async () => {
    const selected = selectedDifficulties.filter((d) => d.selected);
    const selectedCategories = selected.map((d) => d.category);
    const selectedCategoriesMatomoIds = selected.map((d) => d.matomoId);
    logEvents.logIndicatorObdLvl1(selectedCategoriesMatomoIds);
    await updateUserDifficulties(selectedCategories);
    if (selectedCategories.find((cat) => INDICATOR_CATEGORIES_DATA[cat].subCat)) {
      navigation.navigate(NextScreen);
    } else {
      navigation.navigate("OnboardingLoadingScreen");
      setTimeout(() => {
        setSlideIndex(-1);
        setIsVisible(false);
      });
    }
  };

  useEffect(() => {
    setSkipCallback(handleSkip);
    setNextCallback(handleNext);
  }, [handleSkip, handleNext, setSkipCallback, setNextCallback]);

  const toggleDifficulty = (id: string) => {
    setSelectedDifficulties((prev) =>
      prev.map((difficulty) => (difficulty.id === id ? { ...difficulty, selected: !difficulty.selected } : difficulty))
    );
  };

  const selectedCount = selectedDifficulties.filter((d) => d.selected).length;

  return (
    <AnimatedHeaderScrollScreen
      title={"Sur quoi avez-vous ressenti une difficulté ou une gêne ces deux dernières semaines?"}
      dynamicTitle={"Difficultés"}
      hasProgressBar={true}
      navigation={navigation}
      bottomComponent={
        <NavigationButtons
          absolute={true}
          withArrow={true}
          onNext={handleNext}
          headerContent={
            <View>
              {selectedCount >= 3 && <AlertBanner text={`Chaque domaine sera précisé ensuite : limitez-vous à 1 ou 2 pour démarrer.`} />}
              <View className="my-2">
                <Typography className={mergeClassNames(typography.textSmMedium, "text-gray-800 text-center")}>
                  Vous pourrez modifier cette sélection plus tard
                </Typography>
              </View>
            </View>
          }
          onSkip={handleSkip}
          nextDisabled={!selectedCount}
          showSkip={true}
          nextText="Continuer"
          skipText="Passer cette étape"
        />
      }
    >
      <View className="px-6 py-4">
        <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
          Sélectionnez un ou plusieurs domaines
        </Typography>
      </View>

      <View className="px-4" style={{ paddingVertical: 8 }}>
        {selectedDifficulties.map((item) => (
          <SelectionnableItem
            icon={item.icon}
            key={item.id}
            description={item.description}
            onPress={() => toggleDifficulty(item.id)}
            id={item.id}
            label={item.name}
            selected={item.selected}
          ></SelectionnableItem>
        ))}
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default DifficultiesScreen;
