import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import CircledIcon from '../../components/CircledIcon';
import {
  beforeToday,
  formatDay,
  formatRelativeDate,
} from '../../utils/date/helpers';
import {subDays} from 'date-fns';
import BackButton from '../../components/BackButton';
import {firstLetterUppercase} from '../../utils/string-util';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';

const SurveyScreen = ({navigation}) => {
  const startSurvey = (offset) => {
    const currentSurvey = {
      date: formatDay(beforeToday(offset)),
      answers: {},
    };
    return navigation.navigate('day-survey', {
      currentSurvey,
    });
  };

  const now = new Date(Date.now());

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView style={styles.container}>
        <Text style={styles.question}>
          Commençons ! Pour quel jour souhaites-tu remplir ton questionnaire ?
        </Text>
        {[...Array(7)].map((_, i) => {
          const value = formatDay(subDays(now, i));
          let label = firstLetterUppercase(formatRelativeDate(value));
          return (
            <TouchableOpacity key={i} onPress={() => startSurvey(i)}>
              <View style={styles.answer}>
                <View style={styles.answerLabel}>
                  <CircledIcon color="white" icon="TodaySvg" />
                  <Text style={styles.label}>{label}</Text>
                </View>
                <ArrowUpSvg style={styles.arrowRight} color={colors.BLUE} />
              </View>
            </TouchableOpacity>
          );
        })}
        <Text style={styles.subtitleTop}>Attention !</Text>
        <Text style={styles.subtitle}>
          Je ne peux pas remplir au-delà de 7 jours car les informations seront
          alors moins fidèles
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  arrowRight: {
    transform: [{rotate: '90deg'}],
  },
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
  subtitleTop: {
    flex: 1,
    color: colors.LIGHT_BLUE,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    marginTop: 15,

    fontWeight: 'normal',
    textAlign: 'center',
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
    justifyContent: 'space-between',
  },
  answerLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '600',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  textInput: {
    fontSize: 20,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});

export default SurveyScreen;
