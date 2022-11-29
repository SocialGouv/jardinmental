import API from "../../services/api";
import NotificationService from "../../services/notifications";
import * as RNLocalize from "react-native-localize";
import { add } from "date-fns";
import { DAYS_OF_WEEK } from "../../utils/date/daysOfWeek";

export const updateInactivityReminder = async () => {
  if (!(await NotificationService.hasToken())) return;

  const nextDate = add(new Date(), {
    hours: -1,
  });

  await API.put({
    path: "/reminder",
    body: {
      pushNotifToken: await NotificationService.getToken(),
      type: "Inactivity",
      timezone: RNLocalize.getTimeZone(),
      timeHours: nextDate.getHours(),
      timeMinutes: nextDate.getMinutes(),
      daysOfWeek: {
        ...DAYS_OF_WEEK.reduce((acc, day, index) => {
          if (nextDate.getDay() === index) acc[day] = true;
          else acc[day] = false;
          return acc;
        }, {}),
      },
    },
  });
};
