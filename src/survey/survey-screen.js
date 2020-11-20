import React, {useContext, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {colors} from '../common/colors';
import CircledIcon from '../common/circled-icon';
import {buildSurveyData} from './survey-data';
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
  const [totalQuestions, setTotalQuestions] = useState();

  useEffect(() => {
    (async () => {
      const data = await buildSurveyData();
      if (data) setTotalQuestions(data.length);
    })();
  }, []);

  const setDiaryData = useContext(DiaryDataContext)[1];
  const [note, setNote] = useState();
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

    if (!isLastQuestion()) {
      const isNextQuestionSkipped = answer.id === 'NEVER';
      const nextQuestionId =
        currentSurveyItem + (isNextQuestionSkipped ? 2 : 1);
      navigation.navigate(`question-${nextQuestionId}`, {currentSurvey});
    } else {
      console.log(currentSurvey);
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

  const isLastQuestion = () => {
    return currentSurveyItem === totalQuestions - 1;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.question}>
          {isSurveyDateYesterday ? yesterdayQuestion : question}
        </Text>
        {answers.length ? (
          <>
            {answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => nextQuestion(answer)}>
                <View style={styles.answer}>
                  <CircledIcon color={answer.color} icon={answer.icon} />
                  <Text style={styles.label}>{answer.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <TextInput
              style={[styles.answer, styles.textInput]}
              placeholder={'Saisir une note'}
              onChangeText={(text) => setNote(text)}
              multiline
              value={note}
            />
          </>
        )}
        <TouchableOpacity onPress={nextQuestion}>
          <Text style={styles.backButton} onPress={previousQuestion}>
            Retour
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {isLastQuestion() && (
        <View style={[styles.container, styles.bottom]}>
          <TouchableOpacity
            onPress={() => nextQuestion(note)}
            style={styles.ValidationButton}>
            <Text style={styles.ValidationButtonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      )}
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
