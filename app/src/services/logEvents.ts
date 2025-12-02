import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";
import Matomo from "./matomo";
import { MATOMO_DIMENSION, STORAGE_KEY_SUPPORTED } from "../utils/constants";
import api from "./api";

const CONSTANTS = {
  STORE_KEY_USER_ID: "STORE_KEY_USER_ID",
  STORE_KEY_NUMBER_OF_VISITS: "STORE_KEY_NUMBER_OF_VISITS",
};

const initMatomo = async () => {
  let userId = await AsyncStorage.getItem(CONSTANTS.STORE_KEY_USER_ID);
  if (!userId) {
    userId = Matomo.makeid();
    await AsyncStorage.setItem(CONSTANTS.STORE_KEY_USER_ID, userId);
  }

  const previousVisits = await AsyncStorage.getItem(CONSTANTS.STORE_KEY_NUMBER_OF_VISITS);
  const newVisits = previousVisits ? Number(previousVisits) + 1 : 1;
  await AsyncStorage.setItem(CONSTANTS.STORE_KEY_NUMBER_OF_VISITS, `${newVisits}`);

  Matomo.init({
    baseUrl: "https://matomo.fabrique.social.gouv.fr/piwik.php",
    idsite: 37,
    userId,
    _idvc: newVisits,
  });

  let supported = await AsyncStorage.getItem(STORAGE_KEY_SUPPORTED);

  Matomo.setDimensions({
    [MATOMO_DIMENSION.VERSION]: DeviceInfo.getVersion(),
    [MATOMO_DIMENSION.SYSTEM]: Platform.OS,
    [MATOMO_DIMENSION.SUPPORTED]: supported ? supported : "",
  });
};

const checkNetwork = async () => {
  const networkState = await NetInfo.fetch();
  return networkState.isConnected;
};

const logEvent = async ({
  category,
  action,
  name,
  value,
}: {
  category:
    | "DAILY_QUESTIONNAIRE"
    | "FAQ"
    | "ONBOARDING"
    | "APP"
    | "FEELING"
    | "PARAMETERS"
    | "SYMPTOM"
    | "CUSTOM_SYMPTOM"
    | "CALENDAR"
    | "INFOS"
    | "CONTACT"
    | "DATA_EXPORT"
    | "DATA_EXPORT_AS_BACKUP"
    | "DATA_IMPORT_BACKUP"
    | "NPS"
    | "SUPPORTED"
    | "EXPLANATION"
    | "DRUG"
    | "BECK"
    | "DIARY"
    | "OPEN_SUB_TAB_STATUS"
    | "ANALYSES"
    | "SUIVI"
    | "RECOMMEND"
    | "PUSH_NOTIFICATION_TOKEN_REGISTER"
    | "PUSH_NOTIFICATION_RECEIVE"
    | "ANALYSIS"
    | "RESOURCES"
    | "OBJECTIVES"
    | "EMERGENCY"
    | "INDICATORS"
    | "REMINDER"
    | "SUMMARY";
  action: string;
  name?: string;
  value?: number;
}) => {
  if (!Matomo.initDone) await initMatomo();
  try {
    const canSend = await checkNetwork();
    if (!canSend) {
      throw new Error("no network");
    }
    Matomo.logEvent({ category, action, name, value });
    api.post({
      path: "/event",
      body: {
        event: { category, action, name, value },
        userId: Matomo.userId,
        userProperties: Matomo.userProperties,
        dimensions: Matomo.dimensions,
      },
    });
  } catch (error) {
    console.log("logEvent error", error);
    console.log("logEvent error", { category, action, name, value });
  }
};

const getUserId = () => Matomo.userId;

/*
APP VISIT

*/

const APP = "APP";
const APP_OPEN = "APP_OPEN";
const APP_CLOSE = "APP_CLOSE";

const logAppVisit = async () => {
  await logEvent({
    category: APP,
    action: APP_OPEN,
  });
};

const logAppClose = async () => {
  await logEvent({
    category: APP,
    action: APP_CLOSE,
  });
};

const ONBOARDING = "ONBOARDING";
const NEXT_CLICK = "NEXT_CLICK";

const logOnboardingSwipe = async (page) => {
  await logEvent({
    category: ONBOARDING,
    action: NEXT_CLICK,
    name: "page",
    value: page,
  });
};

const FEELING = "FEELING";
const FEELING_START = "FEELING_START";
const FEELING_DATE_CHOOSE = "FEELING_DATE_CHOOSE";
const FEELING_ADD = "FEELING_ADD";
const FEELING_ADD_SURVEY = "FEELING_ADD_SURVEY";
const FEELING_START_YESTERDAY = "FEELING_START_YESTERDAY";
const FEELING_START_FLOATING_PlUS = "FEELING_START_FLOATING_PLUS";
const FEELING_START_FROM_RECAP = "FEELING_START_FROM_RECAP";
const FEELING_ADD_LIST = "FEELING_ADD_LIST";
const FEELING_ADD_LIST_COMPLETED = "FEELING_ADD_LIST_COMPLETED";

const _deprecatedLogFeelingStart = async () => {
  await logEvent({
    category: FEELING,
    action: FEELING_START,
  });
};

const _deprecatedLogFeelingStartFloatingPlus = async () => {
  await logEvent({
    category: FEELING,
    action: FEELING_START_FLOATING_PlUS,
  });
};

const _deprecatedLogFeelingStartFromRecap = async (offset) => {
  await logEvent({
    category: FEELING,
    action: FEELING_START_FROM_RECAP,
    name: "offset",
    value: offset,
  });
};

const logFeelingDateChoose = async (date) => {
  await logEvent({
    category: FEELING,
    action: FEELING_DATE_CHOOSE,
    name: date,
  });
};

const logFeelingStartYesterday = async (v) => {
  await logEvent({
    category: FEELING,
    action: FEELING_START_YESTERDAY,
    name: v,
  });
};

const _deprecatedLogFeelingAdd = async () => {
  await logEvent({
    category: FEELING,
    action: FEELING_ADD,
  });
};

const _deprecatedLogFeelingSubmitSurvey = async (value) => {
  await logEvent({
    category: FEELING,
    action: FEELING_ADD_SURVEY,
    name: "indicateur",
    value,
  });
};

const _deprecatedLogFeelingAddComment = async (value) => {
  await logEvent({
    category: FEELING,
    action: "FEELING_ADD_COMMENT",
    name: "comment",
    value,
  });
};
const _deprecatedLogFeelingAddContext = async (value) => {
  await logEvent({
    category: FEELING,
    action: "FEELING_ADD_CONTEXT",
    name: "context",
    value,
  });
};
const _deprecatedLogFeelingResponseToxic = async (value) => {
  await logEvent({
    category: FEELING,
    action: "FEELING_RESPONSE_TOXIC",
    name: "toxic",
    value,
  });
};

const _deprecatedLogFeelingEditButtonClick = async () => {
  await logEvent({
    category: FEELING,
    action: "FEELING_EDIT_BUTTON_CLICK",
  });
};

const _deprecatedLogFeelingAddList = async (value) => {
  await logEvent({
    category: FEELING,
    action: FEELING_ADD_LIST,
    name: "indicateur",
    value,
  });
};

const _deprecatedLogFeelingAddListCompleted = async (value) => {
  await logEvent({
    category: FEELING,
    action: FEELING_ADD_LIST_COMPLETED,
    name: "indicateur",
    value,
  });
};

const PARAMETERS = "PARAMETERS";
const REMINDER_ADD = "REMINDER_ADD";
const REMINDER_CANCEL = "REMINDER_CANCEL";

const logReminderAdd = async () => {
  await logEvent({
    category: PARAMETERS,
    action: REMINDER_ADD,
  });
};

const logReminderCancel = async () => {
  await logEvent({
    category: PARAMETERS,
    action: REMINDER_CANCEL,
  });
};

const SYMPTOM = "SYMPTOM";
const SYMPTOM_SETTING_FROM_SURVEY = "SYMPTOM_SETTING_FROM_SURVEY";
const SYMPTOM_ADD = "SYMPTOM_ADD";
const SYMPTOM_CANCEL = "SYMPTOM_CANCEL";
const CUSTOM_SYMPTOM = "CUSTOM_SYMPTOM";
const CUSTOM_SYMPTOM_ADD = "CUSTOM_SYMPTOM_ADD";

const _deprecatedLogSettingsSymptomsFromSurvey = async () => {
  await logEvent({
    category: SYMPTOM,
    action: SYMPTOM_SETTING_FROM_SURVEY,
  });
};

const logSymptomAdd = async (symptom) => {
  await logEvent({
    category: SYMPTOM,
    action: SYMPTOM_ADD,
    name: "symptom",
    value: symptom,
  });
};

const logSymptomCancel = async (symptom) => {
  await logEvent({
    category: SYMPTOM,
    action: SYMPTOM_CANCEL,
    name: "symptom",
    value: symptom,
  });
};

const logCustomSymptomAdd = async () => {
  await logEvent({
    category: CUSTOM_SYMPTOM,
    action: CUSTOM_SYMPTOM_ADD,
  });
};

const logCalendarOpen = async () => {
  await logEvent({
    category: "CALENDAR",
    action: "CALENDAR_OPEN",
  });
};

const logInfosOpen = async () => {
  await logEvent({
    category: "INFOS",
    action: "INFOS_OPEN",
  });
};
const logContactOpen = async () => {
  await logEvent({
    category: "CONTACT",
    action: "CONTACT_OPEN",
  });
};

const logDataExportAsBackUp = async () => {
  await logEvent({
    category: "DATA_EXPORT_AS_BACKUP",
    action: "DATA_EXPORT_AS_BACKUP",
  });
};

const logDataImport = async () => {
  await logEvent({
    category: "DATA_IMPORT_BACKUP",
    action: "DATA_IMPORT_BACKUP",
  });
};

const logNPSOpen = async () => {
  await logEvent({
    category: "NPS",
    action: "OPEN_NPS",
  });
};

const _deprecatedLogNPSUsefulSend = async (value) => {
  await logEvent({
    category: "NPS",
    action: "NPS_SEND",
    name: "notes-useful",
    value,
  });
};

const _deprecatedLogNPSRecoSend = async (value) => {
  await logEvent({
    category: "NPS",
    action: "NPS_SEND",
    name: "notes-reco",
    value,
  });
};

const logNPSFormSent = async () => {
  await logEvent({
    category: "NPS",
    action: "SEND_NPS",
  });
};

const logProNPSSend = async () => {
  await logEvent({
    category: "NPS",
    action: "PRO_NPS_SEND",
  });
};

const logProNPSContactSend = async () => {
  await logEvent({
    category: "NPS",
    action: "PRO_NPS_CONTACT_SEND",
  });
};

const logSupportedSelect = async (supported) => {
  await logEvent({
    category: "SUPPORTED",
    action: "SUPPORTED_CHOOSE",
    name: supported,
  });
};

const logInfoClick = async (link) => {
  await logEvent({
    category: "INFOS",
    action: "INFOS_CLICK",
    name: link,
  });
};

const logOnboardingExplainOpen = async () => {
  await logEvent({
    category: "EXPLANATION",
    action: "EXPLANATION_OPEN",
  });
};
const logOnboardingExplainNext = async (p) => {
  await logEvent({
    category: "EXPLANATION",
    action: "EXPLANATION_NEXT",
    name: "page",
    value: p,
  });
};
const logOnboardingExplainStart = async () => {
  await logEvent({
    category: "EXPLANATION",
    action: "EXPLANATION_START",
  });
};

const logDrugsOpen = async () => {
  await logEvent({
    category: "DRUG",
    action: "DRUG_OPEN",
  });
};

const logTreatmentNotFound = async (value) => {
  await logEvent({
    category: "DRUG",
    action: "DRUG_NOT_FOUND",
    name: value,
  });
};

const logDrugAdd = async (drug) => {
  await logEvent({
    category: "DRUG",
    action: "DRUG_ADD",
    name: "drug",
    value: drug,
  });
};

const logAddDrug = async () => {
  await logEvent({
    category: "DRUG",
    action: "ADD_DRUG",
  });
};

const logStartEditDrug = async () => {
  await logEvent({
    category: "DRUG",
    action: "START_EDIT_DRUG",
  });
};

const logDeleteDrug = async () => {
  await logEvent({
    category: "DRUG",
    action: "DELETE_DRUG",
  });
};

const logToggleDrug = async (enabled: boolean) => {
  await logEvent({
    category: "DRUG",
    action: "TOGGLE_DRUG",
    name: "yes/no",
    value: enabled ? 1 : 0,
  });
};

const logOpenDrugSettings = async () => {
  await logEvent({
    category: "DRUG",
    action: "OPEN_DRUG_SETTINGS",
  });
};
const _legacyLogInputDrugSurvey = async (numberOfInput) => {
  await logEvent({
    category: "DRUG",
    action: "DRUG_INPUT_SURVEY",
    name: "numberOfInput",
    value: numberOfInput,
  });
};
const _legacyLogInputDrugSurveyPriseDeTraitement = async () => {
  await logEvent({
    category: "DRUG",
    action: "DRUG_INPUT_SURVEY_PRISE_DE_TRAITEMENT",
  });
};
const _legacyLogInputDrugSurveyPriseDeTraitementSiBesoin = async () => {
  await logEvent({
    category: "DRUG",
    action: "DRUG_INPUT_SURVEY_PRISE_DE_TRAITEMENT_SI_BESOIN",
  });
};

// beck
const _deprecatedLogActivateBeck = async (v) => {
  await logEvent({
    category: "BECK",
    action: "BECK_ACTIVATE",
    name: v,
  });
};
const logBeckAddCustomWhere = async (value) => {
  await logEvent({
    category: "BECK",
    action: "BECK_ADD_CUSTOM_ELEMENT_IN_WHERE_LIST",
    name: value,
  });
};
const logBeckAddCustomWho = async (value) => {
  await logEvent({
    category: "BECK",
    action: "BECK_ADD_CUSTOM_ELEMENT_IN_WHO_LIST",
    name: value,
  });
};
const logBeckAddCustomEmotion = async (value) => {
  await logEvent({
    category: "BECK",
    action: "BECK_ADD_CUSTOM_ELEMENT_IN_EMOTION_LIST",
    name: value,
  });
};
const logBeckAddCustomSensation = async (value) => {
  await logEvent({
    category: "BECK",
    action: "BECK_ADD_CUSTOM_ELEMENT_IN_SENSATION_LIST",
    name: value,
  });
};

const logBeckStepOpen = async (step) => {
  await logEvent({
    category: "BECK",
    action: "BECK_STEP_OPEN",
    name: step,
  });
};
const logBeckViewOpen = async () => {
  await logEvent({
    category: "BECK",
    action: "BECK_VIEW_OPEN",
  });
};
const logBeckEditClick = async () => {
  await logEvent({
    category: "BECK",
    action: "BECK_EDIT_CLICK",
  });
};

const logDeleteBeck = async () => {
  await logEvent({
    category: "BECK",
    action: "BECK_DELETE",
  });
};

const logAddNoteDiary = async () => {
  await logEvent({
    category: "DIARY",
    action: "DIARY_ADD_NOTE",
  });
};
const logEditNoteDiary = async () => {
  await logEvent({
    category: "DIARY",
    action: "DIARY_EDIT_NOTE",
  });
};
const logDeleteNoteDiary = async () => {
  await logEvent({
    category: "DIARY",
    action: "DIARY_DELETE_NOTE",
  });
};

const logOpenPage = async (screenName) => {
  const EVENT_FOR_SCREEN_NAME = {
    calendar: {
      action: "OPEN_ANALYSIS_MAIN",
      category: "ANALYSES",
    },
  };
  if (EVENT_FOR_SCREEN_NAME[screenName]) {
    await logEvent(EVENT_FOR_SCREEN_NAME[screenName]);
  }
};

const logStatusSubPage = async (tab) => {
  await logEvent({
    category: "OPEN_SUB_TAB_STATUS",
    action: `${tab.toUpperCase()}_OPEN`,
  });
};

// SUIVI
const logOpenPageSuivi = async (tab: "Frises" | "Statistiques" | "Courbes" | "Déclencheurs") => {
  const EVENTS_FOR_TAB = {
    Frises: "OPEN_ANALYSIS_TIMELINE",
    Statistiques: "OPEN_ANALYSIS_STATS",
    Courbes: "OPEN_ANALYSIS_GRAPHS",
    Déclencheurs: "OPEN_ANALYSIS_TRIGGERS",
  };
  await logEvent({
    action: EVENTS_FOR_TAB[tab],
    category: "ANALYSES",
  });
};

const logSuiviEditDateFrom = async (tab) => {
  await logEvent({
    category: "SUIVI",
    action: "EDIT_DATE_FROM",
  });
};

const logSuiviEditDateTo = async (tab) => {
  await logEvent({
    category: "SUIVI",
    action: "EDIT_DATE_TO",
  });
};

const logSuiviEditScoreFrise = async (score) => {
  await logEvent({
    category: "SUIVI",
    action: "EDIT_SCORE_FRISE",
    name: score,
  });
};

const logSuiviEditScoreEvents = async (score) => {
  await logEvent({
    category: "SUIVI",
    action: "EDIT_SCORE_EVENTS",
    name: score,
  });
};

const logSuiviEditSymptom = async () => {
  await logEvent({
    category: "SUIVI",
    action: "EDIT_SYMPTOM_EVENTS",
  });
};
const logSuiviShowDetailStatistics = async () => {
  await logEvent({
    category: "SUIVI",
    action: "SHOW_DETAIL_STATISTICS",
  });
};
const logSuiviShowLegendeInformationPriseDeTraitement = async (v) => {
  await logEvent({
    category: "SUIVI",
    action: "SHOW_INFORMATIONS_LEGENDE_PRISE_DE_TRAITEMENT",
    name: "affichage",
    value: v,
  });
};
const logSuiviShowPriseDeTraitement = async (v) => {
  await logEvent({
    category: "SUIVI",
    action: "SHOW_PRISE_DE_TRAITEMENT",
    name: "affichage",
    value: v,
  });
};

const logRecommendAppShow = async () => {
  await logEvent({
    category: "RECOMMEND",
    action: "SHOW_MODAL",
  });
};
const logRecommendAppSent = async () => {
  await logEvent({
    category: "RECOMMEND",
    action: "SENT",
  });
};
const logRecommendAppDismissed = async () => {
  await logEvent({
    category: "RECOMMEND",
    action: "DISMISSED",
  });
};
const logRecommendAppError = async () => {
  await logEvent({
    category: "RECOMMEND",
    action: "ERROR",
  });
};

const logPushNotifTokenRegisterSuccess = async () => {
  await logEvent({
    category: "PUSH_NOTIFICATION_TOKEN_REGISTER",
    action: "SUCCESS",
  });
};
const logPushNotifTokenRegisterError = async () => {
  await logEvent({
    category: "PUSH_NOTIFICATION_TOKEN_REGISTER",
    action: "ERROR",
  });
};
const logPushNotifReceiveClicked = async () => {
  await logEvent({
    category: "PUSH_NOTIFICATION_RECEIVE",
    action: "CLICKED",
  });
};

// ONBOARDING EVENT FUNCTIONS

// Constants for onboarding actions
const INTRO_OBD_NEXT = "INTRO_OBD_NEXT";
const CARROUSEL_OBD_NEXT = "CARROUSEL_OBD_NEXT";
const CARROUSEL_OBD_PASS = "CARROUSEL_OBD_PASS";
const HUMEUR_OBD_START = "HUMEUR_OBD_START";
const HUMEUR_OBD_SELECT = "HUMEUR_OBD_SELECT";
const HUMEUR_OBD_CONFIRM = "HUMEUR_OBD_CONFIRM";
const INDICATOR_OBD_START = "INDICATOR_OBD_START";
const INDICATOR_OBD_LVL1 = "INDICATOR_OBD_LVL1";
const INDICATOR_OBD_PASS = "INDICATOR_OBD_PASS";
const INDICATOR_OBD_LVL2 = "INDICATOR_OBD_LVL2";
const INDICATOR_OBD_VALIDATE = "INDICATOR_OBD_VALIDATE";
const QUEST_OBD_START = "QUEST_OBD_START";
const SLEEP_OBD_VALIDATE = "SLEEP_OBD_VALIDATE";
const QUEST_OBD_START2 = "QUEST_OBD_START2";
const QUEST_OBD_STEP = "QUEST_OBD_STEP";
const QUEST_OBD_CONGRATS = "QUEST_OBD_CONGRATS";
const REMINDER_OBD_EDIT = "REMINDER_OBD_EDIT";
const REMINDER_OBD = "REMINDER_OBD";
const BACK = "BACK";

// Intro onboarding functions
const logIntroObdNext = async () => {
  await logEvent({
    category: ONBOARDING,
    action: INTRO_OBD_NEXT,
  });
};

// Carrousel onboarding functions
const logCarrouselObdNext = async (slide) => {
  await logEvent({
    category: ONBOARDING,
    action: CARROUSEL_OBD_NEXT,
    name: "slide",
    value: slide,
  });
};

const logCarrouselObdPass = async (slide) => {
  await logEvent({
    category: ONBOARDING,
    action: CARROUSEL_OBD_PASS,
    name: "slide",
    value: slide,
  });
};

// Humeur (Mood) onboarding functions
const logHumeurObdStart = async () => {
  await logEvent({
    category: ONBOARDING,
    action: HUMEUR_OBD_START,
  });
};

const logHumeurObdSelect = async (mood) => {
  await logEvent({
    category: ONBOARDING,
    action: HUMEUR_OBD_SELECT,
    name: "mood",
    value: mood,
  });
};

const logHumeurObdConfirm = async (mood) => {
  await logEvent({
    category: ONBOARDING,
    action: HUMEUR_OBD_CONFIRM,
    name: "mood",
    value: mood,
  });
};

// Indicator onboarding functions
const logIndicatorObdStart = async () => {
  await logEvent({
    category: ONBOARDING,
    action: INDICATOR_OBD_START,
  });
};

const logIndicatorObdLvl1 = async (themes: number[]) => {
  for (let i = 0; i < themes.length; i++) {
    await logEvent({
      category: ONBOARDING,
      action: INDICATOR_OBD_LVL1,
      name: "themes",
      value: themes[i],
    });
  }
};

const logIndicatorObdPass = async (screen) => {
  await logEvent({
    category: ONBOARDING,
    action: INDICATOR_OBD_PASS,
    name: "screen",
    value: screen,
  });
};

const logIndicatorObdLvl2 = async (subThemes, count) => {
  for (let i = 0; i < subThemes.length; i++) {
    await logEvent({
      category: ONBOARDING,
      action: INDICATOR_OBD_LVL2,
      name: "sub_themes",
      value: subThemes[i],
    });
  }
};

const logIndicatorObdValidate = async (indicators: number[]) => {
  for (let i = 0; i < indicators.length; i++) {
    await logEvent({
      category: ONBOARDING,
      action: INDICATOR_OBD_VALIDATE,
      name: "indicators",
      value: indicators[i],
    });
  }
};

// Questionnaire onboarding functions
const logQuestObdStart = async () => {
  await logEvent({
    category: ONBOARDING,
    action: QUEST_OBD_START,
  });
};

const logSleepObdValidate = async () => {
  await logEvent({
    category: ONBOARDING,
    action: SLEEP_OBD_VALIDATE,
  });
};

const logQuestObdStart2 = async () => {
  await logEvent({
    category: ONBOARDING,
    action: QUEST_OBD_START2,
  });
};

// En attente de réponse de Pierre
const logQuestObdStep = async (theme, final) => {
  await logEvent({
    category: ONBOARDING,
    action: QUEST_OBD_STEP,
    name: "theme",
    value: theme,
  });
  // Also log the final parameter
  await logEvent({
    category: ONBOARDING,
    action: QUEST_OBD_STEP,
    name: "final",
    value: final,
  });
};

const logQuestObdCongrats = async () => {
  await logEvent({
    category: ONBOARDING,
    action: QUEST_OBD_CONGRATS,
  });
};

// Reminder onboarding functions
const logReminderObdEdit = async (time) => {
  await logEvent({
    category: ONBOARDING,
    action: REMINDER_OBD_EDIT,
    name: "time",
    value: time,
  });
};

const logReminderObd = async (notificationActivated: 0 | 1) => {
  await logEvent({
    category: ONBOARDING,
    action: REMINDER_OBD,
    name: "notification",
    value: notificationActivated,
  });
};

// Back navigation function
const logOnboardingBack = async (page) => {
  await logEvent({
    category: ONBOARDING,
    action: BACK,
    name: "page",
    value: page,
  });
};

// Survey success screen functions
const logHealthTipFeedbackUp = async (id) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "ASSESSED_MOTIVATIONNAL_FEEDBACK_1",
    name: "feedback_id",
    value: id,
  });
};

const logHealthTipFeedbackDown = async (id) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "ASSESSED_MOTIVATIONNAL_FEEDBACK_0",
    name: "feedback_id",
    value: id,
  });
};

const logOpenAnalysisMain = async () => {
  await logEvent({
    category: "ANALYSIS",
    action: "OPEN_ANALYSIS_MAIN",
  });
};

type DailyQuestionnaireOrigin =
  | "weekly_widget"
  | "how_do_you_feel_card"
  | "activity_feed"
  | "floating_button"
  | "no_data_screen"
  | "no_data_statistique"
  | "no_data_beck"
  | "how_do_you_feel_today_widget"
  | "no_data_frises";

const logOpenDailyQuestionnaire = async (origin: DailyQuestionnaireOrigin) => {
  const ID_FOR_ORIGIN: Record<DailyQuestionnaireOrigin, number> = {
    weekly_widget: 1,
    how_do_you_feel_card: 2,
    activity_feed: 3,
    floating_button: 4,
    no_data_screen: 5,
    no_data_statistique: 6,
    no_data_beck: 7,
    no_data_frises: 8,
    how_do_you_feel_today_widget: 9,
  };
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "OPEN_DAILY_QUESTIONNAIRE",
    name: "origin",
    value: ID_FOR_ORIGIN[origin],
  });
};

const logValidateDailyQuestionnaire = async () => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "VALIDATE_DAILY_QUESTIONNAIRE",
  });
};

const logIndicatorsDailyQuestionnaire = async (nbIndicators: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "INDICATORS_DAILY_QUESTIONNAIRE",
    name: "nb_indicators",
    value: nbIndicators,
  });
};

const logObjectivesDailyQuestionnaire = async (nbObjectives: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "OBJECTIVES_DAILY_QUESTIONNAIRE",
    name: "nb_objectives",
    value: nbObjectives,
  });
};

const logCompletionIndicatorsDailyQuestionnaire = async (completionRate: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "COMPLETION_INDICATORS_DAILY_QUESTIONNAIRE",
    name: "completion_rate",
    value: completionRate,
  });
};

const logCompletionObjectivesDailyQuestionnaire = async (completionRate: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "COMPLETION_OBJECTIVES_DAILY_QUESTIONNAIRE",
    name: "completion_rate",
    value: completionRate,
  });
};

const logTimeSpentDailyQuestionnaire = async (timeInSeconds: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "TIME_SPENT_DAILY_QUESTIONNAIRE",
    name: "duration_seconds",
    value: timeInSeconds,
  });
};

const logCompletionNotesDailyQuestionnaire = async (hasNotes: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "COMPLETION_NOTES_DAILY_QUESTIONNAIRE",
    name: "note_completed",
    value: hasNotes,
  });
};

const logCompletionDrugDailyQuestionnaire = async (drugCompleted: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "COMPLETION_DRUG_DAILY_QUESTIONNAIRE",
    name: "drug_completed",
    value: drugCompleted,
  });
};

const logDayDailyQuestionnaire = async (day: number) => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "DAY_DAILY_QUESTIONNAIRE",
    name: "day",
    value: day,
  });
};

const logNeedAssistanceFaq = async () => {
  await logEvent({
    category: "FAQ",
    action: "NEED_ASSISTANCE_FAQ",
  });
};

const logOpenFaqSection = async (id) => {
  await logEvent({
    category: "FAQ",
    action: "OPEN_FAQ_SECTION",
    name: "section_number",
    value: id,
  });
};

const logEditSurvey = async () => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "EDIT_SURVEY",
  });
};

const logDeleteIndicator = async () => {
  await logEvent({
    category: "DAILY_QUESTIONNAIRE",
    action: "DELETE_INDICATOR",
  });
};

const logResourceArticleSelected = async (matomoId: number) => {
  await logEvent({
    category: "RESOURCES",
    action: `SELECTED_ARTICLE_1/2`,
    name: "article_id",
    value: matomoId,
  });
};

const logResourceArticleSelectedPosition = async (article_position_list: number) => {
  await logEvent({
    category: "RESOURCES",
    action: `SELECTED_ARTICLE_2/2`,
    name: "article_position_list",
    value: article_position_list,
  });
};

const logResourceArticleTimeSpentId = async (matomoId: number) => {
  await logEvent({
    category: "RESOURCES",
    action: `TIME_SPENT_ARTICLE_1/2`,
    name: "article_id",
    value: matomoId,
  });
};

const logResourceArticleTimeSpentSeconds = async (timeSeconds: number) => {
  await logEvent({
    category: "RESOURCES",
    action: `TIME_SPENT_ARTICLE_2/2`,
    name: "time_seconds",
    value: timeSeconds,
  });
};

const logResourceOpenedExternalLink = async (externalUrlId: number) => {
  await logEvent({
    category: "RESOURCES",
    action: "OPENED_EXTERNAL_LINK",
    name: "external_url_id",
    value: externalUrlId,
  });
};

const logOpenedRessources = async () => {
  await logEvent({
    category: "RESOURCES",
    action: "OPENED_RESSOURCES",
  });
};

const logOpenFaq = async () => {
  await logEvent({
    category: "FAQ",
    action: "OPEN_FAQ",
  });
};

// EXPORT SUMMARY EVENTS
const logExportSummary = async () => {
  await logEvent({
    category: "SUMMARY",
    action: "EXPORT_SUMMARY",
  });
};

const logOpenExportSummary = async () => {
  await logEvent({
    category: "SUMMARY",
    action: "OPEN_EXPORT_SUMMARY",
  });
};

// REMINDER SETTINGS EVENTS
const logEditReminder = async () => {
  await logEvent({
    category: "REMINDER",
    action: "EDIT_REMINDER",
  });
};

const logOpenReminderSettings = async () => {
  await logEvent({
    category: "REMINDER",
    action: "OPEN_REMINDER_SETTINGS",
  });
};

// SETTINGS EVENTS
const logOpenSettings = async () => {
  await logEvent({
    category: "PARAMETERS",
    action: "OPEN_SETTINGS",
  });
};

// EMERGENCY PAGE EVENTS
const logClickMonSoutienPsy = async () => {
  await logEvent({
    category: "EMERGENCY",
    action: "CLICK_MON_SOUTIEN_PSY",
  });
};

const logClickSantePsyEtudiant = async () => {
  await logEvent({
    category: "EMERGENCY",
    action: "CLICK_SANTE_PSY_ETUDIANT",
  });
};

const logOpenCounsellingSection = async () => {
  await logEvent({
    category: "EMERGENCY",
    action: "OPEN_COUNSELLING_SECTION",
  });
};

const logOpenHelplinesSection = async () => {
  await logEvent({
    category: "EMERGENCY",
    action: "OPEN_HELPLINES_SECTION",
  });
};

const logCallHelpline = async (number: string) => {
  await logEvent({
    category: "EMERGENCY",
    action: "CALL_HELPLINE",
    name: "phone_number",
    value: parseInt(number, 10),
  });
};

const logOpenEmergencyContact = async () => {
  await logEvent({
    category: "EMERGENCY",
    action: "OPEN_EMERGENCY_CONTACT",
  });
};

// OBJECTIVES MANAGEMENT

const logAddObjectiveNative = async () => {
  await logEvent({
    category: "OBJECTIVES",
    action: "ADD_OBJECTIVE_NATIVE",
  });
};

const logAddObjectivePersonalized = async () => {
  await logEvent({
    category: "OBJECTIVES",
    action: "ADD_OBJECTIVE_PERSONALIZED",
  });
};

const logStartAddObjective = async () => {
  await logEvent({
    category: "OBJECTIVES",
    action: "START_ADD_OBJECTIVE",
  });
};

const logEditObjectiveReminder = async () => {
  await logEvent({
    category: "OBJECTIVES",
    action: "EDIT_OBJECTIVE_REMINDER",
  });
};

const logOpenObjectivesSettings = async () => {
  await logEvent({
    category: "OBJECTIVES",
    action: "OPEN_OBJECTIVES_SETTINGS",
  });
};

type CheckListItemType = "reminder" | "follow-up" | "goals" | "treatment";

const logClickCheckList = async (item: CheckListItemType) => {
  const CHECKLIST_ITEM_TYPE_TO_ID: Record<CheckListItemType, number> = {
    reminder: 1,
    "follow-up": 2,
    goals: 3,
    treatment: 4,
  };

  await logEvent({
    category: "ONBOARDING",
    action: "CLICK_CHECKLIST",
    name: "item",
    value: CHECKLIST_ITEM_TYPE_TO_ID[item],
  });
};

const logOpenChecklist = async () => {
  await logEvent({
    category: "ONBOARDING",
    action: "OPEN_CHECKLIST",
  });
};

const logPassChecklist = async () => {
  await logEvent({
    category: "ONBOARDING",
    action: "PASS_CHECKLIST",
  });
};

// INDICATORS EVENT FUNCTIONS
const logStartAddIndicator = async () => {
  await logEvent({
    category: "INDICATORS",
    action: "START_ADD_INDICATOR",
  });
};

const logAddIndicator = async (indicatorId: number) => {
  await logEvent({
    category: "INDICATORS",
    action: "ADD_INDICATOR",
    value: indicatorId,
    name: "indicator",
  });
};

const logAddIndicatorCategory = async (categoryId: number) => {
  await logEvent({
    category: "INDICATORS",
    action: "ADD_INDICATOR_CATEGORY",
    name: "category",
    value: categoryId,
  });
};

const logCreatePersonalizedIndicator = async (categoryId) => {
  await logEvent({
    category: "INDICATORS",
    action: "CREATE_PERSONNALIZED_INDICATOR",
    name: "category",
    value: categoryId,
  });
};

const logOpenIndicatorsSettings = async () => {
  await logEvent({
    category: "INDICATORS",
    action: "OPEN_INDICATORS_SETTINGS",
  });
};

const logViewedArticlesList = async (nbArticlesDisplayed: number) => {
  await logEvent({
    category: "RESOURCES",
    action: "VIEWED_ARTICLES_LIST",
    name: "nb_articles_displayed",
    value: nbArticlesDisplayed,
  });
};

const logSelectedCategory = async (categoryId: number) => {
  await logEvent({
    category: "RESOURCES",
    action: "SELECTED_CATEGORY",
    name: "category_id",
    value: categoryId,
  });
};

export default {
  initMatomo,
  logAppVisit,
  logAppClose,
  logOnboardingSwipe,
  _deprecatedLogFeelingStart,
  logFeelingDateChoose,
  _deprecatedLogFeelingAdd,
  _deprecatedLogFeelingSubmitSurvey,
  _deprecatedLogFeelingAddList,
  _deprecatedLogFeelingAddListCompleted,
  logReminderAdd,
  logReminderCancel,
  logSymptomAdd,
  logSymptomCancel,
  logCalendarOpen,
  getUserId,
  logNPSOpen,
  logContactOpen,
  logSupportedSelect,
  logCustomSymptomAdd,
  logInfoClick,
  logInfosOpen,
  logFeelingStartYesterday,
  logDrugsOpen,
  logTreatmentNotFound,
  logProNPSSend,
  logProNPSContactSend,
  logDrugAdd,
  _deprecatedLogActivateBeck,
  logBeckStepOpen,
  logBeckViewOpen,
  logDeleteBeck,
  logBeckEditClick,
  logBeckAddCustomWhere,
  logBeckAddCustomWho,
  logBeckAddCustomEmotion,
  logBeckAddCustomSensation,
  _deprecatedLogNPSUsefulSend,
  _deprecatedLogNPSRecoSend,
  logNPSFormSent,
  logAddNoteDiary,
  logEditNoteDiary,
  logDeleteNoteDiary,
  logOpenPage,
  _legacyLogInputDrugSurvey,
  _deprecatedLogFeelingEditButtonClick,
  _deprecatedLogFeelingAddComment,
  _deprecatedLogFeelingAddContext,
  _deprecatedLogFeelingResponseToxic,
  _deprecatedLogSettingsSymptomsFromSurvey,
  logOpenPageSuivi,
  logSuiviEditDateFrom,
  logSuiviEditDateTo,
  logSuiviEditScoreFrise,
  logSuiviEditScoreEvents,
  logSuiviEditSymptom,
  logSuiviShowDetailStatistics,
  _deprecatedLogFeelingStartFloatingPlus,
  _deprecatedLogFeelingStartFromRecap,
  logStatusSubPage,
  logSuiviShowLegendeInformationPriseDeTraitement,
  logSuiviShowPriseDeTraitement,
  _legacyLogInputDrugSurveyPriseDeTraitement,
  _legacyLogInputDrugSurveyPriseDeTraitementSiBesoin,
  logRecommendAppShow,
  logRecommendAppSent,
  logRecommendAppDismissed,
  logRecommendAppError,
  logOnboardingExplainNext,
  logOnboardingExplainOpen,
  logOnboardingExplainStart,
  logPushNotifTokenRegisterSuccess,
  logPushNotifTokenRegisterError,
  logPushNotifReceiveClicked,
  // New onboarding event functions
  logIntroObdNext,
  logCarrouselObdNext,
  logCarrouselObdPass,
  logHumeurObdStart,
  logHumeurObdSelect,
  logHumeurObdConfirm,
  logIndicatorObdStart,
  logIndicatorObdLvl1,
  logIndicatorObdPass,
  logIndicatorObdLvl2,
  logIndicatorObdValidate,
  logQuestObdStart,
  logSleepObdValidate,
  logQuestObdStart2,
  logQuestObdStep,
  logQuestObdCongrats,
  logReminderObdEdit,
  logReminderObd,
  logOnboardingBack,
  logDataImport,
  logDataExportAsBackUp,
  logHealthTipFeedbackUp,
  logHealthTipFeedbackDown,
  logOpenAnalysisMain,
  logOpenDailyQuestionnaire,
  logValidateDailyQuestionnaire,
  logIndicatorsDailyQuestionnaire,
  logObjectivesDailyQuestionnaire,
  logCompletionIndicatorsDailyQuestionnaire,
  logCompletionObjectivesDailyQuestionnaire,
  logTimeSpentDailyQuestionnaire,
  logCompletionNotesDailyQuestionnaire,
  logCompletionDrugDailyQuestionnaire,
  logDayDailyQuestionnaire,
  logOpenFaq,
  logNeedAssistanceFaq,
  logOpenFaqSection,
  logResourceArticleSelected,
  logResourceArticleSelectedPosition,
  logResourceArticleTimeSpentId,
  logResourceArticleTimeSpentSeconds,
  logResourceOpenedExternalLink,
  logOpenedRessources,
  logExportSummary,
  logOpenExportSummary,
  logEditReminder,
  logOpenReminderSettings,
  logOpenSettings,
  logEditSurvey,
  logDeleteIndicator,
  // Support page events
  logClickMonSoutienPsy,
  logClickSantePsyEtudiant,
  logOpenCounsellingSection,
  logOpenHelplinesSection,
  logCallHelpline,
  logOpenEmergencyContact,
  // Objectives management functions
  logAddObjectiveNative,
  logAddObjectivePersonalized,
  logStartAddObjective,
  logEditObjectiveReminder,
  logOpenObjectivesSettings,
  // checklist
  logOpenChecklist,
  logPassChecklist,
  logClickCheckList,
  // indicator
  logStartAddIndicator,
  logAddIndicator,
  logAddIndicatorCategory,
  logCreatePersonalizedIndicator,
  logOpenIndicatorsSettings,
  // Drug logging functions
  logAddDrug,
  logStartEditDrug,
  logDeleteDrug,
  logToggleDrug,
  logOpenDrugSettings,
  // Resources events
  logViewedArticlesList,
  logSelectedCategory,
};
