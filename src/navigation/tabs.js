import React from 'react';
import {StyleSheet, SafeAreaView, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Diary from '../scenes/diary';
import Status from '../scenes/status';
import Exercise from '../scenes/exercise';
import Calendar from '../scenes/calendar/calendar';
import DiarySvg from '../../assets/svg/diary.js';
import StatusSvg from '../../assets/svg/status.js';
import CourbeSvg from '../../assets/svg/Courbes';
import ExerciseSvg from '../../assets/svg/exercise';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';
import {colors} from '../utils/colors';

const Tab = createMaterialTopTabNavigator();

const Tabs = ({navigation, route}) => {
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

  return (
    <>
      <Tab.Navigator
        initialRouteName="Status"
        swipeEnabled={true}
        tabBarPosition="bottom"
        tabBarOptions={{
          activeTintColor: colors.LIGHT_BLUE,
          inactiveTintColor: colors.BLUE,
          showIcon: true,
          indicatorStyle: {
            height: 3,
            top: 0,
            backgroundColor: colors.LIGHT_BLUE,
            borderRadius: 5,
          },
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
          name="Status"
          component={Status}
          options={{
            tabBarLabel: 'Mon état',
            tabBarIcon: ({color}) => <StatusSvg style={{color}} />,
          }}
        />
        <Tab.Screen
          name="Diary"
          component={Diary}
          options={{
            tabBarLabel: 'Journal',
            tabBarIcon: ({color}) => <DiarySvg style={{color}} />,
          }}
        />
        <Tab.Screen
          name="Exercice"
          component={Exercise}
          options={{
            tabBarLabel: 'Exercice',
            tabBarIcon: ({color}) => <ExerciseSvg style={{color}} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={{
            tabBarLabel: 'Bilan',
            tabBarIcon: ({color}) => <CourbeSvg style={{color}} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    maxHeight: 80,
  },
  surveyButton: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 40 : 50,

    zIndex: 1,
    alignSelf: 'center',
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
