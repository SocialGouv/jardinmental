import React, {useContext} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import {colors} from '../common/colors';
import CircledIcon from '../common/circled-icon';
import {surveyData} from './survey-data';
import SurveyExplanation from './survey-explanation';
import {categories, surveyDate} from '../common/constants';
import {DiaryDataContext} from '../context';
import {beforeToday, formatDay} from '../services/date/helpers';
import {isYesterday, parseISO} from 'date-fns';

const SurveyScreen = ({
  question,
  yesterdayQuestion,
  answers,
  explanation,
  currentSurveyItem,
  navigation,
  route,
  questionId,
}) => {
  const totalQuestions = surveyData.length;
  const setDiaryData = useContext(DiaryDataContext)[1];

  const nextQuestion = (answer) => {
    let currentSurvey = {};
    if (currentSurveyItem !== 0) {
      currentSurvey = {...route.params.currentSurvey};
    }
    if (answer.id === surveyDate.TODAY.id) {
      currentSurvey = {
        date: formatDay(new Date()),
        answers: {},
      };
    } else if (answer.id === surveyDate.YESTERDAY.id) {
      currentSurvey = {
        date: formatDay(beforeToday(1)),
        answers: {},
      };
    } else {
      currentSurvey.answers[categories[questionId]] = answer;
    }
    if (currentSurveyItem !== totalQuestions - 1) {
      const isNextQuestionSkipped = answer.id === 'NEVER';
      const nextQuestionId =
        currentSurveyItem + (isNextQuestionSkipped ? 2 : 1);
      navigation.navigate(`question-${nextQuestionId}`, {currentSurvey});
    } else {
      setDiaryData(currentSurvey);
      navigation.navigate('tabs');
    }
  };

  const previousQuestion = () => {
    if (currentSurveyItem !== 0) {
      navigation.navigate(`question-${currentSurveyItem - 1}`);
    } else {
      navigation.navigate('tabs');
    }
  };

  const isSurveyDateYesterday = isYesterday(
    parseISO(route.params?.currentSurvey?.date),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.question}>
          {isSurveyDateYesterday ? yesterdayQuestion : question}
        </Text>
        {answers.map((answer, index) => (
          <TouchableOpacity key={index} onPress={() => nextQuestion(answer)}>
            <View style={styles.answer}>
              <CircledIcon color={answer.color} icon={answer.icon} />
              <Text style={styles.label}>{answer.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={nextQuestion}>
          <Text style={styles.backButton} onPress={previousQuestion}>
            Retour
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <SurveyExplanation explanation={explanation} category={'Explications'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  question: {
    color: colors.BLUE,
    fontSize: 22,
    marginBottom: 26,
    fontWeight: '700',
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
  },
  label: {
    fontWeight: '600',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
});

export default SurveyScreen;
