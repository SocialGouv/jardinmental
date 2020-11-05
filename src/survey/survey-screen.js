import React, {useContext} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import {colors} from '../common/colors';
import CircledIcon from '../common/circled-icon';
import {surveyData} from './survey-data';
import SurveyExplanation from './survey-explanation';
import {AppContext} from '../../App';
import {createTodayDiaryDataIfNotExists} from '../utils/diary-util';
import {categories} from '../common/constants';

const SurveyScreen = ({
  question,
  answers,
  explanation,
  currentSurveyItem,
  navigation,
  questionId,
}) => {
  const totalQuestions = surveyData.length;
  const {diaryData, setDiaryData} = useContext(AppContext);

  const nextQuestion = (answer) => {
    if (currentSurveyItem !== totalQuestions - 1) {
      navigation.navigate(`question-${currentSurveyItem + 1}`);
    } else {
      navigation.navigate('tabs');
    }
    /*if (answer.id === 'TODAY') {
      createTodayDiaryDataIfNotExists(diaryData);
    } else if (answer.id === 'YESTERDAY') {
      console.log('yesterday');
    } else {
      console.log('diaryData', diaryData);
      const newPatientState = {
        ...diaryData[0].patientState,
        [categories[questionId]]: answer.id,
      };
      const newDiaryData = {
        date: diaryData[0].date,
        patientState: newPatientState,
      };
      setDiaryData(newDiaryData);
    }*/
  };

  const previousQuestion = () => {
    if (currentSurveyItem !== 0) {
      navigation.navigate(`question-${currentSurveyItem - 1}`);
    } else {
      navigation.navigate('tabs');
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.question}>{question}</Text>
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
    </>
  );
};

const styles = StyleSheet.create({
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
