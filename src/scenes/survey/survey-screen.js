import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import CircledIcon from '../../components/CircledIcon';
import {buildSurveyData, getAvailableData} from './survey-data';
import SurveyExplanation from './survey-explanation';
import {categories} from '../../utils/constants';
import {
  beforeToday,
  formatDay,
  formatRelativeDate,
} from '../../utils/date/helpers';
import {isToday, isYesterday, parseISO, subDays} from 'date-fns';
import BackButton from '../../components/BackButton';
import {firstLetterUppercase} from '../../utils/string-util';

const SurveyScreen = ({navigation, route}) => {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState();
  const [explanation, setExplanation] = useState();
  const [currentSurveyItem, setCurrentSurveyItem] = useState();
  const [questionId, setQuestionId] = useState();
  const [index, setIndex] = useState(route.params?.index);

  const [availableData, setAvailableData] = useState();

  const updateValues = () => {
    if (!availableData || index < 0 || !availableData[index]) return;
    setQuestion(availableData[index]?.question);
    setAnswers(availableData[index]?.answers);
    setExplanation(availableData[index]?.explanation);
    setCurrentSurveyItem(index);
    setQuestionId(availableData[index]?.id);
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
      // if date selection
      if (answer.id === 'DATE') {
        currentSurvey = {
          date: formatDay(beforeToday(answer.dateOffset)),
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

  const isLastQuestion = () => {
    return questions.indexOf(currentSurveyItem) === totalQuestions - 1;
  };

  if (!answers || !question || !availableData) return null;

  if (questionId === 'day') {
    const now = new Date(Date.now());
    return (
      <SafeAreaView style={styles.safe}>
        <BackButton onPress={previousQuestion} />
        <ScrollView style={styles.container}>
          <Text style={styles.question}>{question}</Text>
          {[...Array(7)].map((_, i) => {
            const value = formatDay(subDays(now, i));
            let label = firstLetterUppercase(formatRelativeDate(value));
            return (
              <TouchableOpacity
                key={i}
                onPress={() => nextQuestion({id: 'DATE', dateOffset: i})}>
                <View style={styles.answer}>
                  <CircledIcon color="white" icon="TodaySvg" />
                  <Text style={styles.label}>{label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <Text style={styles.subtitle}>
            Attention ! Je ne peux pas remplir au-delà de 7 jours car les
            informations seront alors moins fidèles.
          </Text>
        </ScrollView>
        {explanation ? <SurveyExplanation explanation={explanation} /> : null}
      </SafeAreaView>
    );
  }

  const renderQuestion = () => {
    let relativeDate = formatRelativeDate(route.params?.currentSurvey?.date);
    if (
      !isYesterday(parseISO(route.params?.currentSurvey?.date)) &&
      !isToday(parseISO(route.params?.currentSurvey?.date))
    )
      relativeDate = `le ${relativeDate}`;
    return question.replace('{{date}}', relativeDate);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={previousQuestion} />
      <ScrollView style={styles.container}>
        <Text style={styles.question}>{renderQuestion()}</Text>
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
  subtitle: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    marginTop: 15,

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
