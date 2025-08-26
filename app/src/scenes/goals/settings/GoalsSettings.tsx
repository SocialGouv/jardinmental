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
import { ONBOARDING_STEPS, TW_COLORS } from "../../../utils/constants";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import Target from "@assets/svg/icon/Target";
import { TouchableOpacity } from "react-native-gesture-handler";
import Pencil from "@assets/svg/Pencil";

export const GoalsSettings = ({ navigation, route }) => {
  const onboarding = route.params?.onboarding;

  const [goals, setGoals] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const _goals = await getGoalsTracked();
        setGoals(_goals);
      })();
    }, [])
  );

  const renderItem = useCallback((goal, index) => {
    return <GoalItem {...{ goal, index }} />;
  }, []);

  const keyExtractor = useCallback((goal) => goal.id);

  return (
    <AnimatedHeaderScrollScreen
      title="Mes objectifs"
      handlePrevious={() => {
        navigation.goBack();
      }}
      bottomComponent={
        <View className="mx-4">
          <JMButton variant="outline" title="Ajouter un objectif" onPress={() => navigation.navigate("goals-add-options")} />
          <JMButton title="Modifier mes objectifs" onPress={() => navigation.navigate("goals-settings-more")} className="mt-2" />
        </View>
      }
      navigation={navigation}
    >
      <View className="bg-cnam-cyan-50-lighten-90 p-4 m-4 rounded-2xl">
        <View className="flex-row items-center mb-4">
          <View className="rounded-full border-[1.5px] border-cnam-primary-800 bg-white w-8 h-8 items-center justify-center">
            <Target color={TW_COLORS.CNAM_PRIMARY_900} width={18} height={18} />
          </View>
          <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 ml-2")}>Personnaliser mes objectifs</Text>
        </View>
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900")}>Gérez vos objectifs et créez-en de nouveaux</Text>
      </View>
      <View className="mx-4 my-4 flex-row items-center">
        <Title align="left" fill={false}>
          Mes objectifs
        </Title>
        <View className="bg-cnam-cyan-500-0 h-7 w-7 rounded-full items-center justify-center ml-2">
          <Text className={mergeClassNames("text-white", typography.textMdSemibold)}>{goals?.length || 0}</Text>
        </View>
      </View>
      <View>{goals.map(renderItem)}</View>
    </AnimatedHeaderScrollScreen>
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
    <View className="bg-white border-2 border-cnam-primary-800 mx-4 rounded-2xl p-4 flex-row mb-2">
      <View className="flex-1">
        <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-950")}>{goal.label}</Text>
        <View style={[itemStyles.daysOfWeekContainer]}>
          <Text className={mergeClassNames(typography.textMdRegular, "text-gray-700")}>{daysOfWeekLabel}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("goal-config", { editing: true, goalId: goal.id });
        }}
        className="flex-1 h-5 w-5"
      >
        <Pencil color={TW_COLORS.CNAM_CYAN_DARKEN_20} />
      </TouchableOpacity>
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
    fontFamily: "SourceSans3",
    fontWeight: "700",
    fontSize: 16,
    color: colors.BLUE,
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
    fontFamily: "SourceSans3",
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
