import React from 'react';
import Tabs from './tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SurveyScreen from '../survey/survey-screen';
import SymptomScreen from '../symptoms/symptoms-screen';
import AddSymptomScreen from '../symptoms/add-symptom-screen';
import Reminder from '../reminder/reminder';
import Export from '../export/export';
import DailyChart from '../calendar/daily-chart';
import {AppState, Platform} from 'react-native';
import Notes from '../survey/notes-screen';
import Onboarding from '../onboarding/onboarding';
import Supported from '../supported/supported';
import CGU from '../legal/cgu-screen';
import Privacy from '../legal/privacy-screen';
import LegalMentions from '../legal/legal-mentions-screen';
import logEvents from '../services/logEvents';
import Contribute from '../contribute';
import Drugs from '../drugs/drugs';
import DrugsList from '../drugs/list';

const Stack = createStackNavigator();

class Router extends React.Component {
  async componentDidMount() {
    await logEvents.initMatomo();
    logEvents.logAppVisit();
    AppState.addEventListener('change', this.onAppChange);
  }

  componentWillUnmount() {
    logEvents.logAppClose();
    AppState.removeEventListener('focus', this.onAppChange);
  }

  appState = AppState.currentState;
  onAppChange = (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      logEvents.logAppVisit();
    } else {
      logEvents.logAppClose();
    }
    this.appState = nextAppState;
  };

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="tabs" headerMode="none">
          <Stack.Screen name="tabs" component={Tabs} />
          <Stack.Screen
            name="question"
            options={{animationEnabled: Platform.OS === 'ios'}}>
            {({navigation, route}) => (
              <SurveyScreen navigation={navigation} route={route} />
            )}
          </Stack.Screen>
          <Stack.Screen name="symptoms">
            {(props) => <SymptomScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="add-symptom">
            {(props) => <AddSymptomScreen {...props} />}
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
          <Stack.Screen name="supported" component={Supported} />
          <Stack.Screen name="cgu" component={CGU} />
          <Stack.Screen name="privacy" component={Privacy} />
          <Stack.Screen name="legal-mentions" component={LegalMentions} />
          <Stack.Screen name="drugs" component={Drugs} />
          <Stack.Screen name="drugs-list" component={DrugsList} />
          {/* <Stack.Screen name="contribute" component={Contribute} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Router;
