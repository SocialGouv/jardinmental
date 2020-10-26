import React from 'react';
import Diary from '../diary/diary';
import Calendar from '../calendar';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DiarySvg from '../../assets/svg/diary.svg';
import PlusSvg from '../../assets/svg/plus.svg';
import CalendarSvg from '../../assets/svg/calendar.svg';
import Survey from '../survey';
import {StyleSheet, View} from 'react-native';

const Tab = createMaterialTopTabNavigator();

const Router = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName="Diary"
      swipeEnabled={true}
      tabBarPosition="bottom"
      tabBarOptions={{
        activeTintColor: '#26387C',
        inactiveTintColor: '#E5E5E5',
        showIcon: true,
        indicatorStyle: {height: 0},
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
        name="Survey"
        component={Survey}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={styles.surveyButton}>
              <PlusSvg />
            </View>
          ),
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
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  surveyButton: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default Router;
