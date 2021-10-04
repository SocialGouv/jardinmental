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

  const showBubbleSurvey = (day) => {
    const index = Object.keys(diaryData).sort((a, b) => {
      a = a.split('/').reverse().join('');
      b = b.split('/').reverse().join('');
      return b.localeCompare(a);
    })[day];
    if (!diaryData[index]) return true;
    return (
      Object.keys(diaryData[index]).filter((key) => key !== 'becks').length ===
      0
    );
  };

  const onPressBeck = () => navigation.navigate('activate-beck');
  const onPressReminder = () => navigation.navigate('reminder');
  const onPressExport = () => navigation.navigate('export');

  // if (beckItemVisible) return <BeckItem onPress={onPressBeck} />;

  if (reminderItemVisible) return <ReminderItem onPress={onPressReminder} />;

  // show the bubble if there is no info in the index 0 (today)
  if (showBubbleSurvey(0))
    return (
      <NoDataTodayDiaryItem
        startAtFirstQuestion={startAtFirstQuestion}
        navigation={navigation}
      />
    );

  // show the bubble if there is no info in the index 1 (yesterday)
  if (showBubbleSurvey(1))
    return (
      <NoDataYesterdayDiaryItem
        startAtFirstQuestion={startAtFirstQuestion}
        navigation={navigation}
      />
    );
  return <ExportItem onPress={onPressExport} />;
};
