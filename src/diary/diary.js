import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Text from '../components/MyText';
import DiaryItem from './diary-item';
import ReminderItem from './reminder-item';
import ContributeItem from './contribute-item';
import ExportItem from './export-item';
import Header from '../common/header';
import {colors} from '../common/colors';
import {format, parseISO, isToday, isYesterday} from 'date-fns';
import {fr} from 'date-fns/locale';
import {firstLetterUppercase} from '../utils/string-util';
import {useContext} from 'react';
import {DiaryDataContext} from '../context';
import Settings from '../settings/settings-modal';
import localStorage from '../utils/localStorage';
import {buildSurveyData} from '../survey/survey-data';
const ReminderStorageKey = '@Reminder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NPS from '../services/NPS/NPS';

const Diary = ({navigation}) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
  const [reminderItemVisible, setReminderItemVisible] = useState(true);
  const [NPSvisible, setNPSvisible] = useState(false);

  const startAtFirstQuestion = async (date) => {
    const symptoms = await localStorage.getSymptoms();
    if (!symptoms) {
      navigation.navigate('symptoms', {
        redirect: true,
        showExplanation: true,
        date,
      });
    } else {
      const questions = await buildSurveyData();
      navigation.navigate(`question`, {
        currentSurvey: {
          date,
          answers: {},
        },
        index: questions[0],
      });
    }
  };
  const formatDate = (date) => {
    const isoDate = parseISO(date);
    if (isToday(isoDate)) {
      return "Aujourd'hui";
    } else if (isYesterday(isoDate)) {
      return 'Hier';
    } else {
      const formattedDate = format(isoDate, 'EEEE d MMMM', {locale: fr});
      return firstLetterUppercase(formattedDate);
    }
  };

  const onPressReminder = () => navigation.navigate('reminder');
  const onPressExport = () => navigation.navigate('export');
  const onPressContribute = () => setNPSvisible(true);
  const closeNPS = () => setNPSvisible(false);

  useEffect(() => {
    (async () => {
      const reminder = await AsyncStorage.getItem(ReminderStorageKey);
      setReminderItemVisible(!reminder);
    })();
  }, []);

  useEffect(() => {
    const handleNavigation = async () => {
      const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
      if (isFirstAppLaunch !== 'false') {
        navigation.navigate('onboarding');
      }
    };
    handleNavigation();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={closeNPS} />
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Header>Mon journal</Header>
          <TouchableOpacity onPress={() => setModalSettingsVisible(true)}>
            <Text style={styles.settings}>Réglages</Text>
          </TouchableOpacity>
        </View>
        {reminderItemVisible ? (
          <ReminderItem onPress={onPressReminder} />
        ) : null}
        <ExportItem onPress={onPressExport} />
        {Object.keys(diaryData)
          .sort((a, b) => {
            a = a.split('/').reverse().join('');
            b = b.split('/').reverse().join('');
            return b.localeCompare(a);
          })
          .map((date) => (
            <View key={date}>
              <Text style={styles.title}>{formatDate(date)}</Text>
              <DiaryItem
                date={date}
                patientState={diaryData[date]}
                startAtFirstQuestion={startAtFirstQuestion}
              />
            </View>
          ))}
        <ContributeItem onPress={onPressContribute} />
      </ScrollView>
      <Settings
        visible={modalSettingsVisible}
        navigation={navigation}
        onClick={() => setModalSettingsVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 20,
    marginBottom: 70,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    display: 'flex',
  },
  settings: {
    fontSize: 16,
    color: colors.BLUE,
    fontWeight: '700',
    paddingTop: 5,
  },
  title: {
    fontSize: 19,
    paddingBottom: 10,
    color: colors.BLUE,
    fontWeight: '700',
  },
});

export default Diary;
