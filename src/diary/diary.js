import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import DiaryItem from './diary-item';
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

const Diary = ({navigation}) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);

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
      navigation.navigate(`question-${questions[1]}`, {
        currentSurvey: {
          date,
          answers: {},
        },
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Header>Mon journal</Header>
          <TouchableOpacity onPress={() => setModalSettingsVisible(true)}>
            <Text style={styles.settings}>Réglages</Text>
          </TouchableOpacity>
        </View>
        {Object.keys(diaryData).map((date) => (
          <View key={date}>
            <Text style={styles.title}>{formatDate(date)}</Text>
            <DiaryItem
              date={date}
              patientState={diaryData[date]}
              startAtFirstQuestion={startAtFirstQuestion}
            />
          </View>
        ))}
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
