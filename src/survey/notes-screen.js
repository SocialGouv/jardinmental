import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../common/colors';
import {availableData} from './survey-data';
import {categories} from '../common/constants';
import {DiaryDataContext} from '../context';
import {isYesterday, parseISO} from 'date-fns';
import Button from '../common/button';

const Notes = ({navigation, route}) => {
  const [notes, setNotes] = useState('');
  const setDiaryData = useContext(DiaryDataContext)[1];

  const previousQuestion = () => {
    const redirect = route.params?.backRedirect
      ? `question-${route.params.backRedirect}`
      : 'tabs';
    navigation.navigate(redirect);
  };

  const validateSurvey = () => {
    const survey = route.params?.currentSurvey;
    const currentSurvey = {
      date: survey?.date,
      answers: {...survey?.answers, [categories.NOTES]: notes},
    };
    setDiaryData(currentSurvey);
    navigation.navigate('tabs');
  };

  const isSurveyDateYesterday = isYesterday(
    parseISO(route.params?.currentSurvey?.date),
  );

  const {question, yesterdayQuestion} = availableData.find(
    ({id}) => id === categories.NOTES,
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.question}>
          {isSurveyDateYesterday ? yesterdayQuestion : question}
        </Text>
        <TextInput
          multiline={true}
          onChangeText={setNotes}
          value={notes}
          placeholder="Saisissez une note"
          style={styles.textArea}
        />
        <Text style={styles.backButton} onPress={previousQuestion}>
          Retour
        </Text>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button onPress={validateSurvey} title="Valider" />
      </View>
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
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  textArea: {
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default Notes;
