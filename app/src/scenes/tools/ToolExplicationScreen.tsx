import React from "react";
import { View, Text } from "react-native";
import { TW_COLORS } from "@/utils/constants";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";

interface ToolExplicationProps {
  navigation: any;
}

const ToolExplication: React.FC<ToolExplicationProps> = ({ navigation }) => {
  const { showBottomSheet } = useBottomSheet();

  return (
    <AnimatedHeaderScrollScreen
      title={""}
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      navigation={navigation}
      showBottomButton={false}
      scrollViewBackground={TW_COLORS.GRAY_50}
    >
      <View className="p-4 mt-4">
        <View className="mb-6 bg-cnam-cyan-lighten-90">
          <Text className="text-cnam-primary-800 text-base leading-6 p-4">
            Vous y trouverez des exercices, vidéos et questionnaires scientifiquement validés, gratuits et fiables, pour vous accompagner au
            quotidien.{" "}
          </Text>
          <Text className="text-cnam-primary-800 text-base leading-6 p-4">
            La plupart ont été recensés dans l’article “S’aider soi‑même : des outils pour tous” de Psycom.
          </Text>
        </View>
      </View>
      <View className="p-4 mt-4">
        <Text className="text-cnam-primary-800 text-base leading-6 p-4">
          Ces activités peuvent vous aider à prendre du recul, faire le point et mieux vous connaître, tout en vous accompagnant dans la gestion de
          vos émotions. Chaque personne réagit différemment : ces outils ne fonctionnent pas forcément pour tout le monde, l’idée est donc de piocher,
          tester et découvrir ce qui vous aide le mieux.  Rappelez-vous que ces outils viennent enrichir votre soutien quotidien et ne remplacent pas
          l’accompagnement de vos proches ou de professionnels de santé. Pour vous accompagner, la rubrique Agir et chercher de l’aide (sans
          honte) propose plusieurs articles pour apprendre à passer à l’action et accéder aux professionnels ou services adaptés à votre situation.
        </Text>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default ToolExplication;
