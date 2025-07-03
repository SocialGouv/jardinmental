import 'expo-dev-client';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
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

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
        'Karla-Italic': require('./assets/fonts/Karla-Italic.ttf'),
        'Karla-Medium': require('./assets/fonts/Karla-Medium.ttf'),
        'Karla-MediumItalic': require('./assets/fonts/Karla-MediumItalic.ttf'),
        'Karla-SemiBold': require('./assets/fonts/Karla-SemiBold.ttf'),
        'Karla-SemiBoldItalic': require('./assets/fonts/Karla-SemiBoldItalic.ttf'),
        'Karla-Bold': require('./assets/fonts/Karla-Bold.ttf'),
        'Karla-BoldItalic': require('./assets/fonts/Karla-BoldItalic.ttf'),
        'Karla-Light': require('./assets/fonts/Karla-Light.ttf'),
        'Karla-LightItalic': require('./assets/fonts/Karla-LightItalic.ttf'),
        'Karla-ExtraLight': require('./assets/fonts/Karla-ExtraLight.ttf'),
        'Karla-ExtraLightItalic': require('./assets/fonts/Karla-ExtraLightItalic.ttf'),
        'Karla-ExtraBold': require('./assets/fonts/Karla-ExtraBold.ttf'),
        'Karla-ExtraBoldItalic': require('./assets/fonts/Karla-ExtraBoldItalic.ttf'),
      });

      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    })();
  }, []);

  if (!fontsLoaded) return null;

  return <SafeAreaProvider>
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
};

export default App;
