import React, { useState } from "react";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";

import ReminderItem from "./reminder-item";
import ExportItem from "./export-item";
const ReminderStorageKey = "@Reminder";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Bubble() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [reminderItemVisible, setReminderItemVisible] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const reminder = await AsyncStorage.getItem(ReminderStorageKey);
        setReminderItemVisible(!reminder);
      })();
    }, [])
  );

  const onPressReminder = () => navigation.navigate("reminder");
  const onPressExport = () => navigation.navigate("export");

  if (reminderItemVisible) return <ReminderItem onPress={onPressReminder} />;
  return <ExportItem onPress={onPressExport} />;
}
