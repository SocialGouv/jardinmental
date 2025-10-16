import React, { useEffect, useRef, useState } from "react";
import { Alert, View, TouchableOpacity, StyleSheet, ScrollView, Linking, Text } from "react-native";
// import { openSettings } from "react-native-permissions";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import localStorage from "../../utils/localStorage";
import { ONBOARDING_STEPS, TW_COLORS } from "../../utils/constants";
import TimePicker from "../../components/timePicker";
import NotificationService from "../../services/notifications";
import { colors } from "../../utils/colors";
import logEvents from "../../services/logEvents";
import API from "../../services/api";
import * as RNLocalize from "react-native-localize";
import BeigeWrapperScreen from "../onboarding-v2/BeigeWrapperScreen";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import Pencil from "@assets/svg/icon/Pencil";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import JMButton from "@/components/JMButton";

const ReminderStorageKey = "@Reminder";

const Reminder = ({
  navigation,
  route,
  notifReminderTitle = "Comment ça va aujourd'hui ?",
  notifReminderMessage = "N'oubliez pas de remplir votre application Jardin Mental",
}) => {
  const [reminder, setReminder] = useState<dayjs.Dayjs | null>(null);
  const [reminderSetupVisible, setReminderSetupVisible] = useState(false);

  // Default reminder time constant
  const DEFAULT_REMINDER_TIME = "20:00";

  // Helper function to safely format reminder time with fallback
  const formatReminderTime = (reminderDate: dayjs.Dayjs | null): string => {
    if (!reminderDate || !dayjs(reminderDate).isValid()) {
      // Return default time when reminder is null or invalid
      return DEFAULT_REMINDER_TIME;
    }
    return dayjs(reminderDate).format("HH:mm");
  };

  const getReminder = async (showAlert = true) => {
    const isRegistered = await NotificationService.checkPermission();
    let storedReminder = await AsyncStorage.getItem(ReminderStorageKey);
    if (storedReminder) {
      if (!dayjs(storedReminder).isValid()) {
        try {
          storedReminder = JSON.parse(storedReminder);
        } catch (e) {}
      }
    }
    if (Boolean(storedReminder) && !dayjs(storedReminder).isValid()) {
      deleteReminder();
    }
    if (!isRegistered && storedReminder && showAlert) showPermissionsAlert();
    if (!storedReminder) {
      const date = new Date();
      date.setHours(20, 0, 0, 0);
      setReminderRequest(date);
      return;
    }
    const scheduled = await NotificationService.getScheduledLocalNotifications();
    if (!storedReminder) return;
    setReminder(dayjs(storedReminder));
  };

  const handleNotification = (notification) => {
    if (notification.title === notifReminderTitle) {
      navigation.navigate("tabs");
    }
  };

  const notificationListener = useRef();
  useEffect(() => {
    getReminder(false);
    notificationListener.current = NotificationService.listen(handleNotification, "reminder");
    void localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_REMINDER);
    // return () => NotificationService.remove(notificationListener.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleNotification = async (newReminder = new Date(Date.now() + 10 * 1000)) => {
    const fireDate = dayjs().set("hours", newReminder.getHours()).set("minutes", newReminder.getMinutes()).set("seconds", 0).toDate();

    if (!(await NotificationService.hasToken())) return;

    await API.put({
      path: "/reminder",
      body: {
        pushNotifToken: await NotificationService.getToken(),
        type: "Main",
        timezone: RNLocalize.getTimeZone(),
        timeHours: newReminder.getHours(),
        timeMinutes: newReminder.getMinutes(),
        disabled: false,
      },
    });
    logEvents.logReminderAdd();
  };

  const showReminderSetup = () => {
    logEvents.logEditReminder();
    setReminderSetupVisible(true);
  };

  const showPermissionsAlert = () => {
    Alert.alert(
      "Vous devez autoriser les notifications pour accéder à ce service",
      "Veuillez cliquer sur Réglages puis Notifications pour activer les notifications",
      [
        {
          text: "Réglages",
          onPress: () => Linking.openSettings(),
        },
        {
          text: "Annuler",
          onPress: deleteReminder,
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const setReminderRequest = async (newReminder) => {
    setReminderSetupVisible(false);
    if (!dayjs(newReminder).isValid()) return;
    await scheduleNotification(newReminder);
    setReminder(dayjs(newReminder));
    logEvents.logReminderObdEdit(Number(dayjs(newReminder).format("HHmm")));
    await AsyncStorage.setItem(ReminderStorageKey, JSON.stringify(dayjs(newReminder)));
    setReminderSetupVisible(false);
    const scheduled = await NotificationService.getScheduledLocalNotifications();
  };

  const deleteReminder = async () => {
    setReminder(null);
    setReminderSetupVisible(false);
    await AsyncStorage.removeItem(ReminderStorageKey);
  };

  const validateOnboarding = async () => {
    // navigation.navigate(ONBOARDING_STEPS.STEP_DRUGS);
    const isRegistered = await NotificationService.checkAndAskForPermission();
    if (!isRegistered) {
      showPermissionsAlert();
      return;
    }
    await localStorage.setOnboardingDone(true);
    // await localStorage.setOnboardingStep(null);
    if (route?.params?.onboarding) {
      // only in onboarding
      logEvents.logReminderObd(1);
      navigation.reset({
        index: 0,
        routes: [{ name: "tabs" }],
      });
    } else {
      navigation.navigate("tabs");
    }
  };

  const desactivateReminder = async () => {
    logEvents.logReminderCancel();
    await deleteReminder();
    if (!(await NotificationService.hasToken())) return;

    await API.put({
      path: "/reminder",
      body: {
        pushNotifToken: await NotificationService.getToken(),
        type: "Main",
        disabled: true,
      },
    });
    await localStorage.setOnboardingDone(true);
    // await localStorage.setOnboardingStep(null);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "tabs",
          params: {
            onboarding: true,
          },
        },
      ],
    });
  };

  const skip = () => {
    logEvents.logReminderObd(0);
    navigation.navigate("tabs");
  };

  return (
    <BeigeWrapperScreen
      variant="blue"
      handlePrevious={() => {
        logEvents.logOnboardingBack(18);
        navigation.goBack();
      }}
      nextText="Programmer mon rappel quotidien"
      secondaryButton={route?.params?.onboarding ? <JMButton variant="outline" onPress={skip} title="Passer" className="mb-2" /> : undefined}
      handleSkip={route?.params?.onboarding ? skip : undefined}
      handleNext={validateOnboarding}
    >
      <View className="flex-1 p-6 z-10 flex justify-center">
        <Text className={mergeClassNames(typography.displayXsBold, "text-gray-950 mb-6 text-left")}>Trouvez votre rythme</Text>
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800 text-left mb-6")}>
          Programmer un rappel quotidien peut vous aider à installer une routine bienveillante.
        </Text>
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-800 text-left mb-6")}>
          Consigner chaque jour votre état permet de découvrir progressivement ce qui vous fait du bien, et ce qui vous freine.
        </Text>
        <SquircleButton
          onPress={showReminderSetup}
          preserveSmoothing={true}
          cornerSmoothing={100}
          style={{
            borderWidth: 1,
            borderColor: TW_COLORS.GRAY_500,
            borderRadius: 32,
          }}
          className="px-10 py-6 items-center justify-center mb-6 bg-white w-auto self-center"
        >
          <Text className={mergeClassNames(typography.textSmMedium, "mb-2")}> Recevez un rappel à:</Text>
          <SquircleView
            preserveSmoothing={true}
            cornerSmoothing={100}
            style={{
              borderWidth: 2,
              borderColor: TW_COLORS.CNAM_PRIMARY_700,
              borderRadius: 16,
            }}
            className="py-3 pt-5 px-8 flew-column"
          >
            <Text className="font-bold text-5xl text-brand-600 leading-[56px]">{formatReminderTime(reminder)}</Text>
          </SquircleView>
          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-base mr-2 items-center justify-center">Éditer</Text>
            <Pencil color={TW_COLORS.BRAND_700} width={16} height={16} />
          </View>
        </SquircleButton>
      </View>
      <TimePicker
        visible={reminderSetupVisible}
        selectDate={setReminderRequest}
        value={
          reminder
            ? reminder.toDate()
            : (() => {
                const defaultDate = new Date();
                defaultDate.setHours(20, 0, 0, 0);
                return defaultDate;
              })()
        }
      />
    </BeigeWrapperScreen>
  );
};

export default Reminder;
