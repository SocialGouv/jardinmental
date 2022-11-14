import React from "react";
import ReminderOnboarding from "./reminderOnboarding";
import Reminder from "./reminder";

export const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const ReminderIndex = (props) => {
  if (props?.route?.params?.onboarding) return <ReminderOnboarding {...props} />;
  return <Reminder {...props} />;
};

export default ReminderIndex;
