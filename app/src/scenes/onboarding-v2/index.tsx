import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingV2StackParamList } from './types';
import { OnboardingProvider } from './context/OnboardingContext';

// Import des écrans
import IntroScreen from './screens/IntroScreen';
import ProfileScreen from './screens/ProfileScreen';
import CarouselScreen from './screens/CarouselScreen';
import DifficultiesScreen from './screens/personalization/DifficultiesScreen';
import ObjectiveScreen from './screens/personalization/ObjectiveScreen';
import CarouselPersonalizationScreen from './screens/personalization/CarouselPersonalizationScreen';
import OnboardingPersonalizationStartScreen from './screens/personalization/OnboardingPersonalizationStartScreen';
import OnboardingCheckInStartScreen from './screens/checkIn/OnboardingCheckInStartScreen';
import OnboardingCheckInHowDoYouFeelScreen from './screens/checkIn/mood/OnboardingCheckInHowDoYouFeelScreen';
import OnboardingCheckInLastMoodsScreen from './screens/checkIn/mood/OnboardingCheckInHowDoYouFeelDetailsScreen';
import OnboardingCheckInSleepScreen from './screens/checkIn/sleep/OnboardingCheckInSleepScreen';
import OnboardingCheckInMoodSummaryScreen from './screens/checkIn/mood/OnboardingCheckInMoodSummaryScreen';
import OnboardingCheckInIntroductionCompletedScreen from './screens/checkIn/OnboardingCheckInIntroductionCompletedScreen';
import OnboardingChooseIndicatorScreen from './screens/indicators/OnboardingChooseIndicatorScreen';
import ReminderScreen from './screens/reminder/ReminderScreen';

const Stack = createStackNavigator<OnboardingV2StackParamList>();

const OnboardingV2Navigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Désactiver les gestes de retour
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
      {/* <Stack.Screen 
        name="Personalization" 
        component={CarouselPersonalizationScreen}
      /> */}
      {/* Peronalization */}
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
    <OnboardingProvider>
      <OnboardingV2Navigator />
    </OnboardingProvider>
  );
};

export default OnboardingV2;
