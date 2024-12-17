import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Status from '../scenes/status';
import Exercise from '../scenes/exercise';
import Suivi from '../scenes/suivi';
import SurveyMenu from '../../assets/svg/SurveyMenu';
import ExerciseMenu from '../../assets/svg/ExerciseMenu';
import GraphMenu from '../../assets/svg/GraphMenu';
import {View, Text} from 'react-native';
import {colors} from '../utils/colors';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';

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
    <Tab.Navigator
      initialRouteName="Status"
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarShowIcon: true,
        tabBarShowLabel: true,
        tabBarIndicatorStyle: {display: 'none'}, // Hide the indicator
        tabBarStyle: {
          maxHeight: 80,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
        },
        tabBarIconStyle: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontSize: 10,
          marginHorizontal: 0,
          padding: 0,
        },
        tabBarActiveTintColor: colors.BLUE,
        tabBarInactiveTintColor: '#a1a1a1',
      }}>
      <Tab.Screen
        name="Status"
        options={{
          tabBarLabel: 'Mes entrées',
          tabBarIcon: ({focused, color}) => (
            <View style={{alignItems: 'center'}}>
              <SurveyMenu height={24} width={24} color={color} />
            </View>
          ),
        }}>
        {p => <Status {...p} startSurvey={startSurvey} />}
      </Tab.Screen>
      <Tab.Screen
        name="Calendar"
        options={{
          tabBarLabel: 'Mes analyses',
          tabBarIcon: ({focused, color}) => (
            <View style={{alignItems: 'center'}}>
              <GraphMenu height={24} width={24} color={color} />
            </View>
          ),
        }}>
        {p => <Suivi {...p} startSurvey={startSurvey} />}
      </Tab.Screen>
      <Tab.Screen
        name="Exercise"
        options={{
          tabBarLabel: 'Beck',
          tabBarIcon: ({focused, color}) => (
            <View style={{alignItems: 'center'}}>
              <ExerciseMenu height={24} width={24} color={color} />
            </View>
          ),
        }}>
        {p => <Exercise {...p} startSurvey={startSurvey} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Tabs;
