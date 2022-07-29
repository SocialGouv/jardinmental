import React from "react";
import Tabs from "./tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import EnvironmentIndicator from "../services/EnvironmentIndicator";
import DaySurveyScreen from "../scenes/survey/daySurvey";
import SelectDayScreen from "../scenes/survey/selectDay";
import Reminder from "../scenes/reminder";
import Export from "../scenes/export/export";
import DailyChart from "../scenes/calendar/daily-chart";
import { AppState, Platform } from "react-native";
import Notes from "../scenes/survey/notes-screen";
import Onboarding from "../scenes/onboarding";
import Supported from "../scenes/onboarding/onboardingSupported";
import OnboardingSymptoms from "../scenes/onboarding/onboardingSymptoms";
import OnboardingExplanationScreen0 from "../scenes/onboarding/onboardingExplanation/screen0";
import OnboardingExplanationScreen1 from "../scenes/onboarding/onboardingExplanation/screen1";
import onboardingSymptomsStart from "../scenes/onboarding/onboardingSymptomsStart";
import OnboardingSymptomsCustom from "../scenes/onboarding/onboardingSymptomsCustom";
import OnboardingDrugs from "../scenes/onboarding/onboardingDrugs";
import OnboardingDrugsInformation from "../scenes/onboarding/onboardingDrugs/drugs-information";
import OnboardingDrugsList from "../scenes/onboarding/onboardingDrugs/list";
import OnboardingExplanation from "../scenes/onboarding/onboardingExplanation";
import OnboardingHint from "../scenes/onboarding/onboardingHint";
import CGU from "../scenes/legal/cgu-screen";
import Privacy from "../scenes/legal/privacy-screen";
import LegalMentions from "../scenes/legal/legal-mentions-screen";
import logEvents from "../services/logEvents";
import ContributePro from "../scenes/contribute/contributePro";
import Drugs from "../scenes/drugs/drugs";
import DrugsList from "../scenes/drugs/list";
import TooLate from "../scenes/status/too-late";
import News from "../scenes/news";
import ActivateBeck from "../scenes/beck/activate";
import ViewBeck from "../scenes/beck/view";
import Beck from "../scenes/beck";
import Infos from "../scenes/infos";
import Contact from "../scenes/contact";
import PrivacyLight from "../scenes/privacy-light";
import RNBootsplash from "react-native-bootsplash";
import Notifications from "../services/notifications";

const Stack = createStackNavigator();

class Router extends React.Component {
  async componentDidMount() {
    await logEvents.initMatomo();
    logEvents.logAppVisit();
    RNBootsplash.hide({ fade: true });
    Notifications.init();
    this.appListener = AppState.addEventListener("change", this.onAppChange);
  }

  componentWillUnmount() {
    logEvents.logAppClose();
    this.appListener?.remove();
  }

  appState = AppState.currentState;
  onAppChange = (nextAppState) => {
    if (this.appState.match(/inactive|background/) && nextAppState === "active") {
      logEvents.logAppVisit();
    } else {
      logEvents.logAppClose();
    }
    this.appState = nextAppState;
  };

  onStateChange = async () => {
    if (!this.navigationRef) return;
    const route = this.navigationRef.getCurrentRoute();
    if (route.name === this.prevCurrentRouteName) return;
    this.prevCurrentRouteName = route.name;
    logEvents.logOpenPage(route.name);
  };

  render() {
    return (
      <>
        <NavigationContainer ref={(r) => (this.navigationRef = r)} onStateChange={this.onStateChange}>
          <Stack.Navigator initialRouteName="onboarding-symptoms-start" headerMode="none">
            <Stack.Screen name="day-survey" component={DaySurveyScreen} />
            <Stack.Screen name="select-day" component={SelectDayScreen} />
            <Stack.Screen name="tabs" component={Tabs} />
            {/* <Stack.Screen
            name="question"
            options={{animationEnabled: Platform.OS === 'ios'}}>
            {({navigation, route}) => (
              <SurveyScreen navigation={navigation} route={route} />
            )}
          </Stack.Screen> */}
            <Stack.Screen name="symptoms">
              {(props) => <OnboardingSymptomsCustom settings={true} {...props} />}
            </Stack.Screen>
            <Stack.Screen name="reminder" component={Reminder} />
            <Stack.Screen name="export" component={Export} />
            <Stack.Screen name="chart-day" component={DailyChart} />
            <Stack.Screen name="notes" options={{ animationEnabled: Platform.OS === "ios" }}>
              {({ navigation, route }) => <Notes navigation={navigation} route={route} />}
            </Stack.Screen>
            <Stack.Screen name="onboarding" component={Onboarding} />
            <Stack.Screen name="onboarding-symptoms" component={OnboardingSymptoms} />
            <Stack.Screen name="onboarding-explanation-screen-0" component={OnboardingExplanationScreen0} />
            <Stack.Screen name="onboarding-explanation-screen-1" component={OnboardingExplanationScreen1} />
            <Stack.Screen name="onboarding-symptoms-start" component={onboardingSymptomsStart} />
            <Stack.Screen name="onboarding-symptoms-custom" component={OnboardingSymptomsCustom} />
            <Stack.Screen name="onboarding-drugs" component={OnboardingDrugs} />
            <Stack.Screen name="onboarding-drugs-information" component={OnboardingDrugsInformation} />
            <Stack.Screen name="onboarding-drugs-list" component={OnboardingDrugsList} />
            <Stack.Screen name="onboarding-explanation" component={OnboardingExplanation} />
            <Stack.Screen name="onboarding-hint" component={OnboardingHint} />
            <Stack.Screen name="supported" component={Supported} />
            <Stack.Screen name="cgu" component={CGU} />
            <Stack.Screen name="privacy" component={Privacy} />
            <Stack.Screen name="legal-mentions" component={LegalMentions} />
            <Stack.Screen name="drugs" component={Drugs} />
            <Stack.Screen name="drugs-list" component={DrugsList} />
            <Stack.Screen name="too-late" component={TooLate} />
            <Stack.Screen name="news" component={News} />
            <Stack.Screen name="infos" component={Infos} />
            <Stack.Screen name="contact" component={Contact} />
            <Stack.Screen name="privacy-light" component={PrivacyLight} />
            <Stack.Screen name="contribute-pro" component={ContributePro} />
            <Stack.Screen name="activate-beck" component={ActivateBeck} />
            <Stack.Screen name="view-beck" component={ViewBeck} />
            <Stack.Screen name="beck" component={Beck} />
            {/* <Stack.Screen name="contribute" component={Contribute} /> */}
          </Stack.Navigator>
        </NavigationContainer>
        <EnvironmentIndicator />
      </>
    );
  }
}

export default Router;
