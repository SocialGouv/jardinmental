import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { STORAGE_KEY_DIARY_NOTES } from "../utils/constants";

const wipeData = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY_DIARY_NOTES);
};

const DiaryNotesContext = React.createContext([{}, () => {}]);

const DiaryNotesProvider = ({ children }) => {
  const [diaryNotes, setDiaryNotes] = useState({});

  const setDiaryNotesRequest = ({ date: isoDate, value: data }) => {
    const previousValues = diaryNotes[isoDate]?.values || [];
    const newDiaryNotes = {
      ...diaryNotes,
      [isoDate]: { values: [...previousValues, data] },
    };
    setDiaryNotes(newDiaryNotes);
    AsyncStorage.setItem(STORAGE_KEY_DIARY_NOTES, JSON.stringify(newDiaryNotes));
  };

  const updateDiaryNote = ({ date, id, value }) => {
    const values = diaryNotes[date]?.values?.reduce((previous, current) => {
      if (current?.id === id) {
        if (!value) return previous;
        else return [...previous, value];
      } else return [...previous, current];
    }, []);
    const newDiaryNotes = {
      ...diaryNotes,
      [date]: { values },
    };
    setDiaryNotes(newDiaryNotes);
    AsyncStorage.setItem(STORAGE_KEY_DIARY_NOTES, JSON.stringify(newDiaryNotes));
  };

  useEffect(() => {
    const getDiaryNotesFromStorage = async () => {
      // await wipeData();
      // await AsyncStorage.clear();

      // start date is needed to populate empty dates
      let data = (await AsyncStorage.getItem(STORAGE_KEY_DIARY_NOTES)) || "{}";

      data = JSON.parse(data);
      setDiaryNotes(data);
    };

    getDiaryNotesFromStorage();
  }, [setDiaryNotes]);

  return <DiaryNotesContext.Provider value={[diaryNotes, setDiaryNotesRequest, updateDiaryNote]}>{children}</DiaryNotesContext.Provider>;
};

export { DiaryNotesContext, DiaryNotesProvider };
