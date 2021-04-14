import React from 'react';
import {StyleSheet, SafeAreaView, Platform} from 'react-native';
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

const Tab = createMaterialTopTabNavigator();

const Tabs = ({navigation}) => {
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
