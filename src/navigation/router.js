import React from 'react';
import Tabs from './tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {availableData} from '../survey/survey-data';
import SurveyScreen from '../survey/survey-screen';
import SymptomScreen from '../symptoms/symptoms-screen';
import Reminder from '../reminder/reminder';
import Export from '../export/export';
import DailyChart from '../calendar/daily-chart';
import {Platform} from 'react-native';
import Notes from '../survey/notes-screen';
import Onboarding from '../onboarding/onboarding';
import CGU from '../legal/cgu-screen';
import Privacy from '../legal/privacy-screen';
import LegalMentions from '../legal/legal-mentions-screen';

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
            {({navigation, route}) => (
              <SurveyScreen
                question={availableData[index].question}
                yesterdayQuestion={availableData[index].yesterdayQuestion}
                answers={availableData[index].answers}
                explanation={availableData[index].explanation}
                currentSurveyItem={index}
                questionId={surveyItem.id}
                navigation={navigation}
                route={route}
              />
            )}
          </Stack.Screen>
        ))}
        <Stack.Screen name="symptoms">
          {(props) => <SymptomScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="reminder" component={Reminder} />
        <Stack.Screen name="export" component={Export} />
        <Stack.Screen name="chart-day" component={DailyChart} />
        <Stack.Screen
          name="notes"
          options={{animationEnabled: Platform.OS === 'ios'}}>
          {({navigation, route}) => (
            <Notes navigation={navigation} route={route} />
          )}
        </Stack.Screen>
        <Stack.Screen name="onboarding" component={Onboarding} />
        <Stack.Screen name="cgu" component={CGU} />
        <Stack.Screen name="privacy" component={Privacy} />
        <Stack.Screen name="legal-mentions" component={LegalMentions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
