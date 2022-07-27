import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

import OnboardingPresentation from "./onboarding";
import OnboardingSupported from "./onboardingSupported";
import OnboardingSymptoms from "./onboardingSymptoms";
import OnboardingDrugs from "./onboardingDrugs";
import OnboardingHint from "./onboardingHint";
import Reminder from "../reminder/reminder";
import { ONBOARDING_STEPS } from "../../utils/constants";

const Onboarding = () => {
  return (
    <Stack.Navigator initialRouteName="OnboardingPresentation" headerMode="none">
      <Stack.Screen name={ONBOARDING_STEPS.STEP_CGU} component={OnboardingPresentation} />
      <Stack.Screen name={ONBOARDING_STEPS.STEP_SUPPORTED} component={OnboardingSupported} />
      <Stack.Screen name={ONBOARDING_STEPS.STEP_SYMPTOMS} component={OnboardingSymptoms} />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_REMINDER}
        component={Reminder}
        initialParams={{ onboarding: true }}
      />
      <Stack.Screen name={ONBOARDING_STEPS.STEP_HINT} component={OnboardingHint} />
      <Stack.Screen name={ONBOARDING_STEPS.STEP_DRUGS} component={OnboardingDrugs} />
    </Stack.Navigator>
  );
};

export default Onboarding;
