import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import * as Sentry from "@sentry/react-native";
import {
  STORAGE_KEY_SURVEY_RESULTS,
  STORAGE_KEY_START_DATE,
  STORAGE_KEY_SYMPTOMS,
  STORAGE_KEY_INDICATEURS,
  STORAGE_KEY_IS_FIRST_LAUNCH,
  STORAGE_KEY_SUPPORTED,
  STORAGE_KEY_CUSTOM_SYMPTOMS,
  STORAGE_KEY_CUSTOM_DRUGS,
  STORAGE_KEY_MEDICAL_TREATMENT,
  STORAGE_KEY_NOTES_VERSION,
  STORAGE_KEY_VISIT_PRO_NPS,
  STORAGE_KEY_IS_BECK_ACTIVATED,
  STORAGE_KEY_BECK_WHERE_LIST,
  STORAGE_KEY_BECK_WHO_LIST,
  STORAGE_KEY_BECK_SENSATION_LIST,
  STORAGE_KEY_BECK_EMOTION_LIST,
  STORAGE_KEY_ONBOARDING_STEP,
  STORAGE_KEY_ONBOARDING_DONE,
  STORAGE_KEY_REMOVING_TOXIC_QUESTION_FROM_SURVEY_MIGRATION_DONE,
} from "../utils/constants";
import { beforeToday, formatDay, getArrayOfDates } from "../utils/date/helpers";
import { DiaryData, DiaryDataNewEntryInput } from "../entities/DiaryData";
import { parse } from "date-fns";
import { generateIndicatorFromPredefinedIndicator } from "@/entities/Indicator";
import { GENERIC_INDICATOR_SUBSTANCE, STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE } from "@/utils/liste_indicateurs.1";
import localStorage from "@/utils/localStorage/index";

export const wipeData = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY_START_DATE);
  await AsyncStorage.removeItem(STORAGE_KEY_SURVEY_RESULTS);
  await AsyncStorage.removeItem(STORAGE_KEY_SYMPTOMS);
  await AsyncStorage.removeItem(STORAGE_KEY_INDICATEURS);
  await AsyncStorage.removeItem(STORAGE_KEY_IS_FIRST_LAUNCH);
  await AsyncStorage.removeItem(STORAGE_KEY_SUPPORTED);
  await AsyncStorage.removeItem(STORAGE_KEY_MEDICAL_TREATMENT);
  await AsyncStorage.removeItem(STORAGE_KEY_NOTES_VERSION);
  await AsyncStorage.removeItem(STORAGE_KEY_VISIT_PRO_NPS);
  await AsyncStorage.removeItem(STORAGE_KEY_CUSTOM_DRUGS);
  await AsyncStorage.removeItem(STORAGE_KEY_IS_BECK_ACTIVATED);
  await AsyncStorage.removeItem(STORAGE_KEY_BECK_WHERE_LIST);
  await AsyncStorage.removeItem(STORAGE_KEY_BECK_WHO_LIST);
  await AsyncStorage.removeItem(STORAGE_KEY_BECK_SENSATION_LIST);
  await AsyncStorage.removeItem(STORAGE_KEY_BECK_EMOTION_LIST);
  await AsyncStorage.removeItem(STORAGE_KEY_ONBOARDING_STEP);
  await AsyncStorage.removeItem(STORAGE_KEY_ONBOARDING_DONE);
  await AsyncStorage.removeItem("@Reminder");
};

const fillUpEmptyDates = (startDate, data) => {
  const sortedDates = getArrayOfDates({ startDate, reverse: true });
  const diary = {};
  for (let date of sortedDates) {
    diary[date] = data[date] || null;
  }
  return diary;
};

type ImportMode = "replace" | "merge";

type DiaryContextValue = [
  diaryData: DiaryData,
  addEntry: (params: { date: string; answers: DiaryData }) => void,
  deleteEntry: (date: string) => void,
  importData: (importedData: DiaryData, mode: ImportMode) => Promise<void>
];

const DiaryDataContext = React.createContext<DiaryContextValue>([
  {} as DiaryData,
  function addEntry() {},
  function deleteEntry(date: string) {},
  async function importData(_A, _B) {},
]);

const DiaryDataProvider = ({ children }) => {
  const [diaryData, setDiaryData] = useState<DiaryData>({});

  const addNewEntryToDiaryData = ({ date: isoDate, answers: data }: DiaryDataNewEntryInput) => {
    const resData = data?.becks
      ? // if we add becks, we keep all the previous diaryData
        { ...diaryData[isoDate], ...data }
      : // if not, it is a new version of a diary day, we overwrite it except becks data
        { becks: diaryData[isoDate]?.becks, ...data };
    const newDiaryData = {
      ...diaryData,
      [isoDate]: resData,
    };
    setDiaryData(newDiaryData);
    AsyncStorage.setItem(STORAGE_KEY_SURVEY_RESULTS, JSON.stringify(newDiaryData));
  };

  const importDiaryData = async (importedData: DiaryData, mode: ImportMode) => {
    let finalData: DiaryData;

    if (mode === "replace") {
      // Remplacer toutes les données
      finalData = importedData;
    } else {
      // Fusionner avec les données existantes
      finalData = { ...diaryData };

      // Pour chaque date dans les données importées
      Object.keys(importedData).forEach((date) => {
        if (importedData[date]) {
          if (finalData[date]) {
            // Si la date existe déjà, fusionner les données
            finalData[date] = {
              ...finalData[date],
              ...importedData[date],
              // Gérer spécialement les becks pour éviter d'écraser
              becks: {
                ...finalData[date]?.becks,
                ...importedData[date]?.becks,
              },
            };
          } else {
            // Si la date n'existe pas, l'ajouter
            finalData[date] = importedData[date];
          }
        }
      });
    }

    // Sauvegarder dans AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY_SURVEY_RESULTS, JSON.stringify(finalData));

    // Recharger les données depuis le storage pour appliquer la logique de fillUpEmptyDates
    await getDiaryDataFromStorage();
  };

  const internal__deleteDiaryData = (isoDate: string) => {
    // function to be used in dev mode for test purpose
    const newDiaryData = { ...diaryData };
    newDiaryData[isoDate] = null;
    setDiaryData(newDiaryData);
    AsyncStorage.setItem(STORAGE_KEY_SURVEY_RESULTS, JSON.stringify(newDiaryData));
  };

  const getDiaryDataFromStorage = async () => {
    // await wipeData();
    // await setupFakeData();
    // await AsyncStorage.clear();

    // start date is needed to populate empty dates
    let startDate = await AsyncStorage.getItem(STORAGE_KEY_START_DATE);
    let data = (await AsyncStorage.getItem(STORAGE_KEY_SURVEY_RESULTS)) || "{}";
    // if no start date, it's the first time the user opens the app
    // so we initialize it
    if (!startDate) {
      const tempStartDate = formatDay(new Date());
      await AsyncStorage.setItem(STORAGE_KEY_START_DATE, tempStartDate);
      let tempStartDateMinus7 = beforeToday(7, tempStartDate);
      const tempDiary = fillUpEmptyDates(tempStartDateMinus7, JSON.parse(data));
      return setDiaryData(tempDiary);
    }
    // we set data first for a better UX
    let parsedData: DiaryData = JSON.parse(data) as DiaryData;
    setDiaryData(parsedData);
    let startDateMinus7 = beforeToday(7, new Date(startDate));
    const diary = fillUpEmptyDates(startDateMinus7, parsedData);
    setDiaryData(diary);
    if (parsedData) {
      const migrationAlreadyDone = await AsyncStorage.getItem(STORAGE_KEY_REMOVING_TOXIC_QUESTION_FROM_SURVEY_MIGRATION_DONE);
      try {
        if (Object.values(parsedData).find((dayEntry) => dayEntry && Object.keys(dayEntry).includes("TOXIC")) && !migrationAlreadyDone) {
          localStorage.replaceOrAddIndicateur({
            ...generateIndicatorFromPredefinedIndicator(GENERIC_INDICATOR_SUBSTANCE),
            // we keep the same uuid "A" for continutiry in history key=="TOXIC" and "A" uuid are considered the same,
            uuid: STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE,
          });
          await AsyncStorage.setItem(STORAGE_KEY_REMOVING_TOXIC_QUESTION_FROM_SURVEY_MIGRATION_DONE, true.toString());
        }
      } catch (e) {
        console.error("Error during TOXIC question migration:", e);
        Sentry.captureException(e);
      }
    }
  };

  useEffect(() => {
    getDiaryDataFromStorage();
  }, [setDiaryData]);

  return (
    <DiaryDataContext.Provider value={[diaryData, addNewEntryToDiaryData, internal__deleteDiaryData, importDiaryData]}>
      {children}
    </DiaryDataContext.Provider>
  );
};

export { DiaryDataContext, DiaryDataProvider };
