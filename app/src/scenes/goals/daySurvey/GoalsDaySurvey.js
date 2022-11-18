import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../../components/Card";

export const GoalsDaySurvey = ({}) => {
  const navigation = useNavigation();

  return (
    <View>
      <Card
        title="Personnaliser mes objectifs"
        text="Vous pouvez gérez vos objectifs et en créer de nouveaux"
        icon={{ icon: "ImportantSvg" }}
        onPress={() => navigation.navigate("goals-settings")}
      />
    </View>
  );
};
