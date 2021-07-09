import React from 'react';
import Tabs from './tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SurveyScreen from '../scenes/survey/survey-screen';
import SymptomScreen from '../scenes/symptoms/symptoms-screen';
import AddSymptomScreen from '../scenes/symptoms/add-symptom-screen';
import Reminder from '../scenes/reminder/reminder';
import Export from '../scenes/export/export';
import DailyChart from '../scenes/calendar/daily-chart';
import {AppState, Platform} from 'react-native';
import Notes from '../scenes/survey/notes-screen';
import Onboarding from '../scenes/onboarding/onboarding';
import Supported from '../scenes/supported/supported';
import CGU from '../scenes/legal/cgu-screen';
import Privacy from '../scenes/legal/privacy-screen';
import LegalMentions from '../scenes/legal/legal-mentions-screen';
import logEvents from '../services/logEvents';
import ContributePro from '../scenes/contribute/contributePro';
import Drugs from '../scenes/drugs/drugs';
import DrugsList from '../scenes/drugs/list';
import AddDrug from '../scenes/drugs/add-drug';
import TooLate from '../scenes/diary/too-late';
import News from '../scenes/news';
import Infos from '../scenes/infos';
import ActivateBeck from '../scenes/beck/activate';
import ViewBeck from '../scenes/beck/view';
import Beck from '../scenes/beck';

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
          <Stack.Screen name="add-drug" component={AddDrug} />
          <Stack.Screen name="too-late" component={TooLate} />
          <Stack.Screen name="news" component={News} />
          <Stack.Screen name="infos" component={Infos} />
          <Stack.Screen name="contribute-pro" component={ContributePro} />
          <Stack.Screen name="activate-beck" component={ActivateBeck} />
          <Stack.Screen name="view-beck" component={ViewBeck} />
          <Stack.Screen name="beck" component={Beck} />
          {/* <Stack.Screen name="contribute" component={Contribute} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Router;
