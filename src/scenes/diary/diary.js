import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Text from '../../components/MyText';
import DiaryItem from './diary-item';
import ContributeItem from './contribute-item';
import Header from '../../components/Header';
import {colors} from '../../utils/colors';
import {format, parseISO, isToday, isYesterday} from 'date-fns';
import {fr} from 'date-fns/locale';
import {firstLetterUppercase} from '../../utils/string-util';
import {useContext} from 'react';
import {DiaryDataContext} from '../../context';
import localStorage from '../../utils/localStorage';
import NPS from '../../services/NPS/NPS';
import Bubble from '../../components/bubble';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

const Diary = ({navigation}) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [NPSvisible, setNPSvisible] = useState(false);
  const [page, setPage] = useState(1);

  const formatDate = (date) => {
    const isoDate = parseISO(date);
    if (isToday(isoDate)) {
      return "Aujourd'hui";
    } else if (isYesterday(isoDate)) {
      return 'Hier';
    } else {
      const formattedDate = format(isoDate, 'EEEE d MMMM', {locale: fr});
      return firstLetterUppercase(formattedDate);
    }
  };

  const onPressContribute = () => setNPSvisible(true);
  const closeNPS = () => setNPSvisible(false);

  useEffect(() => {
    const handleNavigation = async () => {
      const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
      if (isFirstAppLaunch !== 'false') {
        navigation.navigate('onboarding');
      }
    };
    handleNavigation();
  }, [navigation]);

  // display only LIMIT_PER_PAGE days
  // button that will display LIMIT_PER_PAGE more each time

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={closeNPS} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Header title="Mon journal" navigation={navigation} />
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
              <Text style={styles.title}>{formatDate(date)}</Text>
              <DiaryItem
                date={date}
                patientState={diaryData[date]}
                navigation={navigation}
              />
            </View>
          ))}
        <ContributeItem onPress={onPressContribute} />
        {Object.keys(diaryData)?.length > LIMIT_PER_PAGE * page ? (
          <TouchableOpacity
            onPress={() => setPage(page + 1)}
            style={styles.versionContainer}>
            <Text style={styles.arrowDownLabel}>Voir plus</Text>
            <ArrowUpSvg style={styles.arrowDown} color={colors.BLUE} />
          </TouchableOpacity>
        ) : null}
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
});

export default Diary;
