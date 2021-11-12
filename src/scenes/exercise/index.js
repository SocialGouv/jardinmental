import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import NPS from '../../services/NPS/NPS';
import Header from '../../components/Header';
import ExerciseItem from './exercise-item';
import {DiaryDataContext} from '../../context';
import {formatDateThread} from '../../utils/date/helpers';
import ContributeCard from '../contribute/contributeCard';
import {STORAGE_KEY_BECK_SHOW_WELCOME} from '../../utils/constants';

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

export default ({navigation}) => {
  const [NPSvisible, setNPSvisible] = useState(false);
  const [diaryData] = useContext(DiaryDataContext);
  const [page, setPage] = useState(1);
  const [showWelcome, setShowWelcome] = useState('false');
  const [showWelcomeDefault, setShowWelcomeDefault] = useState(true);

  useEffect(() => {
    (async () => {
      setShowWelcome(await AsyncStorage.getItem(STORAGE_KEY_BECK_SHOW_WELCOME));
    })();
  }, []);

  const validateWelcomeMessage = async () => {
    setShowWelcome('false');
    await AsyncStorage.setItem(
      STORAGE_KEY_BECK_SHOW_WELCOME,
      `${showWelcomeDefault}`,
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={() => setNPSvisible(false)} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Header
          title="Mes fiches de pensées automatiques"
          navigation={navigation}
        />
        {showWelcome === 'true' || !showWelcome ? (
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, styles.boldText]}>
              Cet exerice nécessite des explications afin de le réaliser.
            </Text>
            <Text style={styles.welcomeText}>
              Vous pouvez en parler à un thérapeute ou cliquer sur ce lien pour
              de plus amples informations :
            </Text>
            <View style={styles.showWelcomeView}>
              <CheckBox
                animationDuration={0.2}
                boxType="square"
                style={styles.checkbox}
                value={!showWelcomeDefault}
                onValueChange={(value) => setShowWelcomeDefault(!value)}
                // for android
                tintColors={{true: colors.LIGHT_BLUE, false: '#aaa'}}
                // for ios
                tintColor="#aaa"
                onCheckColor={colors.LIGHT_BLUE}
                onTintColor={colors.LIGHT_BLUE}
                onAnimationType="bounce"
                offAnimationType="bounce"
              />
              <Text>Ne plus afficher ce message</Text>
            </View>
            <TouchableOpacity
              onPress={validateWelcomeMessage}
              style={styles.button}>
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('beck')}
              style={styles.button}>
              <Text style={styles.buttonText}>
                Faire le point sur un événement
              </Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            {Object.keys(diaryData)
              .sort((a, b) => {
                a = a.split('/').reverse().join('');
                b = b.split('/').reverse().join('');
                return b.localeCompare(a);
              })
              .slice(0, LIMIT_PER_PAGE * page)
              .filter(
                (el) =>
                  diaryData[el]?.becks &&
                  Object.keys(diaryData[el].becks).length > 0,
              )
              .map((date) => (
                <View key={date}>
                  <Text style={styles.subtitle}>{formatDateThread(date)}</Text>
                  <ExerciseItem
                    patientState={diaryData[date]}
                    date={date}
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#E7E9F1',
    borderRadius: 10,
  },
  welcomeText: {marginBottom: 30},
  boldText: {fontWeight: 'bold'},
  showWelcomeView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  button: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
    width: '50%',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 19,
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
});
