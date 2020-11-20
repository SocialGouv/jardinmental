import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Diary from '../diary/diary';
import Calendar from '../calendar/calendar';
import DiarySvg from '../../assets/svg/diary.svg';
import PlusSvg from '../../assets/svg/plus.svg';
import CalendarSvg from '../../assets/svg/calendar.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY_SYMPTOMS} from '../common/constants';

const Tab = createMaterialTopTabNavigator();

const Tabs = ({navigation}) => {
  const [symptoms, setSymptoms] = useState();

  useEffect(() => {
    const getSymptoms = async () => {
      const symp = await AsyncStorage.getItem(STORAGE_KEY_SYMPTOMS);
      if (symp) setSymptoms(symp);
    };
    getSymptoms();
  }, []);

  const handlePlus = () => {
    if (!symptoms) {
      navigation.navigate('symptoms', {
        showExplanation: true,
        redirect: 'question-0',
      });
    } else {
      navigation.navigate('question-0');
    }
  };
  return (
    <>
      <SafeAreaView style={styles.surveyButton}>
        <PlusSvg onPress={handlePlus} />
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
};

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
