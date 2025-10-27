import React from "react";
import Tabs from "./tabs";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import EnvironmentIndicator from "../services/EnvironmentIndicator";
import SurveyNavigator from "../scenes/survey-v2/SurveyNavigator";
import SelectDayScreen from "../scenes/survey/selectDay";
import Reminder from "../scenes/reminder";
import Export from "../scenes/export/export";
import DataExportImport from "../scenes/data-export-import/DataExportImport";
import DailyChart from "../scenes/variation/daily-chart";
import { AppState, Platform, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import Notes from "../scenes/survey/notes-screen";
import CGU from "../scenes/legal/cgu-screen";
import Privacy from "../scenes/legal/privacy-screen";
import LegalMentions from "../scenes/legal/legal-mentions-screen";
import logEvents from "../services/logEvents";
import ContributePro from "../scenes/contribute/contributePro";
import DrugsSurvey from "../scenes/drugs/drugs-survey";
import DrugsManagement from "../scenes/drugs/drugs-management";
import DrugsList from "../scenes/drugs/drugs-list";
import TooLate from "../scenes/status/too-late";
import News from "../scenes/news";
import ActivateBeck from "../scenes/beck/activate";
import ViewBeck from "../scenes/beck/view";
import Beck from "../scenes/beck";
import Infos from "../scenes/infos";
import PrivacyLight from "../scenes/privacy-light";
import NotificationService from "../services/notifications";
import Indicateurs from "../scenes/indicateurs";
import Presentation from "../scenes/presentation";
import { GoalsSettings } from "../scenes/goals/settings/GoalsSettings";
import { GoalsAddOptions } from "../scenes/goals/settings/GoalsAddOptions";
import { GoalsCreateForm } from "../scenes/goals/settings/GoalsCreateForm";
import { GoalDaySelector } from "../scenes/goals/settings/GoalDaySelector";
import { GoalConfig } from "../scenes/goals/settings/GoalConfig";
import IndicatorsSettingsMore from "../scenes/indicateurs/settings/IndicatorsSettingsMore";
import { GoalsSettingsMore } from "../scenes/goals/settings/GoalsSettingsMore";
import EditIndicateurs from "../scenes/indicateurs/editIndicateurs";
import CreateIndicator from "../scenes/indicateurs/CreateIndicator";
import ChooseIndicatorType from "../scenes/indicateurs/CreateIndicator/ChooseIndicatorType";
import ChooseIndicatorOrder from "../scenes/indicateurs/CreateIndicator/ChooseIndicatorOrder";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import DevMode from "../scenes/dev-mode";
import { colors } from "../utils/colors";
import OnboardingV2 from "../scenes/onboarding-v2";
import CheckListScreen from "@/scenes/checklist/CheckListScreen";
import { StatusBarProvider, useStatusBarInternal } from "../context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import SurveyV1 from "../scenes/survey/daySurvey";
import SurveySuccessScreen from "../scenes/survey/SurveySuccessScreen";
import FaqMainScreen from "@/scenes/faq/FaqMainScreen";
import FaqDetailScreen from "@/scenes/faq/FaqDetailScreen";
import ResourceArticle from "../scenes/resources/ResourceArticle";
import ResourceCategoryList from "../scenes/resources/ResourceCategoryList";
import ExternalResourcesScreen from "../scenes/resources/ExternalResourcesScreen";
import SupportScreen from "@/scenes/support/SupportScreen";
import DiaryDetail from "@/scenes/status/DiaryDetail";

const Stack = createStackNavigator();

const linking = {
  prefixes: ["jardinmental://"],
  async getInitialURL(): Promise<string | null | undefined> {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }
    return null;
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

// Add this before the Router class
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// StatusBar wrapper component that uses the context
const StatusBarWrapper = () => {
  const { backgroundColor } = useStatusBarInternal();

  return <StatusBar animated={true} backgroundColor={backgroundColor} />;
};

interface RouterProps {
  statusBarContext: any;
}

class Router extends React.Component<RouterProps> {
  navigationRef: any;
  appListener: any;
  cleanupNotifications: any;
  prevCurrentRouteName: string;
  statusBarContext: any;

  constructor(props: RouterProps) {
    super(props);
    this.statusBarContext = props.statusBarContext;
  }

  state = {
    backgroundColor: colors.LIGHT_BLUE,
  };

  handleNotificationNavigation = (notification: any) => {
    const data = notification.request.content.data;
    const title = notification.request.content.title;

    // If a link exists in data, use it (for future compatibility)
    if (data?.link) {
      this.navigationRef?.navigate(data.link);
    }
    // Otherwise, detect by title for "Main" and "Goal" notifications
    else if (title === "Comment allez-vous aujourd'hui ?" || title === "Vous avez un objectif aujourd'hui 🎯") {
      this.navigationRef?.navigate("day-survey");
    }
  };

  async componentDidMount() {
    //await logEvents.initMatomo();
    logEvents.logAppVisit();
    try {
      // Get or generate device ID
      let deviceId = await AsyncStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = uuid.v4();
        await AsyncStorage.setItem("deviceId", deviceId);
      }

      // Check if app was opened from a notification (when app was completely closed)
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        // Wait a bit for navigation to be ready
        setTimeout(() => {
          this.handleNotificationNavigation(response.notification);
        }, 100);
      }

      // Setup notification handler for when app is already open
      const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
        this.handleNotificationNavigation(response.notification);
      });

      this.cleanupNotifications = () => {
        notificationListener.remove();
        responseListener.remove();
      };
    } catch (error) {
      console.log("Error setting up notifications:", error);
    }

    this.appListener = AppState.addEventListener("change", this.onAppChange);
  }

  componentWillUnmount() {
    logEvents.logAppClose();
    this.appListener?.remove();
    // Clean up notification listeners
    this.cleanupNotifications?.();
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
        <NavigationContainer ref={(r) => (this.navigationRef = r)} onStateChange={this.onStateChange} linking={linking}>
          <Stack.Navigator
            initialRouteName="tabs"
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          >
            <Stack.Screen name="presentation" component={Presentation} />
            <Stack.Screen name="faq" component={FaqMainScreen} />
            <Stack.Screen name="faq-detail" component={FaqDetailScreen} />
            <Stack.Screen name="day-survey" component={SurveyV1} />
            <Stack.Screen name="day-survey-v2" component={SurveyNavigator} />
            <Stack.Screen name="survey-success" component={SurveySuccessScreen} />
            <Stack.Screen name="select-day" component={SelectDayScreen} />
            <Stack.Screen name="tabs" component={Tabs} />
            <Stack.Screen name="symptoms" component={Indicateurs} />
            <Stack.Screen name="reminder" component={Reminder} />
            <Stack.Screen name="export" component={Export} />
            <Stack.Screen name="data-export-import" component={DataExportImport} />
            <Stack.Screen name="chart-day" component={DailyChart} />
            <Stack.Screen name="day-survey-detail" component={DiaryDetail} />
            <Stack.Screen name="notes" options={{ animationEnabled: Platform.OS === "ios" }}>
              {({ navigation, route }) => <Notes navigation={navigation} route={route} />}
            </Stack.Screen>
            <Stack.Screen name="onboarding" component={OnboardingV2} />
            <Stack.Screen name="checklist" component={CheckListScreen} />
            <Stack.Screen name="EDIT_INDICATOR" component={EditIndicateurs} />
            <Stack.Screen name="CREATE_INDICATOR" component={CreateIndicator} />
            <Stack.Screen name="CHOOSE_INDICATOR_TYPE" component={ChooseIndicatorType} />
            <Stack.Screen name="CHOOSE_INDICATOR_ORDER" component={ChooseIndicatorOrder} />
            <Stack.Screen name="support" component={SupportScreen} />
            <Stack.Screen name="cgu" component={CGU} />
            <Stack.Screen name="privacy" component={Privacy} />
            <Stack.Screen name="legal-mentions" component={LegalMentions} />
            <Stack.Screen name="drugs-survey" component={DrugsSurvey} />
            <Stack.Screen name="drugs-management" component={DrugsManagement} />
            <Stack.Screen name="drugs-list" component={DrugsList} />
            <Stack.Screen name="too-late" component={TooLate} />
            <Stack.Screen name="news" component={News} />
            <Stack.Screen name="infos" component={Infos} />
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
            <Stack.Screen name="resource-category-list" component={ResourceCategoryList} />
            <Stack.Screen name="resource-article" component={ResourceArticle} />
            <Stack.Screen name="resource-external-resources" component={ExternalResourcesScreen} />
            <Stack.Screen name="dev-mode" component={DevMode} options={{ headerShown: true }} />
          </Stack.Navigator>
        </NavigationContainer>
        <EnvironmentIndicator />
        <StatusBarWrapper />
      </>
    );
  }
}

// Wrapper component that provides StatusBar context to Router
const RouterWithStatusBar = () => {
  return (
    <StatusBarProvider>
      <RouterWithContext />
    </StatusBarProvider>
  );
};

// Router component that receives the context
const RouterWithContext = () => {
  const statusBarContext = useStatusBarInternal();

  return <Router statusBarContext={statusBarContext} />;
};

export default RouterWithStatusBar;
