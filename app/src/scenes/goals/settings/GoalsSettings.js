import React from "react";
import { View } from "react-native";
import { Button2 } from "../../../components/Button2";
import { Screen } from "../../../components/Screen";
import { Card } from "../../../components/Card";

export const GoalsSettings = ({ navigation }) => {
  return (
    <Screen
      header={{
        title: "Mes objectifs",
      }}
      bottomChildren={
        <Button2 fill title="Ajouter un objectif" onPress={() => navigation.navigate("goals-add-options")} />
      }
    >
      <Card
        title="Personnaliser mes objectifs"
        text="Gérez vos objectifs et créez en de nouveaux"
        image={{ source: require("./../../../../assets/imgs/goal.png") }}
      />
    </Screen>
  );
};
