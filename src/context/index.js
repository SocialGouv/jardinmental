import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  STORAGE_KEY_SURVEY_RESULTS,
  STORAGE_KEY_START_DATE,
  STORAGE_KEY_SYMPTOMS,
  STORAGE_KEY_IS_FIRST_LAUNCH,
  STORAGE_KEY_SUPPORTED,
  STORAGE_KEY_CUSTOM_SYMPTOMS,
  STORAGE_KEY_CUSTOM_DRUGS,
  STORAGE_KEY_MEDICAL_TREATMENT,
  STORAGE_KEY_NOTES_VERSION,
  STORAGE_KEY_VISIT_PRO_NPS,
} from '../common/constants';
import {
  fakeDiaryData,
  startDate as fakeStartDate,
} from '../diary/fake-diary-data';
import {formatDay, getArrayOfDates} from '../services/date/helpers';

const wipeData = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY_START_DATE);
  await AsyncStorage.removeItem(STORAGE_KEY_SURVEY_RESULTS);
  await AsyncStorage.removeItem(STORAGE_KEY_SYMPTOMS);
  await AsyncStorage.removeItem(STORAGE_KEY_IS_FIRST_LAUNCH);
  await AsyncStorage.removeItem(STORAGE_KEY_SUPPORTED);
  await AsyncStorage.removeItem(STORAGE_KEY_CUSTOM_SYMPTOMS);
  await AsyncStorage.removeItem(STORAGE_KEY_MEDICAL_TREATMENT);
  await AsyncStorage.removeItem(STORAGE_KEY_NOTES_VERSION);
  await AsyncStorage.removeItem(STORAGE_KEY_VISIT_PRO_NPS);
  await AsyncStorage.removeItem(STORAGE_KEY_CUSTOM_DRUGS);
  await AsyncStorage.removeItem('@Reminder');
};

const setupFakeData = async () => {
  await AsyncStorage.setItem(STORAGE_KEY_START_DATE, formatDay(fakeStartDate));
  await AsyncStorage.setItem(
    STORAGE_KEY_SURVEY_RESULTS,
    JSON.stringify(fakeDiaryData),
  );
};

const fillUpEmptyDates = (startDate, data) => {
  const sortedDates = getArrayOfDates({startDate, reverse: true});
  const diary = {};
  for (let date of sortedDates) {
    diary[date] = data[date] || null;
  }
  return diary;
};

const DiaryDataContext = React.createContext([{}, () => {}]);

const DiaryDataProvider = ({children}) => {
  const [diaryData, setDiaryData] = useState({});

  const setDiaryDataRequest = ({date: isoDate, answers: data}) => {
    const newDiaryData = {
      ...diaryData,
      [isoDate]: data,
    };
    setDiaryData(newDiaryData);
    AsyncStorage.setItem(
      STORAGE_KEY_SURVEY_RESULTS,
      JSON.stringify(newDiaryData),
    );
  };

  useEffect(() => {
    const getDiaryDataFromStorage = async () => {
      // await wipeData();
      // await setupFakeData();

      // start date is needed to populate empty dates
      const startDate = await AsyncStorage.getItem(STORAGE_KEY_START_DATE);
      let data =
        (await AsyncStorage.getItem(STORAGE_KEY_SURVEY_RESULTS)) || '{}';

      // if no start date, it's the first time the user opens the app
      // so we initialize it
      if (!startDate) {
        const initDiary = {[formatDay(new Date())]: null};
        await AsyncStorage.setItem(
          STORAGE_KEY_START_DATE,
          formatDay(new Date()),
        );
        return setDiaryData(initDiary);
      }

      // we set data first for a better UX
      data = JSON.parse(data);
      setDiaryData(data);

      const diary = fillUpEmptyDates(startDate, data);
      setDiaryData(diary);
    };

    getDiaryDataFromStorage();
  }, [setDiaryData]);

  return (
    <DiaryDataContext.Provider value={[diaryData, setDiaryDataRequest]}>
      {children}
    </DiaryDataContext.Provider>
  );
};

export {DiaryDataContext, DiaryDataProvider};
