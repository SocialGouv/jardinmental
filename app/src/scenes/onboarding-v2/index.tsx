import React, { useEffect, useState, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingV2StackParamList } from './types';
import localStorage from '../../utils/localStorage';

import IntroScreen from './IntroScreen';
import ProfileScreen from './ProfileScreen';
import CarouselScreen from './CarouselScreen';
import DifficultiesScreen from './personalization/DifficultiesScreen';
import ObjectiveScreen from './personalization/ObjectiveScreen';
import OnboardingPersonalizationStartScreen from './personalization/OnboardingPersonalizationStartScreen';
import OnboardingCheckInStartScreen from './checkIn/OnboardingCheckInStartScreen';
import OnboardingCheckInHowDoYouFeelScreen from './checkIn/mood/OnboardingCheckInHowDoYouFeelScreen';
import OnboardingCheckInLastMoodsScreen from './checkIn/mood/OnboardingCheckInHowDoYouFeelDetailsScreen';
import OnboardingCheckInSleepScreen from './checkIn/sleep/OnboardingCheckInSleepScreen';
import OnboardingCheckInMoodSummaryScreen from './checkIn/mood/OnboardingCheckInMoodSummaryScreen';
import OnboardingCheckInIntroductionCompletedScreen from './checkIn/OnboardingCheckInIntroductionCompletedScreen';
import OnboardingChooseIndicatorScreen from './indicators/OnboardingChooseIndicatorScreen';
import ReminderScreen from './reminder/ReminderScreen';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { progressHeaderOptions } from '../onboarding/ProgressHeader';

const Stack = createStackNavigator<OnboardingV2StackParamList>();

// Valid screen names for validation
export const VALID_SCREEN_NAMES: (keyof OnboardingV2StackParamList)[] = [
  'Intro',
  'Profile',
  'Carousel',
  'PersonalizationStart',
  'PersonalizationDifficulties',
  'PersonalizationObjective',
  'OnboardingCheckInStart',
  'OnboardingCheckInHowDoYouFeel',
  'OnboardingCheckInHowDoYouFeelDetails',
  'OnboardingCheckInMoodSummary',
  'OnboardingCheckInSleep',
  'OnboardingCheckInIntroductionCompleted',
  'OnboardingChooseIndicator',
  'OnboardingReminder',
];

const OnboardingV2Navigator: React.FC = () => {
  const [initialRouteName, setInitialRouteName] = useState<keyof OnboardingV2StackParamList>('Intro');
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const slidesCount = 10;
  const headerOptions = progressHeaderOptions({ insets, slidesCount });

  useEffect(() => {
    const setupStack = async () => {
      const onboardingStep = await localStorage.getOnboardingStep() as keyof OnboardingV2StackParamList;

      if (onboardingStep && VALID_SCREEN_NAMES.includes(onboardingStep)) {
        const index = VALID_SCREEN_NAMES.indexOf(onboardingStep);
        const routes = VALID_SCREEN_NAMES.slice(0, index + 1).map(name => ({ name: name as never, key: name }));

        navigation.reset({
          index,
          routes,
        });
      }
    };

    setupStack();
  }, [navigation]);


  // Handle navigation state changes - save current screen automatically
  const handleNavigationStateChange = useCallback(async (state: any) => {
    if (state && state.routes && state.routes.length > 0) {
      const currentRoute = state.routes[state.index];
      const currentScreenName = currentRoute.name;

      try {
        await localStorage.setOnboardingStep(currentScreenName);
      } catch (error) {
        console.error('Error saving navigation state:', error);
      }
    }
  }, []);


  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
      screenListeners={{
        state: (e) => {
          handleNavigationStateChange(e.data.state);
        },
      }}
    >
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="Carousel"
        component={CarouselScreen}
      />
      {/* Use header */}
      <Stack.Screen
        name="PersonalizationStart"
        component={OnboardingPersonalizationStartScreen}
      />
      <Stack.Screen
        name="PersonalizationDifficulties"
        component={DifficultiesScreen}
      />
      <Stack.Screen
        name="PersonalizationObjective"
        component={ObjectiveScreen}
      />
      <Stack.Screen
        name="OnboardingCheckInStart"
        component={OnboardingCheckInStartScreen}
      />
      <Stack.Screen
        name="OnboardingCheckInHowDoYouFeel"
        component={OnboardingCheckInHowDoYouFeelScreen}
      />
      <Stack.Screen
        name="OnboardingCheckInHowDoYouFeelDetails"
        component={OnboardingCheckInLastMoodsScreen}
      />
      <Stack.Screen
        name="OnboardingCheckInMoodSummary"
        component={OnboardingCheckInMoodSummaryScreen}
      />
      <Stack.Screen
        name="OnboardingCheckInSleep"
        component={OnboardingCheckInSleepScreen}
      />
      <Stack.Screen
        name="OnboardingCheckInIntroductionCompleted"
        component={OnboardingCheckInIntroductionCompletedScreen}
      />
      <Stack.Screen
        name="OnboardingChooseIndicator"
        component={OnboardingChooseIndicatorScreen}
      />
    </Stack.Navigator>
  );
};

const OnboardingV2: React.FC = () => {
  return (
    <OnboardingV2Navigator />
  );
};

export default OnboardingV2;
