import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import CircledIcon from '../common/circled-icon';
import {buildSurveyData, getAvailableData} from './survey-data';
import SurveyExplanation from './survey-explanation';
import {categories, surveyDate} from '../common/constants';
import {beforeToday, formatDay} from '../services/date/helpers';
import {isYesterday, parseISO} from 'date-fns';
import BackButton from '../components/BackButton';

const SurveyScreen = ({navigation, route}) => {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState();
  const [yesterdayQuestion, setYesterdayQuestion] = useState();
  const [answers, setAnswers] = useState();
  const [explanation, setExplanation] = useState();
  const [currentSurveyItem, setCurrentSurveyItem] = useState();
  const [questionId, setQuestionId] = useState();
  const [index, setIndex] = useState(route.params?.index);

  const [availableData, setAvailableData] = useState();

  const updateValues = () => {
    if (!availableData || index < 0) return;
    setQuestion(availableData[index].question);
    setYesterdayQuestion(availableData[index].yesterdayQuestion);
    setAnswers(availableData[index].answers);
    setExplanation(availableData[index].explanation);
    setCurrentSurveyItem(index);
    setQuestionId(availableData[index].id);
  };

  useEffect(() => {
    (async () => {
      const q = await buildSurveyData();
      if (q) {
        setQuestions(q);
        setTotalQuestions(q.length);
      }
      const d = await getAvailableData();
      if (d) setAvailableData(d);
    })();
  }, []);

  useEffect(() => {
    updateValues();
  }, [route, availableData]);

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
        currentSurvey.answers[questionId] = answer;
      }
    }

    let redirection = 'notes';
    let nextIndex = -1;
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
        redirection = 'question';
        nextIndex = nextQuestionId;
      }
    }
    setIndex(nextIndex);
    navigation.navigate(redirection, {
      currentSurvey,
      backRedirect: currentSurveyItem,
      index: nextIndex,
    });
  };

  const previousQuestion = () => {
    const survey = route.params?.currentSurvey;

    // getting index of the current question in the 'questions' array
    const index = questions.indexOf(currentSurveyItem);
    if (index <= 0) {
      navigation.navigate('tabs');
      return;
    }

    // getting the router index of the previous question
    let previousQuestionIndex = questions[index - 1];

    const previousQuestionId = availableData[previousQuestionIndex].id;
    if (!survey?.answers[previousQuestionId])
      previousQuestionIndex = questions[index - 2];
    setIndex(previousQuestionIndex);
    navigation.navigate('question', {
      ...route.params,
      index: previousQuestionIndex,
    });
  };

  const isSurveyDateYesterday = isYesterday(
    parseISO(route.params?.currentSurvey?.date),
  );

  const isLastQuestion = () => {
    return questions.indexOf(currentSurveyItem) === totalQuestions - 1;
  };

  if (!answers || !(yesterdayQuestion || question) || !availableData)
    return null;

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={previousQuestion} />
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
      </ScrollView>
      {explanation ? <SurveyExplanation explanation={explanation} /> : null}
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
