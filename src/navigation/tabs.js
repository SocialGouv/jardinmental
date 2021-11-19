import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Diary from '../scenes/diary';
import Status from '../scenes/status';
import Exercise from '../scenes/exercise';
import Calendar from '../scenes/calendar/calendar';
import SurveyMenu from '../../assets/svg/SurveyMenu';
import DiaryMenu from '../../assets/svg/DiaryMenu';
import ExerciseMenu from '../../assets/svg/ExerciseMenu';
import GraphMenu from '../../assets/svg/GraphMenu';
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
          indicatorStyle: {height: 0},
          style: styles.tabBar,
          labelStyle: {
            textTransform: 'capitalize',
            fontSize: 10,
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
            tabBarIcon: ({color}) => <SurveyMenu style={{color}} />,
          }}
        />
        <Tab.Screen
          name="Diary"
          component={Diary}
          options={{
            tabBarLabel: 'Mon journal',
            tabBarIcon: ({color}) => <DiaryMenu style={{color}} />,
          }}
        />
        <Tab.Screen
          name="Exercice"
          component={Exercise}
          options={{
            tabBarLabel: 'Exercice',
            tabBarIcon: ({color}) => <ExerciseMenu style={{color}} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={{
            tabBarLabel: 'Mon suivi',
            tabBarIcon: ({color}) => <GraphMenu style={{color}} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: colors.LIGHT_BLUE_TRANS,
    borderTopWidth: 0.5,
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
