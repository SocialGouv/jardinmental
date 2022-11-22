import React, { useCallback, useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button2 } from "../../../components/Button2";
import { Screen } from "../../../components/Screen";
import { Card } from "../../../components/Card";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getDaysOfWeekLabel, getGoalsTracked } from "../../../utils/localStorage/goals";
import { Title } from "../../../components/Title";
import { Badge } from "../../../components/Badge";
import Icon from "../../../components/Icon";

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
  const [daysOfWeekLabel, setDaysOfWeekLabel] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const label = getDaysOfWeekLabel(goal.daysOfWeek);
    if (label === "all") setDaysOfWeekLabel("Chaque jour");
    else setDaysOfWeekLabel(label);
  }, [goal]);

  return (
    <View style={[itemStyles.container]}>
      <View style={[itemStyles.contentContainer]}>
        <Text style={[itemStyles.label]}>{goal.label}</Text>
        <View style={[itemStyles.daysOfWeekContainer]}>
          <Icon icon="Calendar2Svg" color="#2D2D2D" styleContainer={itemStyles.daysOfWeekIcon} />
          {daysOfWeekLabel && <Text style={[itemStyles.daysOfWeekText]}>{daysOfWeekLabel}</Text>}
        </View>
      </View>
      <Button2
        square
        type="clear"
        icon="EditSvg"
        textStyle={{ color: "#26387C" }}
        iconSize={16}
        onPress={() => {
          navigation.navigate("goal-config", { editing: true, goalId: goal.id });
        }}
      />
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
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  label: {
    fontFamily: "Karla",
    fontWeight: "700",
    fontSize: 16,
    color: "#26387C",
    textAlign: "left",
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  daysOfWeekIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  daysOfWeekText: {
    fontFamily: "Karla",
    fontWeight: "400",
    fontSize: 14,
    color: "#2D2D2D",
    textAlign: "left",
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
