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
import ContributeItem from './contribute-item';
import Header from '../common/header';
import {colors} from '../common/colors';
import {format, parseISO, isToday, isYesterday} from 'date-fns';
import {fr} from 'date-fns/locale';
import {firstLetterUppercase} from '../utils/string-util';
import {useContext} from 'react';
import {DiaryDataContext} from '../context';
import localStorage from '../utils/localStorage';
import NPS from '../services/NPS/NPS';
import Bubble from './bubble';

const Diary = ({navigation}) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [NPSvisible, setNPSvisible] = useState(false);

  // const startAtFirstQuestion = async (date) => {
  //   const symptoms = await localStorage.getSymptoms();
  //   if (!symptoms) {
  //     navigation.navigate('symptoms', {
  //       redirect: true,
  //       showExplanation: true,
  //       date,
  //     });
  //   } else {
  //     const questions = await buildSurveyData();
  //     navigation.navigate(`question`, {
  //       currentSurvey: {
  //         date,
  //         answers: {},
  //       },
  //       index: questions[0],
  //     });
  //   }
  // };
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

  const onPressContribute = () => setNPSvisible(true);
  const closeNPS = () => setNPSvisible(false);

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Header title="Mon journal" navigation={navigation} />
        <Bubble diaryData={diaryData} navigation={navigation} />
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
                navigation={navigation}
              />
            </View>
          ))}
        <ContributeItem onPress={onPressContribute} />
      </ScrollView>
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
  scrollContainer: {
    paddingBottom: 80,
  },
  title: {
    fontSize: 19,
    paddingBottom: 10,
    color: colors.BLUE,
    fontWeight: '700',
  },
});

export default Diary;
