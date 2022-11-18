import React, { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Button2 } from "../../../components/Button2";
import { Screen } from "../../../components/Screen";
import { Card } from "../../../components/Card";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsTracked } from "../../../utils/localStorage/goals";

export const GoalsSettings = ({ navigation }) => {
  const [goals, setGoals] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const _goals = await getGoalsTracked();
        console.log(_goals);
        setGoals(_goals);
      })();
    }, [])
  );

  return (
    <Screen
      header={{
        title: "Mes objectifs",
      }}
      bottomChildren={
        <Button2 fill title="Ajouter un objectif" onPress={() => navigation.navigate("goals-add-options")} />
      }
      ScrollComponent={FlatList}
      data={goals}
      renderItem={GoalItem}
    >
      <Card
        title="Personnaliser mes objectifs"
        text="Gérez vos objectifs et créez en de nouveaux"
        image={{ source: require("./../../../../assets/imgs/goal.png") }}
      />
    </Screen>
  );
};

const GoalItem = ({ item: goal, index }) => {
  return (
    <View>
      <Text>{goal.label}</Text>
    </View>
  );
};
