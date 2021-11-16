import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Text from '../../components/MyText';
import StatusItem from './status-item';
import ContributeCard from '../contribute/contributeCard';
import Header from '../../components/Header';
import {colors} from '../../utils/colors';
import {useContext} from 'react';
import {DiaryDataContext} from '../../context';
import localStorage from '../../utils/localStorage';
import NPS from '../../services/NPS/NPS';
import Bubble from '../../components/bubble';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';
import logEvents from '../../services/logEvents';
import {formatDateThread} from '../../utils/date/helpers';

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

const Status = ({navigation}) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [NPSvisible, setNPSvisible] = useState(false);
  const [page, setPage] = useState(1);

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

  const startSurvey = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents.logFeelingStart();
    if (!symptoms) {
      navigation.navigate('symptoms', {
        showExplanation: true,
        redirect: 'select-day',
      });
    } else {
      navigation.navigate('select-day');
    }
  };

  // display only LIMIT_PER_PAGE days
  // button that will display LIMIT_PER_PAGE more each time

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={() => setNPSvisible(false)} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Header title="Mon état quotidien" navigation={navigation} />
        <TouchableOpacity onPress={startSurvey} style={styles.setupButton}>
          <Text style={styles.setupButtonText}>
            Comment s'est passée ma journée
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        <Bubble diaryData={diaryData} navigation={navigation} />
        {Object.keys(diaryData)
          .sort((a, b) => {
            a = a.split('/').reverse().join('');
            b = b.split('/').reverse().join('');
            return b.localeCompare(a);
          })
          .slice(0, LIMIT_PER_PAGE * page)
          .map((date) => (
            <View key={date}>
              <Text style={styles.subtitle}>{formatDateThread(date)}</Text>
              <StatusItem
                date={date}
                patientState={diaryData[date]}
                navigation={navigation}
              />
            </View>
          ))}
        <ContributeCard onPress={() => setNPSvisible(true)} />
        {Object.keys(diaryData)?.length > LIMIT_PER_PAGE * page && (
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
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  setupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width > 350 ? 19 : 15,
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
});

export default Status;
