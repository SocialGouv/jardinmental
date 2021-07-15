import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import ReminderItem from './reminder-item';
import ExportItem from './export-item';
import NoDataTodayDiaryItem from './no-data-today-diary-item';
import NoDataYesterdayDiaryItem from './no-data-yesterday-diary-item';
import BeckItem from './beck-item';
const ReminderStorageKey = '@Reminder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {startAtFirstQuestion} from '../../scenes/survey/survey-data';
import localStorage from '../../utils/localStorage';

export default ({diaryData, navigation}) => {
  const [reminderItemVisible, setReminderItemVisible] = useState();
  const [beckItemVisible, setBeckItemVisible] = useState();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const reminder = await AsyncStorage.getItem(ReminderStorageKey);
        setReminderItemVisible(!reminder);
        const isBeckActivated = await localStorage.getIsBeckActivated();
        setBeckItemVisible(!isBeckActivated);
      })();
    }, []),
  );

  const onPressBeck = () => navigation.navigate('activate-beck');
  const onPressReminder = () => navigation.navigate('reminder');
  const onPressExport = () => navigation.navigate('export');
  const dates = Object.keys(diaryData).sort((a, b) => {
    a = a.split('/').reverse().join('');
    b = b.split('/').reverse().join('');
    return b.localeCompare(a);
  });

  const today = dates[0];
  const yesterday = dates[1];
  if (beckItemVisible) return <BeckItem onPress={onPressBeck} />;
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
