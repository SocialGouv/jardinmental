import React, { useCallback, useRef, useEffect } from "react";
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
import { OnboardingCustomMore } from "./onboardingCustomMore";
import { trackScreen } from "@screeb/react-native";

const Onboarding = () => {
  const { setIsVisible } = useOnboardingProgressHeader();
  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      return () => {
        setIsVisible(false);
      };
    }, [])
  );
  const navigationRef = useRef();

  const insets = useSafeAreaInsets();
  const slidesCount = 10;
  const headerOptions = progressHeaderOptions({ insets, slidesCount });

  const onStateChange = async () => {
    if (!navigationRef.current) return;
    const route = navigationRef.current.getCurrentRoute();
    if (route.name === onStateChange.prevCurrentRouteName) return;
    trackScreen(route.name);
    onStateChange.prevCurrentRouteName = route.name;
  };

  useEffect(() => {
    onStateChange.prevCurrentRouteName = null;
  }, []);

  return (
    <Stack.Navigator
      ref={navigationRef}
      onStateChange={onStateChange}
      initialRouteName={ONBOARDING_STEPS.STEP_CGU}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ONBOARDING_STEPS.STEP_CGU} component={OnboardingPresentation} />

      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_SUPPORTED}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 1, Component: OnboardingSupported })}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_EXPLANATION}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 2, Component: OnboardingExplanationScreen1 })}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_SYMPTOMS}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 3, Component: OnboardingMood })}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_SYMPTOMS_SLEEP}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 4, Component: OnboardingSleep })}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_SYMPTOMS_CUSTOM}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 5, Component: OnboardingSimpleCustomSymptoms })}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_GOALS}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 6, Component: OnboardingGoals })}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_REMINDER}
        initialParams={{ onboarding: true }}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 7, Component: Reminder })}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.STEP_DRUGS}
        initialParams={{ onboarding: true }}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 8, Component: OnboardingDrugs })}
      />
      <Stack.Screen
        name={"onboarding-custom-more"}
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 9, Component: OnboardingCustomMore })}
      />
      <Stack.Screen
        name="onboarding-felicitation"
        options={headerOptions}
        component={ProgressScreen({ slideIndex: 10, Component: OnboardingFelicitation })}
      />
    </Stack.Navigator>
  );
};

export default Onboarding;
