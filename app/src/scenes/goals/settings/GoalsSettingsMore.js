import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button2 } from "../../../components/Button2";
import { useFocusEffect } from "@react-navigation/native";
import { getGoalsTracked, setGoalTracked } from "../../../utils/localStorage/goals";
import { Title } from "../../../components/Title";
import { Badge } from "../../../components/Badge";
import Icon from "../../../components/Icon";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { autoLayoutAnimation } from "../../../utils/autoLayoutAnimation";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import NavigationButtons from "@/components/onboarding/NavigationButtons";

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

  const keyExtractor = useCallback((goal) => goal.id, []);
  return (
    <AnimatedHeaderScrollScreen
      title="Mes objectifs"
      navigation={navigation}
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      bottomComponent={
        <NavigationButtons absolute={true}>
          <JMButton title="Ajouter un objectif" onPress={() => navigation.navigate("goals-add-options")} />
          <JMButton variant="outline" title="Modifier mes objectifs" onPress={() => navigation.navigate("goals-settings-more")} className="mt-2" />
        </NavigationButtons>
      }
    >
      {goals.map(renderItem)}
      <View style={titleStyles.container}>
        <Title align="left" fill={false}>
          Mes objectifs
        </Title>
        <Badge style={{ marginLeft: 8 }} circle>
          {goals?.length || 0}
        </Badge>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

const GoalItem = ({ goal, drag, isActive, index, onRemove }) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity onLongPress={drag} disabled={isActive} delayLongPress={100}>
        <View style={[itemStyles.container, isActive && { backgroundColor: "#D4F0F2" }]}>
          <Icon icon="ReorderSvg" color={colors.BLUE} width="16" height="16" styleContainer={{ width: 16, height: 16 }} />
          <Text style={[itemStyles.label]}>{goal?.label}</Text>
          <Button2
            square
            preset=""
            type="clear"
            icon="DeleteSvg"
            textStyle={{ color: colors.BLUE }}
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
    fontFamily: "SourceSans3-Bold",
    fontWeight: "700",
    fontSize: 16,
    color: colors.BLUE,
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
