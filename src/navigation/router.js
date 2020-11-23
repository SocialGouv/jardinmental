import React from 'react';
import Tabs from './tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {availableData} from '../survey/survey-data';
import SurveyScreen from '../survey/survey-screen';
import SymptomScreen from '../symptoms/symptoms-screen';
import Reminder from '../reminder/reminder';
import DailyChart from '../calendar/daily-chart';
import {Platform} from 'react-native';
import Notes from '../survey/notes-screen';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="tabs" headerMode="none">
        <Stack.Screen name="tabs" component={Tabs} />
        {availableData.map((surveyItem, index) => (
          <Stack.Screen
            name={`question-${index}`}
            key={`question-${index}`}
            options={{animationEnabled: Platform.OS === 'ios'}}>
            {(props) => (
              <SurveyScreen
                question={availableData[index].question}
                yesterdayQuestion={availableData[index].yesterdayQuestion}
                answers={availableData[index].answers}
                explanation={availableData[index].explanation}
                currentSurveyItem={index}
                questionId={surveyItem.id}
                {...props}
              />
            )}
          </Stack.Screen>
        ))}
        <Stack.Screen name="symptoms">
          {(props) => <SymptomScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="reminder" component={Reminder} />
        <Stack.Screen name="chart-day" component={DailyChart} />
        <Stack.Screen
          name="notes"
          options={{animationEnabled: Platform.OS === 'ios'}}>
          {({navigation, route}) => (
            <Notes navigation={navigation} route={route} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
