import React, { useState } from "react";
import { View, Text } from "react-native";
import { OnboardingV2ScreenProps } from "../types";
import { NavigationButtons } from "@/components/onboarding/NavigationButtons";
import { useUserProfile } from "@/context/userProfile";
import { TW_COLORS } from "@/utils/constants";
import { useOnboardingProgressHeader } from "@/scenes/onboarding-v2/ProgressHeader";
import { useAnimatedStyle } from "react-native-reanimated";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import SelectionnableItem from "@/components/SelectionnableItem";
import { INDICATOR_CATEGORIES_DATA } from "../data/helperData";
import { SUBCATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from "@/utils/liste_indicateurs.1";
import InstructionText from "../InstructionText";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import logEvents from "@/services/logEvents";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";

type Props = OnboardingV2ScreenProps<"PersonalizationObjective">;

const NextScreen = "OnboardingLoadingScreen";

const SubcategoriesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { updateUserSubcategories, profile } = useUserProfile();
  const [selectedSubcategories, setSelectedSubcategories] = useState<NEW_INDICATORS_SUBCATEGORIES[]>(profile?.selectedSubcategories || []);
  const { setSlideIndex, setIsVisible } = useOnboardingProgressHeader();
  const { setCustomColor } = useStatusBar();

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );

  const handleNext = async () => {
    if (selectedSubcategories.length > 0) {
      if (profile) {
        await updateUserSubcategories(selectedSubcategories);
      }

      logEvents.logIndicatorObdLvl2(
        selectedSubcategories.map((subTheme) => SUBCATEGORIES[subTheme].matomoId),
        selectedSubcategories.length
      );

      navigation.navigate(NextScreen);
      setSlideIndex(-1);
      setIsVisible(false);
    }
  };

  const handleSkip = () => {
    logEvents.logIndicatorObdPass(15);
    navigation.navigate(NextScreen);
  };

  const handleItemPress = (item: NEW_INDICATORS_SUBCATEGORIES) => {
    const isSelected = selectedSubcategories.some((selected) => selected === item);

    if (isSelected) {
      // Remove item from selection
      setSelectedSubcategories((prev) => prev.filter((selected) => selected !== item));
    } else {
      // Add item to selection
      setSelectedSubcategories((prev) => [...prev, item]);
    }
  };

  const renderSubCategoryItem = ({ item }: { item: NEW_INDICATORS_SUBCATEGORIES }) => (
    <SelectionnableItem
      onPress={() => handleItemPress(item)}
      key={item}
      id={item}
      label={SUBCATEGORIES[item]?.label || item}
      selected={selectedSubcategories.some((selected) => selected === item)}
    ></SelectionnableItem>
  );

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: TW_COLORS.PRIMARY,
    };
  });

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      backgroundColor: "transparent",
      // color: TW_COLORS.WHITE,
    };
  });
  return (
    <AnimatedHeaderScrollScreen
      title={`Précisez ce que vous souhaitez suivre en priorité`}
      dynamicTitle={"Priorités"}
      hasProgressBar={true}
      navigation={navigation}
      bottomComponent={
        <NavigationButtons
          absolute={true}
          withArrow={true}
          onNext={handleNext}
          headerContent={
            <View>
              <View className="my-2">
                <Text className={mergeClassNames(typography.textSmMedium, "text-gray-800 text-center")}>
                  Vous pourrez modifier cette sélection plus tard
                </Text>
              </View>
            </View>
          }
          onSkip={handleSkip}
          showSkip={true}
          nextDisabled={selectedSubcategories.length === 0}
          nextText="Valider et continuer"
          skipText="Passer cette étape"
        />
      }
    >
      <View className="px-6 py-4 pb-0" style={{}}>
        <InstructionText>
          Parmi{" "}
          {profile?.selectedDifficulties
            .filter((diff) => INDICATOR_CATEGORIES_DATA[diff].subCat)
            .map((difficulty) => `"${INDICATOR_CATEGORIES_DATA[difficulty].name}"`)
            .join(", ")}
          , quels sont les éléments les plus importants que vous souhaitez observer ?
        </InstructionText>
      </View>
      <View className="px-6">
        {Object.values(INDICATOR_CATEGORIES_DATA)
          .filter((item) => profile?.selectedDifficulties.includes(item.category))
          .filter((item) => item.subCat && item.subCat.length > 0)
          .map((cat, index) => {
            return (
              <View key={cat.id}>
                <View className={`flex-row items-center p-4 px-0 pb-6 ${index === 0 ? "pt-2" : "pt-6"}`}>
                  <View className="rounded-full border-[1.5px] border-cnam-primary-800 bg-white w-10 h-10 items-center justify-center">
                    {React.createElement(cat.icon, { color: TW_COLORS.BRAND_900 })}
                  </View>
                  <Text className={mergeClassNames(typography.textLgBold, "text-left text-cnam-primary-900 ml-2")}>{cat.name}</Text>
                </View>
                {cat.subCat.map((item) => renderSubCategoryItem({ item }))}
              </View>
            );
          })}
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default SubcategoriesScreen;
