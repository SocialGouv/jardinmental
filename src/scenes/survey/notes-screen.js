import React, {useContext, useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {availableData, alertNoDataYesterday} from './survey-data';
import {DiaryDataContext} from '../../context/diaryData';
import Button from '../../components/Button';
import logEvents from '../../services/logEvents';
import BackButton from '../../components/BackButton';
import RoundButtonIcon from '../../components/RoundButtonIcon';
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

  const [inputFocused, setInputFocused] = useState();
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const scrollRef = useRef();

  const focusNextInput = (previousInput) => {
    if (previousInput === 1) inputRef2.current.focus();
    if (previousInput === 2) inputRef3.current.focus();
    if (previousInput === 3) inputRef3.current.blur();
  };

  const validateSurvey = async () => {
    const survey = route.params?.currentSurvey;
    const currentSurvey = {
      date: survey?.date,
      answers: {
        ...survey?.answers,
        ['NOTES']: {notesEvents, notesSymptoms, notesToxic},
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

  useEffect(() => {
    if (!inputFocused) return;
    scrollRef.current?.scrollTo({
      y: inputFocused * 60,
      animated: true,
    });
  }, [inputFocused]);

  const {question} = availableData.find(({id}) => id === 'NOTES');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safe}
      keyboardVerticalOffset={10}>
      <SafeAreaView style={styles.safe}>
        <BackButton onPress={navigation.goBack} />
        <ScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.question}>{question}</Text>
          <Text style={styles.title}>
            Que m'est-il arrivé aujourd'hui (disputes, examens, ...) ?
          </Text>
          <TextInput
            ref={inputRef1}
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 3}
            minHeight={Platform.OS === 'ios' ? 20 * 3 : null}
            onChangeText={setNotesEvents}
            value={notesEvents}
            placeholder="Je me suis disputé avec un ami..."
            style={styles.textArea}
            textAlignVertical={'top'}
            onFocus={() => setInputFocused(1)}
            onBlur={() => setInputFocused(null)}
          />
          <Text style={styles.title}>
            Je souhaite détailler un ou plusieurs de mes ressentis (ma nuit a
            été ...) ?
          </Text>
          <TextInput
            ref={inputRef2}
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 3}
            minHeight={Platform.OS === 'ios' ? 20 * 3 : null}
            onChangeText={setNotesSymptoms}
            value={notesSymptoms}
            placeholder="J'ai mis beaucoup de temps à m'endormir..."
            style={styles.textArea}
            textAlignVertical={'top'}
            onFocus={() => setInputFocused(2)}
            onBlur={() => setInputFocused(null)}
          />
          <Text style={styles.title}>
            Ai-je consommé des toxiques aujourd'hui ? Si oui, lesquels ?
          </Text>
          <Text style={styles.subtitle}>
            (ex: tabac, alcool, cannabis, ...)
          </Text>
          <TextInput
            ref={inputRef3}
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 3}
            minHeight={Platform.OS === 'ios' ? 20 * 3 : null}
            onChangeText={setNotesToxic}
            value={notesToxic}
            placeholder="Je n'ai rien consommé aujourd'hui..."
            style={styles.textArea}
            textAlignVertical={'top'}
            onFocus={() => setInputFocused(3)}
            onBlur={() => setInputFocused(null)}
          />
        </ScrollView>
        {inputFocused ? (
          <View style={styles.floatingButtonWrapper}>
            <RoundButtonIcon
              onPress={() => focusNextInput(inputFocused)}
              icon={inputFocused === 3 ? 'validate' : 'arrow-right'}
              visible
            />
          </View>
        ) : (
          <View style={styles.buttonWrapper}>
            <Button onPress={validateSurvey} title="Valider" />
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    paddingBottom: 80,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  floatingButtonWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 35,
    right: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginVertical: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textArea: {
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default Notes;
