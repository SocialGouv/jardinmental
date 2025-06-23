import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingV2StackParamList } from './types';

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

const Stack = createStackNavigator<OnboardingV2StackParamList>();

const OnboardingV2Navigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
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
    >
      <Stack.Screen 
        name="Intro" 
        component={IntroScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
      <Stack.Screen 
        name="Carousel" 
        component={CarouselScreen}
      />
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

      {/* First Check In */}
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
      <Stack.Screen 
        name="OnboardingReminder" 
        component={ReminderScreen}
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
