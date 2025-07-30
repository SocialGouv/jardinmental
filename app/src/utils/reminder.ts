import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import NotificationService from '@/services/notifications'

const ReminderStorageKey = "@Reminder"

export async function isReminderActive():Promise<boolean> {
    const isRegistered = await NotificationService.checkPermission();
    let storedReminder = await AsyncStorage.getItem(ReminderStorageKey);
    if (storedReminder) {
        if (!dayjs(storedReminder).isValid()) {
        try {
            storedReminder = JSON.parse(storedReminder);
        } catch (e) { }
        }
    }
    return !!(isRegistered && storedReminder)
}