import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import NotificationService from "../../services/notifications";

const ReminderStorageKey = "@Reminder";

const REMINDER_VERSION_OLDER_154 = "REMINDER_VERSION_OLDER_154";
export const checkReminderForVersionOlderThan154 = async () => {
  const alreadyChecked = await AsyncStorage.getItem(REMINDER_VERSION_OLDER_154);
  if (Boolean(alreadyChecked)) return;

  const storedReminder = await AsyncStorage.getItem(ReminderStorageKey);

  if (storedReminder) {
    if (!dayjs(storedReminder).isValid()) {
      try {
        storedReminder = JSON.parse(storedReminder);
      } catch (e) {
        return;
      }
    }
  }
  if (Boolean(storedReminder) && !dayjs(storedReminder).isValid()) {
    await deleteReminder();
    return;
  }

  if (!Boolean(storedReminder)) {
    await AsyncStorage.setItem(REMINDER_VERSION_OLDER_154, true);
    return;
  }
};

const deleteReminder = async () => {
  NotificationService.cancelAll();
  await AsyncStorage.removeItem(ReminderStorageKey);
};
