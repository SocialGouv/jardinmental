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
import {buildSurveyData} from './survey-data';
import {icons, colors as colorsFromConstant} from '../../utils/constants';
import {formatRelativeDate} from '../../utils/date/helpers';
import {isToday, isYesterday, parseISO} from 'date-fns';
import BackButton from '../../components/BackButton';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';
import Button from '../../components/Button';
import {getScoreWithState} from '../../utils';
import Icon from '../../components/Icon';

const DaySurvey = ({navigation, route}) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    (async () => {
      const q = await buildSurveyData();
      if (q) {
        setQuestions(q);
      }
    })();
  }, []);

  useEffect(() => {
    //init the survey if there is already answers
    Object.keys(route?.params?.currentSurvey?.answers || {})?.forEach((key) => {
      const score = getScoreWithState({
        patientState: route?.params?.currentSurvey?.answers,
        category: key,
      });
      const cleanedQuestionId = key.split('_')[0];
      if (questions.find((q) => q.id === cleanedQuestionId)) {
        toggleAnswer({key: cleanedQuestionId, value: score});
      }
    });
  }, [route?.params?.currentSurvey?.answers, questions]);

  const toggleAnswer = async ({key, value}) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const submitDay = () => {
    const prevCurrentSurvey = route.params?.currentSurvey;
    const currentSurvey = {
      date: prevCurrentSurvey?.date,
      answers,
    };

    navigation.navigate('notes', {
      currentSurvey,
    });
  };

  const allQuestionHasAnAnswer = () =>
    questions.every((curr) => answers[curr.id]);

  const renderQuestion = () => {
    if (isYesterday(parseISO(route.params?.currentSurvey?.date)))
      return "Comment s'est passée la journée d'hier ?";
    if (isToday(parseISO(route.params?.currentSurvey?.date)))
      return "Comment s'est passée votre journée ?";
    let relativeDate = formatRelativeDate(route.params?.currentSurvey?.date);
    relativeDate = `le ${relativeDate}`;
    return `Comment s'est passé ${relativeDate} ?`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView style={styles.container}>
        <Text style={styles.question}>{renderQuestion()}</Text>
        {questions.map((q, i) => (
          <Question
            key={i}
            question={q}
            onPress={toggleAnswer}
            selected={answers[q.id]}
            explanation={q.explanation}
            isLast={i === questions.length - 1}
          />
        ))}
        <View style={styles.divider} />
        <Text style={styles.subtitle}>
          Remplir chaque critère pour valider cette journée me permet d'avoir
          une vision complète de ce que je vis.{' '}
        </Text>
        <View style={styles.buttonWrapper}>
          <Button
            onPress={() => {
              console.log('OK');
              submitDay();
            }}
            title="Valider"
            disabled={!allQuestionHasAnAnswer()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const answers = [
  {
    score: 1,
    backgroundColor: colorsFromConstant.veryBad,
    inactiveBackgroundColor: colorsFromConstant.veryBadTrans,
    iconColor: '#7F2121',
    inactiveIconColor: '#666666',
    icon: icons.veryBad,
  },
  {
    score: 2,
    backgroundColor: colorsFromConstant.bad,
    inactiveBackgroundColor: colorsFromConstant.badTrans,
    iconColor: '#7B3900',
    inactiveIconColor: '#666666',
    icon: icons.bad,
  },
  {
    score: 3,
    backgroundColor: colorsFromConstant.middle,
    inactiveBackgroundColor: colorsFromConstant.middleTrans,
    iconColor: '#7B5300',
    inactiveIconColor: '#666666',
    icon: icons.middle,
  },
  {
    score: 4,
    backgroundColor: colorsFromConstant.good,
    inactiveBackgroundColor: colorsFromConstant.goodTrans,
    iconColor: '#696B00',
    inactiveIconColor: '#666666',
    icon: icons.good,
  },
  {
    score: 5,
    backgroundColor: colorsFromConstant.veryGood,
    inactiveBackgroundColor: colorsFromConstant.veryGoodTrans,
    iconColor: '#537900',
    inactiveIconColor: '#666666',
    icon: icons.veryGood,
  },
];

const Question = ({question, explanation, onPress, selected, isLast}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const toggleShowExplanation = async () => {
    setShowExplanation((prev) => !prev);
  };
  return (
    <View style={styles.questionContainer}>
      <TouchableOpacity onPress={toggleShowExplanation}>
        <View style={styles.questionHeaderContainer}>
          <View style={styles.questionHeader}>
            {explanation ? (
              <Icon
                icon="InfoSvg"
                width={25}
                height={25}
                color={colors.LIGHT_BLUE}
                styleContainer={{width: 25, height: 25}}
              />
            ) : (
              <View />
            )}
            <Text style={styles.questionTitle}>{question.label}</Text>
            {/* we put a view here because we'll add a item here later */}
            <View />
          </View>
          {explanation && showExplanation ? (
            <View style={styles.questionInfo}>
              <Text>{explanation}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
      <View style={[styles.answerContainer, !isLast && styles.leftFileAriane]}>
        {answers.map((answer, i) => {
          const active = selected === answer.score;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPress({key: question.id, value: answer.score})}>
              <View
                style={[
                  styles.selectionContainer,
                  active && styles.activeSelectionContainer,
                ]}>
                <CircledIcon
                  color={
                    !active && selected
                      ? answer.inactiveBackgroundColor
                      : answer.backgroundColor
                  }
                  borderColor="#eee"
                  iconColor={
                    !active && selected
                      ? answer.inactiveIconColor
                      : answer.iconColor
                  }
                  icon={answer.icon}
                  iconContainerStyle={{marginRight: 0}}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    padding: 3,
    borderColor: '#DEF4F5',
    borderWidth: 1,
    borderRadius: 10,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  arrowDown: {
    transform: [{rotate: '180deg'}],
  },
  arrowUp: {
    transform: [{rotate: '0deg'}],
  },

  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,183,200, .09)',
    marginVertical: 10,
    width: '65%',
    alignSelf: 'center',
  },

  questionContainer: {
    display: 'flex',
  },
  questionHeaderContainer: {
    backgroundColor: '#F4FCFD',
    borderColor: '#DEF4F5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  questionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionInfo: {
    marginTop: 15,
  },
  questionPoint: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: colors.LIGHT_BLUE,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    marginLeft: 18, // padding of the header question container + half of the dot size => 10 + 8 = 18
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  leftFileAriane: {
    borderLeftColor: '#DEF4F5',
    borderLeftWidth: 2,
  },
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
    justifyContent: 'space-between',
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

export default DaySurvey;
