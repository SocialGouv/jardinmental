import React, { useCallback, useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button2 } from "../../../components/Button2";
import { Screen } from "../../../components/Screen";
import { Card } from "../../../components/Card";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsTracked, setGoalTracked } from "../../../utils/localStorage/goals";
import { Title } from "../../../components/Title";
import { Badge } from "../../../components/Badge";
import Icon from "../../../components/Icon";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";
import { confirm } from "../../../utils";

export const GoalsSettingsMore = ({ navigation, route }) => {
  const [goals, setGoals] = useState([]);
  const [goalsToRemove, setGoalsToRemove] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const _goals = await getGoalsTracked();
        setGoals(_goals);
      })();
    }, [])
  );

  const onRemove = useCallback(
    ({ goal: goalToRemove }) => {
      const _goals = goals.reduce((acc, goal) => {
        if (goalToRemove.id === goal.id) return acc;
        return [...acc, goal];
      }, []);
      setGoalsToRemove([...goalsToRemove, goalToRemove]);
      setGoals(_goals);
      autoLayoutAnimation();
    },
    [goals, goalsToRemove]
  );

  const onValidate = async () => {
    if (loading) return;
    setLoading(true);
    for (const goalToRemove of goalsToRemove) {
      await setGoalTracked({
        id: goalToRemove.id,
        enabled: false,
      });
    }
    for (const { goal, index } of goals.map((goal, index) => ({ goal, index }))) {
      await setGoalTracked({
        id: goal.id,
        order: index,
      });
    }
    setLoading(false);
    navigation.goBack();
  };

  const renderItem = useCallback(
    ({ item: goal, drag, isActive, index }) => {
      return <GoalItem {...{ goal, drag, isActive, index, onRemove }} />;
    },
    [onRemove]
  );

  const keyExtractor = useCallback((goal) => goal.id);

  return (
    <Screen
      header={{
        title: "Mes objectifs",
      }}
      bottomChildren={<Button2 fill title="Enregistrer" onPress={onValidate} />}
      ScrollComponent={DraggableFlatList}
      scrollAsFlatList={true}
      scrollProps={{
        data: goals,
        renderItem,
        keyExtractor,
        onDragEnd: (data) => setGoals(data?.data),
        containerStyle: {
          flex: 1,
        },
      }}
    >
      <Card
        title="Modifier mes objectifs"
        text="Vous pouvez changer l’ordre d’apparition de vos objectifs et/ou les supprimer"
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

const GoalItem = ({ goal, drag, isActive, index, onRemove }) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity onLongPress={drag} disabled={isActive} delayLongPress={100}>
        <View style={[itemStyles.container, isActive && { backgroundColor: "#D4F0F2" }]}>
          <Icon
            icon="ReorderSvg"
            color="#26387C"
            width="16"
            height="16"
            styleContainer={{ width: 16, height: 16 }}
          />
          <Text style={[itemStyles.label]}>{goal?.label}</Text>
          <Button2
            square
            preset=""
            type="clear"
            icon="DeleteSvg"
            textStyle={{ color: "#26387C" }}
            style={{ backgroundColor: "#F8F9FB" }}
            iconSize={16}
            onPress={() => onRemove({ goal })}
          />
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F4FCFD",
    borderColor: "#D4F0F2",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "Karla",
    fontWeight: "700",
    fontSize: 16,
    color: "#26387C",
    textAlign: "left",
    marginLeft: 16,
    flex: 1,
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
