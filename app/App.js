import "react-native-gesture-handler";
import "react-native-get-random-values";
import React from "react";

import Router from "./src/navigation/router";
import { DiaryDataProvider } from "./src/context/diaryData";
import { DiaryNotesProvider } from "./src/context/diaryNotes";
import NPS from "./src/services/NPS/NPS";
import { Sentry } from "react-native-sentry";
import { NeedUpdateContextProvider } from "./src/context/needUpdate";

if (!__DEV__) {
  Sentry.config("https://9f0bd8f8af8444eea9f470d00a1bb411@sentry.fabrique.social.gouv.fr/54").install();
}

const App = () => (
  <NeedUpdateContextProvider>
    <DiaryNotesProvider>
      <DiaryDataProvider>
        <Router />
        <NPS />
      </DiaryDataProvider>
    </DiaryNotesProvider>
  </NeedUpdateContextProvider>
);

export default App;
