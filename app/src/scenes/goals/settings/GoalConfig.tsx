import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Button2 } from "../../../components/Button2";
import { InputLabel } from "../../../components/InputLabel";
import { Screen } from "../../../components/Screen";
import { getDaysOfWeekLabel, getGoalsData, setGoalTracked } from "../../../utils/localStorage/goals";
import { InputGroup, InputGroupItem } from "../../../components/InputGroup";
import { InputToggle } from "../../../components/InputToggle";
import TimePicker from "../../../components/timePicker";
import { InputText } from "../../../components/InputText";
import dayjs from "dayjs";
import { format, set } from "date-fns";
import { Card } from "../../../components/Card";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "../../../components/Icon";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

export const GoalConfig = ({ navigation, route }) => {
  const goalId = route.params?.goalId;
  const goalLabel = route.params?.goalLabel;
  const goalDaysOfWeek = route.params?.goalDaysOfWeek;
  const editing = route.params?.editing;
  const [editingGoal, setEditingGoal] = useState();

  const [ready, setReady] = useState(!editing ? true : false);
  const [loading, setLoading] = useState(false);

  const reminderToggleRef = useRef();
  const [reminderEnabled, setReminderEnabled] = useState(!editing ? true : false);
  const [reminderTime, setReminderTime] = useState(set(new Date(), { hours: 10, minutes: 30 }));
  const [reminderTimePickerVisible, setReminderTimePickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (editing) {
          const data = await getGoalsData();
          const goal = data.goals?.data?.[goalId];
          if (goal) {
            setEditingGoal(goal);
            if (!!goal.reminder) {
              setReminderEnabled(true);
              setReminderTime(new Date(goal.reminder));
            }
            setReady(true);
          }
        }
      })();
    }, [])
  );

  const onValidate = async () => {
    if (loading) return;
    setLoading(true);
    const reminder = reminderEnabled ? reminderTime : null;
    if (!editing) {
      await setGoalTracked({ id: goalId, daysOfWeek: goalDaysOfWeek, label: goalLabel, reminder });
    } else {
      await setGoalTracked({ id: goalId, daysOfWeek: goalDaysOfWeek, reminder });
    }
    setLoading(false);
    navigation.navigate("goals-settings");
  };

  // useEffect(() => {
  //   if (editing && ready) onValidate();
  // }, [reminderEnabled, reminderTime]);

  const [daysOfWeekLabel, setDaysOfWeekLabel] = useState();
  useEffect(() => {
    if (!editingGoal) return;
    const label = getDaysOfWeekLabel(goalDaysOfWeek || editingGoal.daysOfWeek);
    if (label === "all") setDaysOfWeekLabel("Tous les jours");
    else setDaysOfWeekLabel(label);
  }, [editingGoal]);

  if (!ready) return null;

  return (
    <>
      <AnimatedHeaderScrollScreen
        title={!editing ? "Créer un objectif" : "Mon objectif"}
        handlePrevious={() => {
          navigation.goBack();
        }}
        bottomComponent={
          <View className={mergeClassNames("mx-4", Platform.OS === "android" ? "mb-4" : "")}>
            <JMButton fill title={!editing ? "Créer mon objectif" : "Valider"} onPress={onValidate} loading={loading} />
          </View>
        }
        navigation={navigation}
      >
        <View className="mx-4">
          {!editing ? (
            <>
              <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mt-8 mb-2")}>Programmer un rappel</Text>
              <Text className={mergeClassNames(typography.textMdMedium, "text-primary-800 mb-8 ")}>
                Souhaitez-vous recevoir une notification pour l'objectif "{goalLabel}" ?
              </Text>
            </>
          ) : (
            <Text className={mergeClassNames("my-4 mt-6 text-cnam-primary-900", typography.textMdSemibold)}>{editingGoal?.label}</Text>
          )}
          <InputGroup containerStyle={styles.spacing} highlight={reminderEnabled}>
            {editing && (
              <InputGroupItem
                label="Récurrence"
                onPress={() => {
                  navigation.navigate("goal-day-selector", {
                    editing: true,
                    goalId,
                    goalDaysOfWeek: goalDaysOfWeek || editingGoal?.daysOfWeek,
                  });
                }}
              >
                <Text style={styles.daysOfWeekValue}>{daysOfWeekLabel}</Text>
                <Icon
                  icon="ArrowUpSvg"
                  color={colors.BLUE}
                  width={12}
                  height={12}
                  styleContainer={{ width: 12, height: 12, marginLeft: 8, transform: [{ rotate: "90deg" }] }}
                />
              </InputGroupItem>
            )}
            <InputGroupItem label="Programmer un rappel" onPress={() => reminderToggleRef?.current?.toggle?.()}>
              <InputToggle
                ref={reminderToggleRef}
                checked={reminderEnabled}
                onCheckedChanged={({ checked }) => {
                  setReminderEnabled(checked);
                }}
              />
            </InputGroupItem>
            {reminderEnabled && (
              <InputGroupItem label="Heure du rappel" onPress={() => setReminderTimePickerVisible(true)}>
                <InputText
                  preset="groupItem"
                  editable={false}
                  onPress={() => setReminderTimePickerVisible(true)}
                  value={format(reminderTime, "H:mm")}
                />
              </InputGroupItem>
            )}
          </InputGroup>
        </View>
      </AnimatedHeaderScrollScreen>
      <TimePicker
        visible={reminderTimePickerVisible}
        selectDate={(date) => {
          setReminderTimePickerVisible(false);
          if (date) {
            const dateTime = dayjs(date);
            if (!dateTime.isValid()) return;
            setReminderTime(set(new Date(), { hours: dateTime.hour(), minutes: dateTime.minute() }));
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
  spacingBottom: {
    marginBottom: 8,
  },
  daysOfWeekValue: {
    fontSize: 14,
    fontFamily: "SourceSans3",
    fontWeight: "700",
    color: colors.BLUE,
  },
});
