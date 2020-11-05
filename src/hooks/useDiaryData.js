import {useEffect, useState} from 'react';
import {getItemFromStorage, setItemFromStorage} from '../storage/storage';
import {STORAGE_KEY_SURVEY_RESULTS} from '../constants';
import {diaryData as fakeDiaryData} from '../diary/diary-data';

export const useDiaryData = () => {
  const [diaryData, setDiaryData] = useState([]);

  useEffect(() => {
    const getDiaryDataFromStorage = async () => {
      const diaryDataFromStorage = await getItemFromStorage(
        STORAGE_KEY_SURVEY_RESULTS,
      );
      await setItemFromStorage(STORAGE_KEY_SURVEY_RESULTS, fakeDiaryData);
      setDiaryData(diaryDataFromStorage);
    };
    getDiaryDataFromStorage();
  }, [setDiaryData]);

  return diaryData;
};
