import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button2 } from "../../../components/Button2";
import { Screen } from "../../../components/Screen";
import { Card } from "../../../components/Card";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsTracked } from "../../../utils/localStorage/goals";
import { Title } from "../../../components/Title";
import { Badge } from "../../../components/Badge";

export const GoalsSettings = ({ navigation }) => {
  const [goals, setGoals] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const _goals = await getGoalsTracked();
        console.log({ _goals });
        setGoals(_goals);
      })();
    }, [])
  );

  const renderItem = useCallback(({ item: goal, index }) => {
    return <GoalItem {...{ goal, index }} />;
  }, []);

  const keyExtractor = useCallback((goal) => goal.id);

  return (
    <Screen
      header={{
        title: "Mes objectifs",
      }}
      bottomChildren={
        <Button2 fill title="Ajouter un objectif" onPress={() => navigation.navigate("goals-add-options")} />
      }
      ScrollComponent={FlatList}
      scrollProps={{
        data: goals,
        renderItem,
        keyExtractor,
      }}
    >
      <Card
        title="Personnaliser mes objectifs"
        text="Gérez vos objectifs et créez en de nouveaux"
        image={{ source: require("./../../../../assets/imgs/goal.png") }}
      />
      <View style={titleStyles.container}>
        <Title align="left" fill={false}>
          Mes objectifs
        </Title>
        <Badge style={{ marginLeft: 8 }} circle>
          {goals?.length || 0}
        </Badge>
      </View>
    </Screen>
  );
};

const GoalItem = ({ goal, index }) => {
  return (
    <View style={[itemStyles.container]}>
      <Text>{goal.label}</Text>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FB",
    borderColor: "#E7EAF1",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
  },
});

const titleStyles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 24,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
});
