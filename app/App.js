import 'expo-dev-client';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Constants from 'expo-constants';

dayjs.extend(isSameOrAfter);
dayjs.locale('fr');

import * as Sentry from '@sentry/react-native';
import Router from './src/navigation/router';
import { DiaryDataProvider } from './src/context/diaryData';
import { DiaryNotesProvider } from './src/context/diaryNotes';
import NPS from './src/services/NPS/NPS';
import { NeedUpdateContextProvider } from './src/context/needUpdate';
import { InfoModalProvider } from './src/components/InfoModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProgressHeaderProvider } from './src/scenes/onboarding/ProgressHeader';
import { LatestChangesModalProvider } from './src/scenes/news/latestChangesModal';
import { initSdk, trackScreen, trackEvent, setProperties, setIdentity } from "@screeb/react-native";

// Initialize Sentry
if (!__DEV__ && process.env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    debug: false,
    environment: process.env.APP_ENV || 'production',
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
    enableOutOfMemoryTracking: false,
    beforeSend(event) {
      // Filter out events in development
      if (__DEV__) {
        return null;
      }
      return event;
    },
  });
}

const App = () => {

  React.useEffect(() => {
    initSdk(
      process.env.EXPO_PUBLIC_SCREEB_IOS_CHANNEL,
      process.env.EXPO_PUBLIC_SCREEB_ANDROID_CHANNEL,
    );
  }, []);

  return <SafeAreaProvider>
    <NeedUpdateContextProvider>
      <DiaryNotesProvider>
        <DiaryDataProvider>
          <OnboardingProgressHeaderProvider>
            <LatestChangesModalProvider>
              <InfoModalProvider>
                <Router />
                <NPS />
              </InfoModalProvider>
            </LatestChangesModalProvider>
          </OnboardingProgressHeaderProvider>
        </DiaryDataProvider>
      </DiaryNotesProvider>
    </NeedUpdateContextProvider>
  </SafeAreaProvider>
};

// Wrap the App component with Sentry's error boundary
export default Sentry.wrap(App);
