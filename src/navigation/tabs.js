import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Diary from '../diary/diary';
import Calendar from '../calendar/calendar';
import DiarySvg from '../../assets/svg/diary.svg';
import PlusSvg from '../../assets/svg/plus.svg';
import CalendarSvg from '../../assets/svg/calendar.svg';

const Tab = createMaterialTopTabNavigator();

const Tabs = ({navigation}) => (
  <>
    <SafeAreaView style={styles.surveyButton}>
      <PlusSvg onPress={() => navigation.navigate('question-0')} />
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
    </Tab.Navigator>
  </>
);

const styles = StyleSheet.create({
  surveyButton: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    zIndex: 1,
    alignSelf: 'center',
  },
});

export default Tabs;
