import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import Text from '../../components/MyText';
import DiaryNotes from './DiaryNotes';
import DiarySymptoms from './DiarySymptoms';
import ContributeCard from '../contribute/contributeCard';
import Header from '../../components/Header';
import {colors} from '../../utils/colors';
import {DiaryNotesContext} from '../../context/diaryNotes';
import {DiaryDataContext} from '../../context/diaryData';
import localStorage from '../../utils/localStorage';
import NPS from '../../services/NPS/NPS';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';
import logEvents from '../../services/logEvents';
import {
  formatDateThread,
  formatDay,
  makeSureTimestamp,
} from '../../utils/date/helpers';
import Button from '../../components/RoundButtonIcon';
import DateOrTimeDisplay from '../../components/DateOrTimeDisplay';
import DatePicker from '../../components/DatePicker';

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

const Diary = ({navigation}) => {
  const [diaryNotes, setDiaryNotes] = useContext(DiaryNotesContext);
  const [diaryData] = useContext(DiaryDataContext);
  const [NPSvisible, setNPSvisible] = useState(false);
  const [page, setPage] = useState(1);
  const [buffer, setBuffer] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const handleOnboarding = async () => {
      const onboardingStep = await localStorage.getOnboardingStep();
      const onboardingIsDone = await localStorage.getOnboardingDone();

      //if ONBOARDING_DONE is true, do nothing
      if (onboardingIsDone) return;
      else {
        const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
        if (isFirstAppLaunch !== 'false') {
          navigation.navigate('onboarding', {
            screen: onboardingStep || 'OnboardingPresentation',
          });
        }
      }
    };
    handleOnboarding();
  }, [navigation]);

  useEffect(() => {}, [inputFocused]);

  const addDiaryNote = () => {
    const date = formatDay(new Date(timestamp));
    const note = {
      date,
      value: {timestamp, id: uuidv4(), value: buffer, version: 1},
    };
    setDiaryNotes(note);
    setBuffer('');
    setTimestamp(Date.now());
    logEvents.logAddNoteDiary();
  };

  const getUserComments = (obj, key) => {
    const userComments = Object.keys(obj[key])
      ?.filter((s) => obj[key][s]?.userComment?.trim())
      .map((e) => ({id: e, value: obj[key][e].userComment?.trim()}));
    return userComments;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={() => setNPSvisible(false)} />
      <View style={styles.headerContainer}>
        <Header title="Mon journal" navigation={navigation} />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View>
          <TextInput
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 1}
            minHeight={Platform.OS === 'ios' ? 30 * 1 : null}
            onChangeText={setBuffer}
            value={buffer}
            placeholder="Saisir ma nouvelle note"
            style={styles.textArea}
            textAlignVertical={'top'}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {inputFocused ? (
            <View style={styles.buttonContainer}>
              <View style={styles.dateContainer}>
                <DateOrTimeDisplay
                  mode="date"
                  date={timestamp}
                  onPress={() => setShowDatePicker('date')}
                />
                <DateOrTimeDisplay
                  mode="time"
                  date={timestamp}
                  onPress={() => setShowDatePicker('time')}
                />
              </View>
              <Button
                icon="validate"
                visible
                disabled={!buffer}
                onPress={() => {
                  Keyboard.dismiss();
                  addDiaryNote();
                }}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.divider} />
        {Object.keys({...diaryNotes, ...diaryData})
          .sort((a, b) => {
            a = a.split('/').reverse().join('');
            b = b.split('/').reverse().join('');
            return b.localeCompare(a);
          })
          .slice(0, LIMIT_PER_PAGE * page)
          .map((date) => {
            if (!diaryNotes[date] && !getUserComments(diaryData, date)?.length)
              return null;
            return (
              <View key={date}>
                <Text style={styles.subtitle}>{formatDateThread(date)}</Text>
                <DiaryNotes
                  date={date}
                  diaryNote={diaryNotes[date]}
                  navigation={navigation}
                />
                <DiarySymptoms
                  date={date}
                  values={getUserComments(diaryData, date)}
                  navigation={navigation}
                />
              </View>
            );
          })}
        <ContributeCard onPress={() => setNPSvisible(true)} />
        {Object.keys(diaryNotes)?.length > LIMIT_PER_PAGE * page && (
          <TouchableOpacity
            onPress={() => setPage(page + 1)}
            style={styles.versionContainer}>
            <Text style={styles.arrowDownLabel}>Voir plus</Text>
            <ArrowUpSvg style={styles.arrowDown} color={colors.BLUE} />
          </TouchableOpacity>
        )}
      </ScrollView>
      <DatePicker
        visible={Boolean(showDatePicker)}
        mode={showDatePicker}
        initDate={timestamp}
        selectDate={(newDate) => {
          if (newDate && showDatePicker === 'date') {
            const newDateObject = new Date(newDate);
            const oldDateObject = new Date(timestamp);
            newDate = new Date(
              newDateObject.getFullYear(),
              newDateObject.getMonth(),
              newDateObject.getDate(),
              oldDateObject.getHours(),
              oldDateObject.getMinutes(),
            );
          }
          setShowDatePicker(false);
          if (newDate) {
            setTimestamp(makeSureTimestamp(newDate));
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 5,
    paddingBottom: 0,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  arrowDown: {
    transform: [{rotate: '180deg'}],
  },
  arrowDownLabel: {
    color: colors.BLUE,
  },
  versionContainer: {
    marginTop: 20,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  title: {
    fontSize: 19,
    paddingBottom: 10,
    color: colors.BLUE,
    fontWeight: '700',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  subtitle: {
    color: colors.BLUE,
    fontSize: 17,
    textAlign: 'center',
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    backgroundColor: '#F2FCFD',
    borderColor: '#D9F5F6',
    borderWidth: 1,
    borderRadius: 10,
    fontWeight: '600',
    overflow: 'hidden',
  },
  verticalBorder: {
    borderLeftWidth: 1,
    borderColor: '#00CEF7',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
    width: '50%',
    alignSelf: 'center',
  },
  textArea: {
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default Diary;
