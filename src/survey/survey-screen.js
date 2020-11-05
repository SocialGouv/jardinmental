import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import {colors} from '../colors';
import CircledIcon from '../common/circled-icon';
import {surveyData} from './survey-data';
import SurveyExplanation from './survey-explanation';

const SurveyScreen = ({
  question,
  answers,
  explanation,
  currentSurveyItem,
  navigation,
}) => {
  const totalQuestions = surveyData.length;

  const nextQuestion = () => {
    if (currentSurveyItem !== totalQuestions - 1) {
      navigation.navigate(`question-${currentSurveyItem + 1}`);
    } else {
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

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.question}>{question}</Text>
        {answers.map((answer, index) => (
          <TouchableOpacity key={index} onPress={nextQuestion}>
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
