import React, {useEffect, useState} from 'react';
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
import {buildSurveyData} from './survey-data';
import SurveyExplanation from './survey-explanation';
import {categories, surveyDate} from '../common/constants';
//import {DiaryDataContext} from '../context';
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
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      const q = await buildSurveyData();
      if (q) {
        setQuestions(q);
        setTotalQuestions(q.length);
      }
    })();
  }, []);

  const nextQuestion = (answer) => {
    let currentSurvey = {};
    if (currentSurveyItem !== 0) {
      currentSurvey = {...route.params.currentSurvey};
    }

    if (answer) {
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
    }

    let redirection = 'notes';
    if (!isLastQuestion()) {
      const isNextQuestionSkipped = answer.id === 'NEVER';
      // getting index of the current question in the 'questions' array
      const index = questions.indexOf(currentSurveyItem);
      // getting the next index of the next question
      const nextQuestionIndex = index + (isNextQuestionSkipped ? 2 : 1);
      // if there is a next question, navigate to it
      // else go to 'notes'
      if (nextQuestionIndex <= questions.length - 1) {
        const nextQuestionId = questions[nextQuestionIndex];
        redirection = `question-${nextQuestionId}`;
      }
    }
    navigation.navigate(redirection, {currentSurvey});
  };

  const previousQuestion = () => {
    // getting index of the current question in the 'questions' array
    const index = questions.indexOf(currentSurveyItem);
    if (index > 0) {
      // getting the router index of the previous question
      const previousQuestionId = questions[index - 1];
      navigation.navigate(`question-${previousQuestionId}`);
    } else {
      navigation.navigate('tabs');
    }
  };

  const isSurveyDateYesterday = isYesterday(
    parseISO(route.params?.currentSurvey?.date),
  );

  const isLastQuestion = () => {
    return questions.indexOf(currentSurveyItem) === totalQuestions - 1;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.question}>
          {isSurveyDateYesterday ? yesterdayQuestion : question}
        </Text>
        {answers
          .filter((answer) => answer.id !== categories.NOTES)
          .map((answer, index) => (
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
