import React from "react";
import ReminderOnboarding from "./reminderOnboarding";

const ReminderIndex = (props) => {
  return <ReminderOnboarding {...props} />;
  // if (props?.route?.params?.onboarding) return <ReminderOnboarding {...props} />;
  // return <Reminder {...props} />;
};

export default ReminderIndex;
