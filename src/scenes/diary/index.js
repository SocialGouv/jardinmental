import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import Text from '../../components/MyText';
import DiaryNotes from './DiaryNotes';
import ContributeCard from '../contribute/contributeCard';
import Header from '../../components/Header';
import {colors} from '../../utils/colors';
import {DiaryNotesContext} from '../../context/diaryNotes';
import localStorage from '../../utils/localStorage';
import NPS from '../../services/NPS/NPS';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';
import logEvents from '../../services/logEvents';
import {
  formatDateThread,
  beforeToday,
  formatDay,
} from '../../utils/date/helpers';
import Button from './Button';

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

const Diary = ({navigation}) => {
  const [diaryNotes, setDiaryNotes] = useContext(DiaryNotesContext);
  const [NPSvisible, setNPSvisible] = useState(false);
  const [page, setPage] = useState(1);
  const [buffer, setBuffer] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const handleOnboarding = async () => {
      const onboardingStep = await localStorage.getOnboardingStep();
      const onboardingIsDone = await localStorage.getOnboardingDone();

      //if ONBOARDING_DONE is true, do nothing
      if (Boolean(onboardingIsDone)) return;
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

  const getNumberOfLines = () => {
    if (Platform.OS === 'ios') return null;
    return inputFocused ? 3 : 1;
  };
  const getMinHeight = () => {
    if (Platform.OS !== 'ios') return null;
    return inputFocused ? 20 * 3 : 1;
  };

  const addDiaryNote = () => {
    const date = formatDay(beforeToday(0));
    // const previousArray = diaryNotes[date]?.values || [];
    const note = {
      date,
      value: {timestamp: Date.now(), id: uuidv4(), value: buffer, version: 1},
    };
    setDiaryNotes(note);
    setBuffer('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={() => setNPSvisible(false)} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Header title="Mon journal" navigation={navigation} />
        <View>
          <TextInput
            multiline={true}
            numberOfLines={getNumberOfLines()}
            minHeight={getMinHeight()}
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
              <Button
                icon="validate"
                visible
                disabled={!buffer}
                onPress={addDiaryNote}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.divider} />
        {Object.keys(diaryNotes)
          .sort((a, b) => {
            a = a.split('/').reverse().join('');
            b = b.split('/').reverse().join('');
            return b.localeCompare(a);
          })
          .slice(0, LIMIT_PER_PAGE * page)
          .map((date) => (
            <View key={date}>
              <Text style={styles.subtitle}>{formatDateThread(date)}</Text>
              <DiaryNotes
                date={date}
                diaryNote={diaryNotes[date]}
                navigation={navigation}
              />
            </View>
          ))}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
