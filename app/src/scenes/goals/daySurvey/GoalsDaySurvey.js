import React from "react";
import { View } from "react-native";
import { HintButton } from "../../../components/HintButton";
import { useNavigation } from "@react-navigation/native";

export const GoalsDaySurvey = ({}) => {
  const navigation = useNavigation();

  return (
    <View>
      <HintButton
        title="Personnaliser mes objectifs"
        subtitle="Vous pouvez gérez vos objectifs et en créer de nouveaux"
        onPress={() => navigation.navigate("goals-settings")}
      />
    </View>
  );
};
