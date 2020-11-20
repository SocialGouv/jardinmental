import React, {useEffect, useState} from 'react';
import Tabs from './tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {buildSurveyData} from '../survey/survey-data';
// import {surveyData} from '../survey/survey-data';
import SurveyScreen from '../survey/survey-screen';
import SymptomScreen from '../symptoms/symptoms-screen';
import Reminder from '../reminder/reminder';
import DailyChart from '../calendar/daily-chart';
import {Platform} from 'react-native';
import localStorage from '../utils/localStorage';

const Stack = createStackNavigator();

const Router = () => {
  const [surveyData, setSurveyData] = useState();

  useEffect(() => {
    (async () => {
      const data = await buildSurveyData();
      if (data) setSurveyData(data);
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="tabs" headerMode="none">
        <Stack.Screen name="tabs" component={Tabs} />
        {surveyData &&
          surveyData.map((surveyItem, index) => (
            <Stack.Screen
              name={`question-${index}`}
              key={`question-${index}`}
              options={{animationEnabled: Platform.OS === 'ios'}}>
              {(props) => (
                <SurveyScreen
                  question={surveyData[index].question}
                  yesterdayQuestion={surveyData[index].yesterdayQuestion}
                  answers={surveyData[index].answers}
                  explanation={surveyData[index].explanation}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
