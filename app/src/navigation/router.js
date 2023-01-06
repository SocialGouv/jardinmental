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
import { AppState, Platform, Linking } from "react-native";
import Notes from "../scenes/survey/notes-screen";
import Onboarding from "../scenes/onboarding";
import Supported from "../scenes/onboarding/onboardingSupported";
import OnboardingSymptoms1 from "../scenes/onboarding/onboardingSymptoms";
import OnboardingSymptoms2 from "../scenes/onboarding/onboardingSymptoms/objectifs.js";
import OnboardingSymptomsRecap from "../scenes/onboarding/onboardingSymptoms/recap.js";
import OnboardingExplanationScreen0 from "../scenes/onboarding/onboardingExplanation/screen0";
import OnboardingExplanationScreen1 from "../scenes/onboarding/onboardingExplanation/screen1";
import onboardingSymptomsStart from "../scenes/onboarding/onboardingSymptomsStart";
import OnboardingSymptomsCustom from "../scenes/onboarding/onboardingSymptomsCustom";
import OnboardingDrugs from "../scenes/onboarding/onboardingDrugs";
import OnboardingDrugsInformation from "../scenes/onboarding/onboardingDrugs/drugs-information";
import OnboardingDrugsList from "../scenes/onboarding/onboardingDrugs/list";
import OnboardingExplanation from "../scenes/onboarding/onboardingExplanation";
import OnboardingHint from "../scenes/onboarding/onboardingHint";
import OnboardingFelicitation from "../scenes/onboarding/onboardingFelicitation";
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
import NotificationService from "../services/notifications";
import Indicateurs from "../scenes/indicateurs";
import { OnboardingMood } from "../scenes/onboarding/onboardingSymptomsStart/MoodScreen";
import { OnboardingSleep } from "../scenes/onboarding/onboardingSymptomsStart/SleepScreen";
import { OnboardingSimpleCustomSymptoms } from "../scenes/onboarding/onboardingSymptomsCustom/SimpleCustomScreen";
import { OnboardingGoals } from "../scenes/onboarding/onboardingGoals/goals";
import { GoalsSettings } from "../scenes/goals/settings/GoalsSettings";
import { GoalsAddOptions } from "../scenes/goals/settings/GoalsAddOptions";
import { GoalsCreateForm } from "../scenes/goals/settings/GoalsCreateForm";
import { GoalDaySelector } from "../scenes/goals/settings/GoalDaySelector";
import { GoalConfig } from "../scenes/goals/settings/GoalConfig";
import { IndicatorsSettingsMore } from "../scenes/indicateurs/settings/IndicatorsSettingsMore";
import { GoalsSettingsMore } from "../scenes/goals/settings/GoalsSettingsMore";
import EditIndicateurs from "../scenes/indicateurs/editIndicateurs";
import CreateIndicator from "../scenes/indicateurs/CreateIndicator";
import ChooseIndicatorType from "../scenes/indicateurs/CreateIndicator/ChooseIndicatorType";
import ChooseIndicatorOrder from "../scenes/indicateurs/CreateIndicator/ChooseIndicatorOrder";

const Stack = createStackNavigator();

const linking = {
  prefixes: ["jardinmental://"],
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Check if there is an initial notification
    const notification = NotificationService.popInitialNotification();

    // Get deep link from data
    // if this is undefined, the app will open the default/home page
    return notification?.data?.link;
  },
  subscribe(listener) {
    /// Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      listener(url);
    });

    const unsubscribeNotificationService = NotificationService.subscribe((notification) => {
      if (notification?.data?.link) listener(notification.data.link);
    });

    return () => {
      // Clean up the event listeners
      linkingSubscription.remove();
      unsubscribeNotificationService();
    };
  },
};
class Router extends React.Component {
  async componentDidMount() {
    //await logEvents.initMatomo();
    logEvents.logAppVisit();
    RNBootsplash.hide({ fade: true });
    NotificationService.init();
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
        <NavigationContainer
          ref={(r) => (this.navigationRef = r)}
          onStateChange={this.onStateChange}
          linking={linking}
        >
          <Stack.Navigator initialRouteName="tabs" headerMode="none">
            <Stack.Screen name="day-survey" component={DaySurveyScreen} />
            <Stack.Screen name="select-day" component={SelectDayScreen} />
            <Stack.Screen name="tabs" component={Tabs} />
            <Stack.Screen name="symptoms" component={Indicateurs} />
            <Stack.Screen name="reminder" component={Reminder} />
            <Stack.Screen name="export" component={Export} />
            <Stack.Screen name="chart-day" component={DailyChart} />
            <Stack.Screen name="notes" options={{ animationEnabled: Platform.OS === "ios" }}>
              {({ navigation, route }) => <Notes navigation={navigation} route={route} />}
            </Stack.Screen>
            <Stack.Screen name="onboarding" component={Onboarding} />
            <Stack.Screen name="onboarding-symptoms-1" component={OnboardingSymptoms1} />
            <Stack.Screen name="onboarding-symptoms-2" component={OnboardingSymptoms2} />
            <Stack.Screen name="onboarding-symptoms-recap" component={OnboardingSymptomsRecap} />
            <Stack.Screen
              name="onboarding-explanation-indicator-1"
              component={OnboardingExplanationScreen1}
            />
            <Stack.Screen name="onboarding-symptoms-mood" component={OnboardingMood} />
            <Stack.Screen name="onboarding-symptoms-sleep" component={OnboardingSleep} />
            <Stack.Screen
              name="onboarding-symptoms-custom-simple"
              component={OnboardingSimpleCustomSymptoms}
            />
            <Stack.Screen name="onboarding-symptoms-start" component={onboardingSymptomsStart} />
            <Stack.Screen name="onboarding-symptoms-custom" component={OnboardingSymptomsCustom} />
            <Stack.Screen name="EDIT_INDICATOR" component={EditIndicateurs} />
            <Stack.Screen name="CREATE_INDICATOR" component={CreateIndicator} />
            <Stack.Screen name="CHOOSE_INDICATOR_TYPE" component={ChooseIndicatorType} />
            <Stack.Screen name="CHOOSE_INDICATOR_ORDER" component={ChooseIndicatorOrder} />
            <Stack.Screen name="onboarding-goals" component={OnboardingGoals} />
            <Stack.Screen name="onboarding-drugs" component={OnboardingDrugs} />
            <Stack.Screen name="onboarding-drugs-information" component={OnboardingDrugsInformation} />
            <Stack.Screen name="onboarding-drugs-list" component={OnboardingDrugsList} />
            <Stack.Screen name="onboarding-explanation-details" component={OnboardingExplanation} />
            <Stack.Screen name="onboarding-hint" component={OnboardingHint} />
            <Stack.Screen name="onboarding-felicitation" component={OnboardingFelicitation} />
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

            <Stack.Screen name="indicators-settings-more" component={IndicatorsSettingsMore} />

            <Stack.Screen name="goals-settings" component={GoalsSettings} />
            <Stack.Screen name="goals-settings-more" component={GoalsSettingsMore} />
            <Stack.Screen name="goals-add-options" component={GoalsAddOptions} />
            <Stack.Screen name="goals-create-form" component={GoalsCreateForm} />
            <Stack.Screen name="goal-day-selector" component={GoalDaySelector} />
            <Stack.Screen name="goal-config" component={GoalConfig} />
          </Stack.Navigator>
        </NavigationContainer>
        <EnvironmentIndicator />
      </>
    );
  }
}

export default Router;
