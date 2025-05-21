import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import NotificationService from "../../services/notifications";
import API from "../../services/api";
import * as Localization from "expo-localization";
import { getGoalsTracked, updateApiReminer } from "../../utils/localStorage/goals";

const ReminderStorageKey = "@Reminder";

const REMINDER_VERSION_OLDER_154 = "REMINDER_VERSION_OLDER_154";
export const checkOldReminderBefore154 = async () => {
  const deleteOldReminder = async () => {
    NotificationService.cancelAll();
    await AsyncStorage.removeItem(ReminderStorageKey);
  };

  const alreadyChecked = await AsyncStorage.getItem(REMINDER_VERSION_OLDER_154);
  if (alreadyChecked === "1") return;

  let storedReminder = await AsyncStorage.getItem(ReminderStorageKey);

  if (storedReminder) {
    if (!dayjs(storedReminder).isValid()) {
      try {
        storedReminder = JSON.parse(storedReminder);
      } catch (e) {
        await deleteOldReminder();
        await AsyncStorage.setItem(REMINDER_VERSION_OLDER_154, "1");
        return;
      }
    }
  }

  if (Boolean(storedReminder) && !dayjs(storedReminder).isValid()) {
    await deleteOldReminder();
    await AsyncStorage.setItem(REMINDER_VERSION_OLDER_154, "1");
    return;
  }

  if (!Boolean(storedReminder)) {
    await AsyncStorage.setItem(REMINDER_VERSION_OLDER_154, "1");
    return;
  }

  storedReminder = dayjs(storedReminder);

  if (!(await NotificationService.hasToken())) return;
  await deleteOldReminder();
  await API.put({
    path: "/reminder",
    body: {
      pushNotifToken: await NotificationService.getToken(),
      type: "Main",
      timezone: Localization.timezone,
      timeHours: storedReminder.hour(),
      timeMinutes: storedReminder.minute(),
    },
  });
  await AsyncStorage.setItem(REMINDER_VERSION_OLDER_154, "1");
};

const REMINDER_VERSION_OLDER_193 = "REMINDER_VERSION_OLDER_193";
export const checkOldReminderBefore193 = async () => {
  const alreadyChecked = await AsyncStorage.getItem(REMINDER_VERSION_OLDER_193);
  if (alreadyChecked === "1") return;

  if (!(await NotificationService.hasToken())) return;

  const pushNotifToken = await NotificationService.getToken();

  let storedReminder = await AsyncStorage.getItem(ReminderStorageKey);
  if (Boolean(storedReminder) && !dayjs(storedReminder).isValid()) {
    try {
      storedReminder = JSON.parse(storedReminder);
    } catch (e) {
      storedReminder = null;
    }
  }
  if (Boolean(storedReminder) && dayjs(storedReminder).isValid()) {
    storedReminder = dayjs(storedReminder);
    await API.put({
      path: "/reminder",
      body: {
        pushNotifToken,
        type: "Main",
        timezone: Localization.timezone,
        timeHours: storedReminder.hour(),
        timeMinutes: storedReminder.minute(),
      },
    });
  }

  const goals = await getGoalsTracked();
  for (const goal of goals) {
    await updateApiReminer(goal);
  }

  await AsyncStorage.setItem(REMINDER_VERSION_OLDER_193, "1");
};
