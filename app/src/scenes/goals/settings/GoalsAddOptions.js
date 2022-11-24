import React from "react";
import { Button2 } from "../../../components/Button2";
import { Card } from "../../../components/Card";
import { Screen } from "../../../components/Screen";

export const GoalsAddOptions = ({ navigation }) => {
  return (
    <Screen
      header={{
        title: "Ajouter un objectif",
      }}
    >
      <Card
        title="Créez votre objectif personnalisé"
        text="Définissez votre objectif et planifiez le sur les jours de la semaine que vous souhaitez"
      >
        <Button2
          preset="secondary"
          fill
          title="Créer un objectif"
          icon="Plus2Svg"
          onPress={() => navigation.navigate("goals-create-form")}
        />
      </Card>
    </Screen>
  );
};
