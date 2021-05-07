import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableHighlight,
} from 'react-native';
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
import {Circle} from 'react-native-svg';
import Icon from '../common/icon';

const Tab = createMaterialTopTabNavigator();

const Tabs = ({navigation, route}) => {
  // const [questions, setQuestions] = useState([]);
  // const [alert, setAlert] = useState(false);
  // const [diaryData] = useContext(DiaryDataContext);

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

  // const alertNoDataYesterday = (date) => {
  //   if (
  //     questions.length &&
  //     isToday(parseISO(date)) &&
  //     !diaryData[formatDay(beforeToday(1))]
  //   ) {
  //     setAlert(true);
  //     Alert.alert('Souhaitez-vous renseigner vos ressentis pour hier ?', '', [
  //       {
  //         text: 'Oui, je les renseigne maintenant',
  //         onPress: () => {
  //           logEvents.logFeelingStartYesterday(true);
  //           navigation.navigate('question', {
  //             currentSurvey: {
  //               date: formatDay(beforeToday(1)),
  //               answers: {},
  //             },
  //             index: questions[0],
  //           });
  //         },
  //         style: 'default',
  //       },
  //       {
  //         text: 'Plus tard',
  //         onPress: () => {
  //           logEvents.logFeelingStartYesterday(false);
  //         },
  //         style: 'cancel',
  //       },
  //     ]);
  //   }
  // };

  // useEffect(() => {
  //   (async () => {
  //     const q = await buildSurveyData();
  //     if (q) setQuestions(q);
  //   })();
  // !alert &&
  //   route?.params?.checkYesterday &&
  //   alertNoDataYesterday(route?.params?.currentSurvey?.date);
  // }, [navigation, route]);
  return (
    <>
      <SafeAreaView style={styles.surveyButton}>
        <Icon
          activeOpacity={0.9}
          icon="PlusSvg"
          onPress={handlePlus}
          width={50}
          height={50}
        />
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
          style: styles.tabBar,
          labelStyle: {
            textTransform: 'capitalize',
            fontSize: 11,
            marginHorizontal: 0,
            marginVertical: Platform.OS === 'android' ? 0 : 5,
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
          }}
        />
        {/* <Tab.Screen
          name="Infos"
          component={Infos}
          options={{
            tabBarLabel: 'Infos',
            tabBarIcon: ({color}) => <InfoSvg style={{color}} />,
          }}
        /> */}
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 1,
    maxHeight: 80,
  },
  surveyButton: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 40 : 50,

    zIndex: 1,
    alignSelf: 'center',
    // backgroundColor: colors.LIGHT_BLUE,
    // padding: 12,
    // width: '100%',
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
