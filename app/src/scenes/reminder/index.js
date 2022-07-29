import React from "react";
import ReminderOnboarding from "./reminderOnboarding";
import Reminder from "./reminder";

const ReminderIndex = (props) => {
  if (props?.route?.params?.onboarding) return <ReminderOnboarding {...props} />;
  return <Reminder {...props} />;
};

export default ReminderIndex;
