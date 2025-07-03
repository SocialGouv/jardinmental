import 'expo-dev-client';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
dayjs.locale('fr');

import Router from './src/navigation/router';
import { DiaryDataProvider } from './src/context/diaryData';
import { DiaryNotesProvider } from './src/context/diaryNotes';
import { BottomSheetProvider } from '@/context/BottomSheetContext';

import { UserProfileProvider } from './src/context/userProfile';
import NPS from './src/services/NPS/NPS';
// import { Sentry } from "react-native-sentry";
import { NeedUpdateContextProvider } from './src/context/needUpdate';
import { InfoModalProvider } from './src/components/InfoModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProgressHeaderProvider } from './src/scenes/onboarding/ProgressHeader';
import { LatestChangesModalProvider } from './src/scenes/news/latestChangesModal';

// if (!__DEV__) {
//   Sentry.config("https://9f0bd8f8af8444eea9f470d00a1bb411@sentry.fabrique.social.gouv.fr/54").install();
// }

const App = () => (
  <SafeAreaProvider>
    <UserProfileProvider>
      <NeedUpdateContextProvider>
        <DiaryNotesProvider>
          <DiaryDataProvider>
            <BottomSheetProvider>
              <OnboardingProgressHeaderProvider>
                <LatestChangesModalProvider>
                  <InfoModalProvider>
                    <Router />
                    <NPS />
                  </InfoModalProvider>
                </LatestChangesModalProvider>
              </OnboardingProgressHeaderProvider>
            </BottomSheetProvider>
          </DiaryDataProvider>
        </DiaryNotesProvider>
      </NeedUpdateContextProvider>
    </UserProfileProvider>
  </SafeAreaProvider>
);

export default App;
