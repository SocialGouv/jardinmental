import React from 'react';
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
import {useDiaryData} from '../hooks/useDiaryData';
import {colors} from '../common/colors';
import {format, parseISO, isToday, isYesterday} from 'date-fns';
import {fr} from 'date-fns/locale';
import {firstLetterUppercase} from '../utils/string-util';

const Diary = ({navigation}) => {
  const diaryData = useDiaryData();
  const startAtFirstQuestion = () => navigation.navigate('question-1');
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
          <TouchableOpacity onPress={() => navigation.navigate('reminder')}>
            <Text style={styles.settings}>Rappel</Text>
          </TouchableOpacity>
        </View>
        {diaryData.map(({date, patientState}) => (
          <View key={date}>
            <Text style={styles.title}>{formatDate(date)}</Text>
            <DiaryItem
              date={date}
              patientState={patientState}
              startAtFirstQuestion={startAtFirstQuestion}
            />
          </View>
        ))}
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
