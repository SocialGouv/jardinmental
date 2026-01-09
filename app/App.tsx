import "expo-dev-client";
import "react-native-gesture-handler";
import "react-native-get-random-values";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { addPushTokenListener } from "expo-notifications";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
dayjs.locale("fr");

import Router, { navigationRef } from "./src/navigation/router";
import { DiaryDataProvider } from "./src/context/diaryData";
import { DiaryNotesProvider } from "./src/context/diaryNotes";
import { BottomSheetProvider } from "@/context/BottomSheetContext";

import { UserProfileProvider } from "./src/context/userProfile";
import NPS from "./src/services/NPS/NPS";
import { NeedUpdateContextProvider } from "./src/context/needUpdate";
import { InfoModalProvider } from "./src/components/InfoModal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OnboardingProgressHeaderProvider } from "./src/scenes/onboarding-v2/ProgressHeader";
import { LatestChangesModalProvider } from "./src/scenes/news/latestChangesModal";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as Sentry from "@sentry/react-native";
import { IndicatorEditProvider } from "./src/context/IndicatorEditContext";

// Initialize Sentry
if (!__DEV__ && process.env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    debug: false,
    environment: process.env.APP_ENV || "production",
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
    beforeSend(event) {
      // Filter out events in development
      if (__DEV__) {
        return null;
      }
      return event;
    },
  });
}

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const tokenListener = addPushTokenListener((token) => {
      console.log(token);
    });

    return () => {
      if (tokenListener) {
        tokenListener.remove();
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "Karla-Regular": require("./assets/fonts/Karla-Regular.ttf"),
        "Karla-Italic": require("./assets/fonts/Karla-Italic.ttf"),
        "Karla-Medium": require("./assets/fonts/Karla-Medium.ttf"),
        "Karla-MediumItalic": require("./assets/fonts/Karla-MediumItalic.ttf"),
        "Karla-SemiBold": require("./assets/fonts/Karla-SemiBold.ttf"),
        "Karla-SemiBoldItalic": require("./assets/fonts/Karla-SemiBoldItalic.ttf"),
        "Karla-Bold": require("./assets/fonts/Karla-Bold.ttf"),
        "Karla-BoldItalic": require("./assets/fonts/Karla-BoldItalic.ttf"),
        "Karla-Light": require("./assets/fonts/Karla-Light.ttf"),
        "Karla-LightItalic": require("./assets/fonts/Karla-LightItalic.ttf"),
        "Karla-ExtraLight": require("./assets/fonts/Karla-ExtraLight.ttf"),
        "Karla-ExtraLightItalic": require("./assets/fonts/Karla-ExtraLightItalic.ttf"),
        "Karla-ExtraBold": require("./assets/fonts/Karla-ExtraBold.ttf"),
        "Karla-ExtraBoldItalic": require("./assets/fonts/Karla-ExtraBoldItalic.ttf"),
        // Source Sans 3 variable fonts
        // 'SourceSans3': require('./assets/fonts/SourceSans3-VariableFont_wght.ttf'),
        SourceSans3: require("./assets/fonts/SourceSans3-Regular.ttf"),
        "SourceSans3-Regular": require("./assets/fonts/SourceSans3-Regular.ttf"),
        "SourceSans3-Italic": require("./assets/fonts/SourceSans3-Italic.ttf"),
        "SourceSans3-Medium": require("./assets/fonts/SourceSans3-Medium.ttf"),
        "SourceSans3-MediumItalic": require("./assets/fonts/SourceSans3-MediumItalic.ttf"),
        "SourceSans3-SemiBold": require("./assets/fonts/SourceSans3-SemiBold.ttf"),
        "SourceSans3-SemiBoldItalic": require("./assets/fonts/SourceSans3-SemiBoldItalic.ttf"),
        "SourceSans3-Bold": require("./assets/fonts/SourceSans3-Bold.ttf"),
        "SourceSans3-BoldItalic": require("./assets/fonts/SourceSans3-BoldItalic.ttf"),
        "SourceSans3-Light": require("./assets/fonts/SourceSans3-Light.ttf"),
        "SourceSans3-LightItalic": require("./assets/fonts/SourceSans3-LightItalic.ttf"),
        "SourceSans3-ExtraLight": require("./assets/fonts/SourceSans3-ExtraLight.ttf"),
        "SourceSans3-ExtraLightItalic": require("./assets/fonts/SourceSans3-ExtraLightItalic.ttf"),
        "SourceSans3-ExtraBold": require("./assets/fonts/SourceSans3-ExtraBold.ttf"),
        "SourceSans3-ExtraBoldItalic": require("./assets/fonts/SourceSans3-ExtraBoldItalic.ttf"),
      });

      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    })();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <UserProfileProvider>
          <NeedUpdateContextProvider>
            <DiaryNotesProvider>
              <DiaryDataProvider>
                <BottomSheetProvider>
                  <OnboardingProgressHeaderProvider>
                    <LatestChangesModalProvider>
                      <InfoModalProvider>
                        <IndicatorEditProvider>
                          <Router />
                          <NPS navigationRef={navigationRef} />
                        </IndicatorEditProvider>
                      </InfoModalProvider>
                    </LatestChangesModalProvider>
                  </OnboardingProgressHeaderProvider>
                </BottomSheetProvider>
              </DiaryDataProvider>
            </DiaryNotesProvider>
          </NeedUpdateContextProvider>
        </UserProfileProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

// Wrap the App component with Sentry's error boundary
export default Sentry.wrap(App);
