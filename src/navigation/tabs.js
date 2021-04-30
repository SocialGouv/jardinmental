import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Platform, Alert} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Diary from '../diary/diary';
import Calendar from '../calendar/calendar';
import DiarySvg from '../../assets/svg/diary.svg';
import InfoSvg from '../../assets/svg/info.svg';
import PlusSvg from '../../assets/svg/plus.svg';
import CalendarSvg from '../../assets/svg/calendar.svg';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';
import Infos from '../infos';
import {colors} from '../common/colors';
import Text from '../components/MyText';
import {buildSurveyData} from '../survey/survey-data';
import {DiaryDataContext} from '../context';
import {isToday, parseISO} from 'date-fns';
import {beforeToday, formatDay} from '../services/date/helpers';

const Tab = createMaterialTopTabNavigator();

const Tabs = ({navigation, route}) => {
  const [questions, setQuestions] = useState([]);
  const [diaryData] = useContext(DiaryDataContext);

  const handlePlus = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents.logFeelingStart();
    if (!symptoms) {
      navigation.navigate('symptoms', {
        showExplanation: true,
        redirect: '0',
      });
    } else {
      navigation.navigate('question', {index: 0});
    }
  };

  const alertNoDataYesterday = (date) => {
    console.log('in alert fun');
    console.log(date);
    console.log(isToday(parseISO(date)));
    console.log(!diaryData[formatDay(beforeToday(1))]);
    if (
      questions.length &&
      isToday(parseISO(date)) &&
      !diaryData[formatDay(beforeToday(1))]
    ) {
      Alert.alert('Souhaitez-vous renseigner vos ressentis pour hier ?', '', [
        {
          text: 'Oui, je les renseigne maintenant',
          onPress: () => {
            logEvents.logFeelingStartYesterday(true);
            navigation.navigate('question', {
              currentSurvey: {
                date: formatDay(beforeToday(1)),
                answers: {},
              },
              index: questions[0],
            });
          },
          style: 'default',
        },
        {
          text: 'Plus tard',
          onPress: () => {
            logEvents.logFeelingStartYesterday(false);
          },
          style: 'cancel',
        },
      ]);
    }
  };

  useEffect(() => {
    (async () => {
      const q = await buildSurveyData();
      if (q) setQuestions(q);
    })();
    route?.params?.checkYesterday &&
      alertNoDataYesterday(route?.params?.currentSurvey?.date);
  }, [navigation, route]);
  return (
    <>
      <SafeAreaView style={styles.surveyButton}>
        <Text onPress={handlePlus} style={styles.text}>
          Saisir mes derniers ressentis
        </Text>
      </SafeAreaView>
      <Tab.Navigator
        initialRouteName="Diary"
        swipeEnabled={true}
        tabBarPosition="bottom"
        tabBarOptions={{
          activeTintColor: '#26387C',
          inactiveTintColor: '#E5E5E5',
          showIcon: true,
          indicatorStyle: {height: 0},
          labelStyle: {
            fontSize: 13,
            marginHorizontal: 0,
            marginVertical: 5,
            padding: 0,
          },
        }}>
        <Tab.Screen
          name="Diary"
          component={Diary}
          options={{
            tabBarLabel: 'Journal',
            tabBarIcon: ({color}) => <DiarySvg style={{color}} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={{
            tabBarLabel: 'Calendrier',
            tabBarIcon: ({color}) => <CalendarSvg style={{color}} />,
            tabBarAccessibilityLabel: 'Yo',
          }}
        />
        <Tab.Screen
          name="Infos"
          component={Infos}
          options={{
            tabBarLabel: 'Infos',
            tabBarIcon: ({color}) => <InfoSvg style={{color}} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  surveyButton: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: 72,
    zIndex: 1,
    alignSelf: 'center',
    backgroundColor: colors.LIGHT_BLUE,
    padding: 12,
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingVertical: Platform.OS === 'android' ? 5 : 17,
    fontWeight: '700',
  },
});

export default Tabs;
