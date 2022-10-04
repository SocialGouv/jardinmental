import React, { useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

import OnboardingPresentation from "./onboarding";
import OnboardingSupported from "./onboardingSupported";
import OnboardingSymptoms from "./onboardingSymptoms";
import OnboardingExplanation from "./onboardingExplanation/screen0";
import OnboardingDrugs from "./onboardingDrugs";
import OnboardingHint from "./onboardingHint";
import Reminder from "../reminder";
import { ONBOARDING_STEPS } from "../../utils/constants";
import OnboardingExplanationScreen1 from "./onboardingExplanation/screen1";
import { OnboardingMood } from "./onboardingSymptomsStart/MoodScreen";
import { OnboardingSleep } from "./onboardingSymptomsStart/SleepScreen";
import { OnboardingSimpleCustomSymptoms } from "./onboardingSymptomsCustom/SimpleCustomScreen";
import { OnboardingGoals } from "./onboardingGoals/goals";
import OnboardingFelicitation from "./onboardingFelicitation";
import { progressHeaderOptions, ProgressScreen, useOnboardingProgressHeader } from "./ProgressHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const Onboarding = () => {
  return (
    <Stack.Navigator initialRouteName={ONBOARDING_STEPS.STEP_CGU} headerMode="none">
      <Stack.Screen name={ONBOARDING_STEPS.STEP_CGU} component={OnboardingPresentation} />
      {/* <Stack.Screen name={ONBOARDING_STEPS.STEP_SUPPORTED} component={OnboardingSupported} /> */}
      <Stack.Screen name={ONBOARDING_STEPS.STEP_EXPLANATION} component={OnboardingExplanation} />
      <Stack.Screen name={ONBOARDING_STEPS.STEP_SYMPTOMS} component={OnboardingSymptoms} />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_REMINDER}
        component={Reminder}
        initialParams={{ onboarding: true }}
      />
      <Stack.Screen name={ONBOARDING_STEPS.STEP_HINT} component={OnboardingHint} />
      <Stack.Screen name={ONBOARDING_STEPS.STEP_DRUGS} component={OnboardingDrugs} />
      <Stack.Screen name="deepOnboarding">{(props) => <DeepOnboarding {...props} />}</Stack.Screen>
    </Stack.Navigator>
  );
};

const DeepStack = createStackNavigator();

const DeepOnboarding = () => {
  const insets = useSafeAreaInsets();

  const { setIsVisible } = useOnboardingProgressHeader();
  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      return () => {
        setIsVisible(false);
      };
    }, [])
  );

  const slidesCount = 9;

  return (
    <DeepStack.Navigator
      initialRouteName={"supported"}
      screenOptions={{ ...progressHeaderOptions({ insets, slidesCount }) }}
    >
      <DeepStack.Screen
        name={ONBOARDING_STEPS.STEP_SUPPORTED}
        component={ProgressScreen({ slideIndex: 1, Component: OnboardingSupported })}
      />
      <DeepStack.Screen
        name="onboarding-explanation-indicator-1"
        component={ProgressScreen({ slideIndex: 2, Component: OnboardingExplanationScreen1 })}
      />
      <DeepStack.Screen
        name="onboarding-symptoms-mood"
        component={ProgressScreen({ slideIndex: 3, Component: OnboardingMood })}
      />
      <DeepStack.Screen
        name="onboarding-symptoms-sleep"
        component={ProgressScreen({ slideIndex: 4, Component: OnboardingSleep })}
      />
      <DeepStack.Screen
        name="onboarding-symptoms-custom-simple"
        component={ProgressScreen({ slideIndex: 5, Component: OnboardingSimpleCustomSymptoms })}
      />
      <DeepStack.Screen
        name="onboarding-goals"
        component={ProgressScreen({ slideIndex: 6, Component: OnboardingGoals })}
      />
      <DeepStack.Screen name="reminder" component={ProgressScreen({ slideIndex: 7, Component: Reminder })} />
      <DeepStack.Screen
        name="onboarding-drugs"
        component={ProgressScreen({ slideIndex: 8, Component: OnboardingDrugs })}
      />
      <DeepStack.Screen
        name="onboarding-felicitation"
        component={ProgressScreen({ slideIndex: 9, Component: OnboardingFelicitation })}
      />
    </DeepStack.Navigator>
  );
};

export default Onboarding;
