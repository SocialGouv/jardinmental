import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  View,
  Platform,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {
  availableData,
  buildSurveyData,
  alertNoDataYesterday,
} from './survey-data';
import {categories} from '../../utils/constants';
import {DiaryDataContext} from '../../context';
import {isYesterday, parseISO} from 'date-fns';
import Button from '../../components/Button';
import logEvents from '../../services/logEvents';
import BackButton from '../../components/BackButton';
import localStorage from '../../utils/localStorage';

const Notes = ({navigation, route}) => {
  const [notesEvents, setNotesEvents] = useState(
    route?.params?.currentSurvey?.answers?.NOTES?.notesEvents,
  );
  const [notesSymptoms, setNotesSymptoms] = useState(
    route?.params?.currentSurvey?.answers?.NOTES?.notesSymptoms,
  );
  const [notesToxic, setNotesToxic] = useState(
    route?.params?.currentSurvey?.answers?.NOTES?.notesToxic,
  );
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      const q = await buildSurveyData();
      if (q) {
        setQuestions(q);
      }
    })();
  }, []);

  const previousQuestion = () => {
    if (route.params?.backRedirect) {
      console.log(route.params?.backRedirect);
      navigation.navigate('question', {
        ...route.params,
        index: route.params.backRedirect,
      });
    } else {
      console.log('tabs');
      navigation.navigate('tabs');
    }
  };

  const validateSurvey = async () => {
    const survey = route.params?.currentSurvey;
    const currentSurvey = {
      date: survey?.date,
      answers: {
        ...survey?.answers,
        [categories.NOTES]: {notesEvents, notesSymptoms, notesToxic},
      },
    };
    setDiaryData(currentSurvey);
    logEvents.logFeelingAdd();

    if (route.params?.redirect) {
      alertNoDataYesterday({date: survey?.date, diaryData, navigation});
      return navigation.navigate('tabs');
    }

    const medicalTreatmentStorage = await localStorage.getMedicalTreatment();
    if (medicalTreatmentStorage?.length === 0) {
      alertNoDataYesterday({date: survey?.date, diaryData, navigation});
      return navigation.navigate('tabs');
    }
    navigation.navigate('drugs', {
      currentSurvey,
      backRedirect: 'notes',
    });
  };

  const isSurveyDateYesterday = isYesterday(
    parseISO(route.params?.currentSurvey?.date),
  );

  const {question, yesterdayQuestion} = availableData.find(
    ({id}) => id === categories.NOTES,
  );

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={previousQuestion} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.question}>
          {isSurveyDateYesterday ? yesterdayQuestion : question}
        </Text>
        <Text style={styles.title}>
          Que m'est-il arrivé aujourd'hui (disputes, examens, ...) ?
        </Text>
        <TextInput
          multiline={true}
          numberOfLines={Platform.OS === 'ios' ? null : 3}
          minHeight={Platform.OS === 'ios' ? 20 * 3 : null}
          onChangeText={setNotesEvents}
          value={notesEvents}
          placeholder="Je me suis disputé avec un ami..."
          style={styles.textArea}
          textAlignVertical={'top'}
        />
        <Text style={styles.title}>
          Je souhaite détailler un ou plusieurs de mes symptômes (ma nuit a été
          ...) ?
        </Text>
        <TextInput
          multiline={true}
          numberOfLines={Platform.OS === 'ios' ? null : 3}
          minHeight={Platform.OS === 'ios' ? 20 * 3 : null}
          onChangeText={setNotesSymptoms}
          value={notesSymptoms}
          placeholder="J'ai mis beaucoup de temps à m'endormir..."
          style={styles.textArea}
          textAlignVertical={'top'}
        />
        <Text style={styles.title}>
          Ai-je consommé des toxiques aujourd'hui ? Si oui, lesquels ?
        </Text>
        <Text style={styles.subtitle}>(ex: tabac, alcool, cannabis, ...)</Text>
        <TextInput
          multiline={true}
          numberOfLines={Platform.OS === 'ios' ? null : 3}
          minHeight={Platform.OS === 'ios' ? 20 * 3 : null}
          onChangeText={setNotesToxic}
          value={notesToxic}
          placeholder="Je n'ai rien consommé aujourd'hui..."
          style={styles.textArea}
          textAlignVertical={'top'}
        />
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
  title: {
    color: colors.DARK_BLUE,
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '500',
  },
  subtitle: {
    color: 'grey',
    fontSize: 14,
    marginBottom: 15,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 150,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
  },
  textArea: {
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default Notes;
