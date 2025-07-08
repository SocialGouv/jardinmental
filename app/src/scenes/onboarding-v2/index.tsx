import React, { useEffect, useState, useCallback } from 'react';
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
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
import { progressHeaderOptions, ProgressScreen } from '../onboarding/ProgressHeader';
import { SHARED_HEADER, PROGRESS_BAR } from '@/utils/constants';
import { EncouragementScreen } from '../survey-v2/EncouragementScreen';

const Stack = createStackNavigator<OnboardingV2StackParamList>();

// Valid screen names for validation
export const VALID_SCREEN_NAMES: (keyof OnboardingV2StackParamList)[] = [
  'Intro',
  // 'Profile',
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
  const slidesCount = 3;
  const headerOptions = progressHeaderOptions({ insets, slidesCount });

  // useEffect(() => {
  //   const setupStack = async () => {
  //     const onboardingStep = await localStorage.getOnboardingStep() as keyof OnboardingV2StackParamList;

  //     if (onboardingStep && VALID_SCREEN_NAMES.includes(onboardingStep)) {
  //       const index = VALID_SCREEN_NAMES.indexOf(onboardingStep);
  //       const routes = VALID_SCREEN_NAMES.slice(0, index + 1).map(name => ({ name: name as never, key: name }));

  //       navigation.reset({
  //         index,
  //         routes,
  //       });
  //     }
  //   };

  //   setupStack();
  // }, [navigation]);


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

  const IntroChooseIndicatorScreen = () => <EncouragementScreen
    navigation={navigation}
    currentStep={0}
    totalSteps={0}
    title={'Merci d’avoir pris ce moment pour observer votre sommeil.'}
    description={''}
    extraInfo={'En France, 32 % des adultes se déclarent insatisfaits de leur sommeil.\nEn faire le suivi, c’est déjà prendre soin de soi. (ifop mars 2022)'}
    onNext={() => navigation.navigate('OnboardingChooseIndicatorInto')} />


  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        // cardStyleInterpolator: ({ current, layouts }) => {
        //   return {
        //     cardStyle: {
        //       transform: [
        //         {
        //           translateX: current.progress.interpolate({
        //             inputRange: [0, 1],
        //             outputRange: [layouts.screen.width, 0],
        //           }),
        //         },
        //       ],
        //     },
        //   };
        // },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        }
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
        options={SHARED_HEADER || PROGRESS_BAR ? headerOptions : undefined}
        component={ProgressScreen({
          slideIndex: 0,
          showProgressbar: true,
          title: 'Créons ensemble un suivi qui vous ressemble.',
          Component: OnboardingPersonalizationStartScreen
        })}
      />
      <Stack.Screen
        name="PersonalizationDifficulties"
        options={SHARED_HEADER || PROGRESS_BAR ? headerOptions : undefined}
        component={ProgressScreen({
          slideIndex: 1,
          showProgressbar: true,
          Component: DifficultiesScreen,
          title: "Sur quoi avez-vous ressenti une difficulté ou une gêne ces deux dernières semaines?"
        })}
      />
      <Stack.Screen
        name="PersonalizationObjective"
        options={SHARED_HEADER || PROGRESS_BAR ? headerOptions : undefined}
        component={ProgressScreen({
          slideIndex: 2,
          showProgressbar: true,
          Component: ObjectiveScreen,
          title: "Quels sont vos objectifs ?"
        })}
      />
      <Stack.Screen
        options={SHARED_HEADER ? headerOptions : undefined}
        name="OnboardingCheckInStart"
        component={SHARED_HEADER ? ProgressScreen({
          slideIndex: -1,
          showProgressbar: false,
          Component: OnboardingCheckInStartScreen,
          title: "Quels sont vos objectifs ?"
        }) : OnboardingCheckInStartScreen}
      />
      <Stack.Screen
        options={SHARED_HEADER ? headerOptions : undefined}
        name="OnboardingCheckInHowDoYouFeel"
        component={SHARED_HEADER ? ProgressScreen({
          slideIndex: 2,
          Component: OnboardingCheckInHowDoYouFeelScreen,
          title: "Quels sont vos objectifs ?"
        }) : OnboardingCheckInHowDoYouFeelScreen}
      />
      <Stack.Screen
        options={SHARED_HEADER ? headerOptions : undefined}
        name="OnboardingCheckInHowDoYouFeelDetails"
        component={SHARED_HEADER ? ProgressScreen({
          slideIndex: 2,
          Component: OnboardingCheckInLastMoodsScreen,
          title: "Quels sont vos objectifs ?"
        }) : OnboardingCheckInLastMoodsScreen}
      />
      <Stack.Screen
        options={SHARED_HEADER ? headerOptions : undefined}
        name="OnboardingCheckInMoodSummary"
        component={SHARED_HEADER ? ProgressScreen({
          slideIndex: 2,
          Component: OnboardingCheckInMoodSummaryScreen,
          title: "Quels sont vos objectifs ?"
        }) : OnboardingCheckInMoodSummaryScreen}
      />
      <Stack.Screen
        options={SHARED_HEADER ? headerOptions : undefined}
        name="OnboardingCheckInSleep"
        component={OnboardingCheckInSleepScreen}
      />
      <Stack.Screen
        options={SHARED_HEADER ? headerOptions : undefined}
        name="OnboardingCheckInIntroductionCompleted"
        component={IntroChooseIndicatorScreen}
      />
      <Stack.Screen
        options={SHARED_HEADER ? headerOptions : undefined}
        name="OnboardingChooseIndicatorInto"
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
