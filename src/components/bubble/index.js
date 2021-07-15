import React, {useState, useEffect} from 'react';

import ReminderItem from './reminder-item';
import ExportItem from './export-item';
import NoDataTodayDiaryItem from './no-data-today-diary-item';
import NoDataYesterdayDiaryItem from './no-data-yesterday-diary-item';
const ReminderStorageKey = '@Reminder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {startAtFirstQuestion} from '../../scenes/survey/survey-data';

export default ({diaryData, navigation}) => {
  const [reminderItemVisible, setReminderItemVisible] = useState(true);

  useEffect(() => {
    (async () => {
      const reminder = await AsyncStorage.getItem(ReminderStorageKey);
      setReminderItemVisible(!reminder);
    })();
  }, []);

  const onPressReminder = () => navigation.navigate('reminder');
  const onPressExport = () => navigation.navigate('export');
  const dates = Object.keys(diaryData).sort((a, b) => {
    a = a.split('/').reverse().join('');
    b = b.split('/').reverse().join('');
    return b.localeCompare(a);
  });

  const today = dates[0];
  const yesterday = dates[1];

  if (!diaryData[today])
    return (
      <NoDataTodayDiaryItem
        startAtFirstQuestion={startAtFirstQuestion}
        navigation={navigation}
      />
    );
  if (!diaryData[yesterday])
    return (
      <NoDataYesterdayDiaryItem
        startAtFirstQuestion={startAtFirstQuestion}
        navigation={navigation}
      />
    );
  if (reminderItemVisible) return <ReminderItem onPress={onPressReminder} />;
  return <ExportItem onPress={onPressExport} />;
};
