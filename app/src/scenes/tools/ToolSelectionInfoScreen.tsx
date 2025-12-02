import React from "react";
import { View, Text } from "react-native";
import { TW_COLORS } from "@/utils/constants";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Resource, RESOURCES_DATA } from "../resources/data/resources";
import { EXTERNAL_RESOURCES_DATA } from "../resources/data/resourcesExternal";
import Chevron from "@assets/svg/icon/chevron";

interface ToolSelectionInfoProps {
  navigation: any;
}

const ToolSelectionInfo: React.FC<ToolSelectionInfoProps> = ({ navigation }) => {
  const { showBottomSheet } = useBottomSheet();

  return (
    <AnimatedHeaderScrollScreen
      title={""}
      handlePrevious={() => {
        navigation.goBack();
      }}
      headerLeftComponent={
        <View className="flex-row items-center">
          <Chevron color="white" />
          <Text className="text-white">Des outils pour agir</Text>
        </View>
      }
      smallHeader={true}
      navigation={navigation}
      showBottomButton={false}
      scrollViewBackground={TW_COLORS.GRAY_50}
    >
      <View className="mt-4">
        <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-800 text-base leading-6 p-4")}>
          Bienvenue dans la boîte à outil de Jardin Mental.{" "}
        </Text>
        <View className="bg-cnam-cyan-lighten-90 mx-4">
          <Text className="text-cnam-primary-800 text-base leading-6 p-4">
            Vous y trouverez des exercices, vidéos et questionnaires scientifiquement validés, gratuits et fiables, pour vous accompagner au
            quotidien.{" "}
          </Text>
          <Text className="text-cnam-primary-800 text-base leading-6 p-4">
            La plupart ont été recensés dans l’article 
            <Text
              className="underline"
              onPress={() => {
                navigation.navigate("resource-external-resources", {
                  resource: EXTERNAL_RESOURCES_DATA.find((r) => r.id === "550e8400-e29b-41d4-a716-446655440018") as Resource,
                });
              }}
            >
              “S’aider soi‑même : des outils pour tous” de Psycom
            </Text>
            .
          </Text>
        </View>
      </View>
      <View className="p-4 space-y-2">
        <Text className="text-cnam-primary-800 text-base leading-6">
          Ces activités peuvent vous aider à prendre du recul, faire le point et mieux vous connaître, tout en vous accompagnant dans la gestion de
          vos émotions.
        </Text>
        <Text className="text-cnam-primary-800 text-base leading-6">
          Chaque personne réagit différemment : ces outils ne fonctionnent pas forcément pour tout le monde, l’idée est donc de piocher, tester et
          découvrir ce qui vous aide le mieux.
        </Text>
        <Text className="text-cnam-primary-800 text-base leading-6">
          Rappelez-vous que ces outils viennent enrichir votre soutien quotidien et ne remplacent pas l’accompagnement de vos proches ou de
          professionnels de santé.
        </Text>
        <Text className="text-cnam-primary-800 text-base leading-6">
          Pour vous accompagner, la rubrique Agir et chercher de l’aide (sans honte) propose plusieurs articles pour apprendre à passer à l’action et
          accéder aux professionnels ou services adaptés à votre situation.
        </Text>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ToolSelectionInfo;
