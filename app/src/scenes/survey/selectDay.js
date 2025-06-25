import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../../components/MyText';
import { colors } from '../../utils/colors';
import CircledIcon from '../../components/CircledIcon';
import { beforeToday, formatDay, formatRelativeDate } from '../../utils/date/helpers';
import { subDays } from 'date-fns';
import BackButton from '../../components/BackButton';
import { firstLetterUppercase } from '../../utils/string-util';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';
import { DiaryDataContext } from '../../context/diaryData';
import Done from '../../../assets/svg/Done';
import ScreenTitle from '@/components/survey/ScreenTitle';

const SurveyScreen = ({ navigation }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const startSurvey = offset => {
    const date = formatDay(beforeToday(offset));

    const blackListKeys = ['becks', 'NOTES'];
    const filtered = Object.keys(diaryData[date] || [])
      .filter(key => !blackListKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = diaryData[date][key];
        return obj;
      }, {});

    const dayIsDone = Object.keys(filtered).length !== 0;

    const answers = diaryData[date] || {};
    const currentSurvey = { date, answers };
    return navigation.navigate('day-survey', {
      currentSurvey,
      editingSurvey: dayIsDone,
    });
  };

  const now = new Date(Date.now());

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView style={styles.container}>
        <ScreenTitle>Commençons ! Pour quel jour souhaites-tu remplir ton questionnaire ?</ScreenTitle>
        {[...Array(7)].map((_, i) => {
          const value = formatDay(subDays(now, i));
          let label = firstLetterUppercase(formatRelativeDate(value));
          const blackListKeys = ['becks', 'NOTES'];
          const filtered = Object.keys(diaryData[value] || [])
            .filter(key => !blackListKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = diaryData[value][key];
              return obj;
            }, {});

          const dayIsDone = Object.keys(filtered).length !== 0;

          return (
            <TouchableOpacity key={i} onPress={() => startSurvey(i)}>
              <View style={[styles.answer, dayIsDone ? styles.answerDone : styles.answerNotDone]}>
                <View style={styles.answerLabel}>
                  <CircledIcon color="white" icon={i === 0 ? 'TodaySvg' : 'YesterdaySvg'} />
                  <Text style={styles.label}>{label}</Text>
                </View>
                {dayIsDone ? <Done color="#059669" backgroundColor="#D1FAE5" /> : <ArrowUpSvg style={styles.arrowRight} color={colors.BLUE} />}
              </View>
            </TouchableOpacity>
          );
        })}
        <Text style={styles.subtitleTop}>Remarque</Text>
        <Text style={styles.subtitle}>Je ne peux pas remplir au-delà de 7 jours car les informations seront alors moins fidèles</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  arrowRight: {
    transform: [{ rotate: '90deg' }],
    marginRight: 10,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  subtitleTop: {
    flex: 1,
    color: colors.LIGHT_BLUE,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    marginVertical: 15,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  answer: {
    backgroundColor: '#F4FCFD',
    borderColor: '#D4F0F2',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerDone: {
    backgroundColor: '#C9EFDC',
    borderColor: '#78b094',
  },
  answerNotDone: {
    backgroundColor: '#F4FCFD',
    borderColor: '#D4F0F2',
  },
  answerLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '600',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  textInput: {
    fontSize: 20,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});

export default SurveyScreen;
