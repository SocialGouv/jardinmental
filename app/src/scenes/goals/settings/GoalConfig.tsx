import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Alert, Linking } from "react-native";
import { getDaysOfWeekLabel, getGoalsData, setGoalTracked } from "../../../utils/localStorage/goals";
import NotificationService from "@/services/notifications";
import { InputGroup, InputGroupItem } from "../../../components/InputGroup";
import { InputToggle } from "../../../components/InputToggle";
import TimePicker from "../../../components/timePicker";
import { InputText } from "../../../components/InputText";
import dayjs from "dayjs";
import { format, set } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "../../../components/Icon";
import { colors } from "@/utils/colors";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "@/scenes/survey-v2/AnimatedHeaderScrollScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { confirm } from "@/utils";
import logEvents from "@/services/logEvents";
import { addPushTokenListener } from "expo-notifications";
import { Typography } from "@/components/Typography";

export const GoalConfig = ({ navigation, route }) => {
  const goalId = route.params?.goalId;
  const goalLabel = route.params?.goalLabel;
  const goalDaysOfWeek = route.params?.goalDaysOfWeek;
  const editing = route.params?.editing;
  const [editingGoal, setEditingGoal] = useState();
  const [reminderHasChanged, setReminderHasChanged] = useState<boolean>(false);
  const [ready, setReady] = useState(!editing ? true : false);
  const [loading, setLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState<boolean>(false);
  const reminderToggleRef = useRef();
  const [reminderEnabled, setReminderEnabled] = useState(!editing ? true : false);
  const [reminderTime, setReminderTime] = useState(set(new Date(), { hours: 10, minutes: 30 }));
  const [reminderTimePickerVisible, setReminderTimePickerVisible] = useState(false);

  // useEffect(() => {
  //   const tokenListener = addPushTokenListener((token) => {
  //     console.log(token);
  //   });

  //   return () => {
  //     if (tokenListener) {
  //       tokenListener.remove();
  //     }
  //   };
  // }, []);

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

  const showPermissionsAlert = () => {
    Alert.alert(
      "Vous devez autoriser les notifications.",
      "Pour programmer un rappel il faut activer les notifications. Veuillez cliquer sur Réglages puis Notifications pour activer les notifications.",
      [
        {
          text: "Réglages",
          onPress: () => {
            Linking.openSettings();
          },
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const onValidate = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Vérifier les permissions si un rappel est activé
      if (reminderEnabled) {
        const isRegistered = await NotificationService.checkAndAskForPermission();
        if (!isRegistered) {
          showPermissionsAlert();
          setLoading(false);
          return;
        }
      }

      const reminder = reminderEnabled ? reminderTime : null;
      if (!editing) {
        await setGoalTracked({ id: goalId, daysOfWeek: goalDaysOfWeek, label: goalLabel, reminder });
        logEvents.logAddObjectivePersonalized();
      } else {
        await setGoalTracked({ id: goalId, daysOfWeek: goalDaysOfWeek, reminder });
        if (reminderHasChanged) {
          logEvents.logEditObjectiveReminder();
        }
      }
      navigation.navigate("goals-settings");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'objectif:", error);
      alert("Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const onDeactivate = async () => {
    if (loading) return;
    setDeactivateLoading(true);
    confirm({
      title: "Êtes-vous sûr de vouloir désactiver votre objectif ?",
      onConfirm: async () => {
        try {
          await setGoalTracked({
            id: goalId,
            enabled: false,
          });
          navigation.goBack();
        } catch (error) {
          console.error("Erreur lors de la désactivation de l'objectif:", error);
          alert("Une erreur est survenue lors de la désactivation. Veuillez réessayer.");
        } finally {
          setDeactivateLoading(false);
        }
      },
      onCancel: () => {
        setDeactivateLoading(false);
      },
      cancelText: "Non",
      confirmText: "Oui",
    });
  };

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
          <NavigationButtons absolute={true}>
            <>
              {editing && <JMButton className="mb-2" variant="outline" title={"Désactiver"} onPress={onDeactivate} loading={deactivateLoading} />}
              <JMButton title={!editing ? "Créer mon objectif" : "Valider"} onPress={onValidate} loading={loading} />
            </>
          </NavigationButtons>
        }
        navigation={navigation}
      >
        <View className="mx-4">
          {!editing ? (
            <>
              <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mt-8 mb-2")}>Programmer un rappel</Typography>
              <Typography className={mergeClassNames(typography.textMdMedium, "text-primary-800 mb-8 ")}>
                Souhaitez-vous recevoir une notification pour l'objectif "{goalLabel}" ?
              </Typography>
            </>
          ) : (
            <Typography className={mergeClassNames("my-4 mt-6 text-cnam-primary-900", typography.textMdSemibold)}>{editingGoal?.label}</Typography>
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
                <Typography style={styles.daysOfWeekValue}>{daysOfWeekLabel}</Typography>
                <Icon
                  icon="ArrowUpSvg"
                  color={colors.BLUE}
                  width={12}
                  height={12}
                  styleContainer={{ width: 12, height: 12, marginLeft: 8, transform: [{ rotate: "90deg" }] }}
                />
              </InputGroupItem>
            )}
            <InputGroupItem
              label="Programmer un rappel"
              onPress={() => {
                reminderToggleRef?.current?.toggle?.();
                setReminderHasChanged(true);
              }}
            >
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
            setReminderHasChanged(true);
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
    fontFamily: "SourceSans3-Bold",
    fontWeight: "700",
    color: colors.BLUE,
  },
});
