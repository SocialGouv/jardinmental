import {isToday} from 'date-fns';
import {today} from '../services/date/helpers';

export const createTodayDiaryDataIfNotExists = (diaryData) => {
  const isTodayItemInDiaryData = diaryData.find((diaryItem) => {
    isToday(diaryItem.date);
  });
  if (!isTodayItemInDiaryData) {
    diaryData.push({date: today, patientState: {}});
  }
};
