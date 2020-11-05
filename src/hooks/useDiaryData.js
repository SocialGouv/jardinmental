import {useEffect, useState} from 'react';
import {getItemFromStorage, setItemFromStorage} from '../storage/storage';
import {STORAGE_KEY_SURVEY_RESULTS} from '../common/constants';
import {fakeDiaryData} from '../diary/fake-diary-data';

export const useDiaryData = () => {
  const [diaryData, setDiaryData] = useState([]);

  useEffect(() => {
    const getDiaryDataFromStorage = async () => {
      const diaryDataFromStorage = await getItemFromStorage(
        STORAGE_KEY_SURVEY_RESULTS,
      );
      //TODO : Remove this line in order to not have fake data
      await setItemFromStorage(STORAGE_KEY_SURVEY_RESULTS, fakeDiaryData);
      setDiaryData(diaryDataFromStorage);
    };
    getDiaryDataFromStorage();
  }, [setDiaryData]);

  return diaryData;
};
