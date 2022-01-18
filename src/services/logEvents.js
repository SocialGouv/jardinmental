import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import Matomo from './matomo';
import {STORAGE_KEY_SUPPORTED} from '../utils/constants';

const CONSTANTS = {
  STORE_KEY_USER_ID: 'STORE_KEY_USER_ID',
  STORE_KEY_NUMBER_OF_VISITS: 'STORE_KEY_NUMBER_OF_VISITS',
};

const initMatomo = async () => {
  let userId = await AsyncStorage.getItem(CONSTANTS.STORE_KEY_USER_ID);
  if (!userId) {
    userId = Matomo.makeid();
    await AsyncStorage.setItem(CONSTANTS.STORE_KEY_USER_ID, userId);
  }

  const previousVisits = await AsyncStorage.getItem(
    CONSTANTS.STORE_KEY_NUMBER_OF_VISITS,
  );
  const newVisits = previousVisits ? Number(previousVisits) + 1 : 1;
  await AsyncStorage.setItem(
    CONSTANTS.STORE_KEY_NUMBER_OF_VISITS,
    `${newVisits}`,
  );

  Matomo.init({
    baseUrl: 'https://matomo.fabrique.social.gouv.fr/piwik.php',
    idsite: 37,
    userId,
    _idvc: newVisits,
  });

  let supported = await AsyncStorage.getItem(STORAGE_KEY_SUPPORTED);

  Matomo.setUserProperties({
    version: DeviceInfo.getVersion(),
    system: Platform.OS,
    supported: supported ? supported : '',
  });
};

const checkNetwork = async () => {
  const networkState = await NetInfo.fetch();
  return networkState.isConnected;
};

const logEvent = async ({category, action, name, value}) => {
  try {
    const canSend = await checkNetwork();
    if (!canSend) {
      throw new Error('no network');
    }
    Matomo.logEvent({category, action, name, value});
  } catch (error) {
    console.log('logEvent error', error);
    console.log('logEvent error', {category, action, name, value});
  }
};

const getUserId = () => Matomo.userId;

/*
APP VISIT

*/

const APP = 'APP';
const APP_OPEN = 'APP_OPEN';
const APP_CLOSE = 'APP_CLOSE';

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

const ONBOARDING = 'ONBOARDING';
const NEXT_CLICK = 'NEXT_CLICK';

const logOnboardingSwipe = async (page) => {
  await logEvent({
    category: ONBOARDING,
    action: NEXT_CLICK,
    name: 'page',
    value: page,
  });
};

const FEELING = 'FEELING';
const FEELING_START = 'FEELING_START';
const FEELING_DATE_CHOOSE = 'FEELING_DATE_CHOOSE';
const FEELING_ADD = 'FEELING_ADD';
const FEELING_START_YESTERDAY = 'FEELING_START_YESTERDAY';

const logFeelingStart = async () => {
  await logEvent({
    category: FEELING,
    action: FEELING_START,
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

const logFeelingAdd = async () => {
  await logEvent({
    category: FEELING,
    action: FEELING_ADD,
  });
};

const logFeelingAddComment = async (value) => {
  await logEvent({
    category: FEELING,
    action: 'FEELING_ADD_COMMENT',
    name: 'comment',
    value,
  });
};
const logFeelingAddContext = async (value) => {
  await logEvent({
    category: FEELING,
    action: 'FEELING_ADD_CONTEXT',
    name: 'context',
    value,
  });
};
const logFeelingResponseToxic = async (value) => {
  await logEvent({
    category: FEELING,
    action: 'FEELING_RESPONSE_TOXIC',
    name: 'toxic',
    value,
  });
};

const logFeelingEditButtonClick = async () => {
  await logEvent({
    category: FEELING,
    action: 'FEELING_EDIT_BUTTON_CLICK',
  });
};

const PARAMETERS = 'PARAMETERS';
const REMINDER_ADD = 'REMINDER_ADD';
const REMINDER_CANCEL = 'REMINDER_CANCEL';

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

const SYMPTOM = 'SYMPTOM';
const SYMPTOM_ADD = 'SYMPTOM_ADD';
const SYMPTOM_CANCEL = 'SYMPTOM_CANCEL';
const CUSTOM_SYMPTOM = 'CUSTOM_SYMPTOM';
const CUSTOM_SYMPTOM_ADD = 'CUSTOM_SYMPTOM_ADD';

const logSymptomAdd = async (symptom) => {
  await logEvent({
    category: SYMPTOM,
    action: SYMPTOM_ADD,
    name: 'symptom',
    value: symptom,
  });
};

const logSymptomCancel = async (symptom) => {
  await logEvent({
    category: SYMPTOM,
    action: SYMPTOM_CANCEL,
    name: 'symptom',
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
    category: 'CALENDAR',
    action: 'CALENDAR_OPEN',
  });
};

const logInfosOpen = async () => {
  await logEvent({
    category: 'INFOS',
    action: 'INFOS_OPEN',
  });
};
const logContactOpen = async () => {
  await logEvent({
    category: 'CONTACT',
    action: 'CONTACT_OPEN',
  });
};

const logDataExport = async () => {
  await logEvent({
    category: 'DATA_EXPORT',
    action: 'DATA_EXPORT',
  });
};

const logNPSOpen = async () => {
  await logEvent({
    category: 'NPS',
    action: 'NPS_OPEN',
  });
};

const logNPSSend = async (useful, reco) => {
  await logEvent({
    category: 'NPS',
    action: 'NPS_SEND',
    name: 'notes',
    value: `${useful}-${reco}`,
  });
};

const logNPSUsefulSend = async (value) => {
  await logEvent({
    category: 'NPS',
    action: 'NPS_SEND',
    name: 'notes-useful',
    value,
  });
};

const logNPSRecoSend = async (value) => {
  await logEvent({
    category: 'NPS',
    action: 'NPS_SEND',
    name: 'notes-reco',
    value,
  });
};

const logProNPSSend = async () => {
  await logEvent({
    category: 'NPS',
    action: 'PRO_NPS_SEND',
  });
};

const logProNPSContactSend = async () => {
  await logEvent({
    category: 'NPS',
    action: 'PRO_NPS_CONTACT_SEND',
  });
};

const logSupportedSelect = async (supported) => {
  await logEvent({
    category: 'SUPPORTED',
    action: 'SUPPORTED_CHOOSE',
    name: supported,
  });
};

const logInfoClick = async (link) => {
  await logEvent({
    category: 'INFOS',
    action: 'INFOS_CLICK',
    name: link,
  });
};

const logDrugsOpen = async () => {
  await logEvent({
    category: 'DRUG',
    action: 'DRUG_OPEN',
  });
};

const logTreatmentNotFound = async (value) => {
  await logEvent({
    category: 'DRUG',
    action: 'DRUG_NOT_FOUND',
    name: value,
  });
};

const logDrugAdd = async (drug) => {
  await logEvent({
    category: 'DRUG',
    action: 'DRUG_ADD',
    name: 'drug',
    value: drug,
  });
};
const logInputDrugSurvey = async (numberOfInput) => {
  await logEvent({
    category: 'DRUG',
    action: 'DRUG_INPUT_SURVEY',
    name: 'numberOfInput',
    value: numberOfInput,
  });
};

// beck
const logActivateBeck = async (v) => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_ACTIVATE',
    name: v,
  });
};
const logBeckAddCustomWhere = async (value) => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_ADD_CUSTOM_ELEMENT_IN_WHERE_LIST',
    name: value,
  });
};
const logBeckAddCustomWho = async (value) => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_ADD_CUSTOM_ELEMENT_IN_WHO_LIST',
    name: value,
  });
};
const logBeckAddCustomEmotion = async (value) => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_ADD_CUSTOM_ELEMENT_IN_EMOTION_LIST',
    name: value,
  });
};
const logBeckAddCustomSensation = async (value) => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_ADD_CUSTOM_ELEMENT_IN_SENSATION_LIST',
    name: value,
  });
};

const logBeckStepOpen = async (step) => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_STEP_OPEN',
    name: step,
  });
};
const logBeckViewOpen = async () => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_VIEW_OPEN',
  });
};
const logBeckEditClick = async () => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_EDIT_CLICK',
  });
};

const logDeleteBeck = async () => {
  await logEvent({
    category: 'BECK',
    action: 'BECK_DELETE',
  });
};

const logAddNoteDiary = async () => {
  await logEvent({
    category: 'DIARY',
    action: 'DIARY_ADD_NOTE',
  });
};
const logEditNoteDiary = async () => {
  await logEvent({
    category: 'DIARY',
    action: 'DIARY_EDIT_NOTE',
  });
};
const logDeleteNoteDiary = async () => {
  await logEvent({
    category: 'DIARY',
    action: 'DIARY_DELETE_NOTE',
  });
};

const logOpenPage = async (category) => {
  await logEvent({
    category: 'OPEN_TAB',
    action: `${category.toUpperCase()}_OPEN`,
  });
};

export default {
  initMatomo,
  logAppVisit,
  logAppClose,
  logOnboardingSwipe,
  logFeelingStart,
  logFeelingDateChoose,
  logFeelingAdd,
  logReminderAdd,
  logReminderCancel,
  logSymptomAdd,
  logSymptomCancel,
  logCalendarOpen,
  logDataExport,
  getUserId,
  logNPSOpen,
  logNPSSend,
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
  logActivateBeck,
  logBeckStepOpen,
  logBeckViewOpen,
  logDeleteBeck,
  logBeckEditClick,
  logBeckAddCustomWhere,
  logBeckAddCustomWho,
  logBeckAddCustomEmotion,
  logBeckAddCustomSensation,
  logNPSUsefulSend,
  logNPSRecoSend,
  logAddNoteDiary,
  logEditNoteDiary,
  logDeleteNoteDiary,
  logOpenPage,
  logInputDrugSurvey,
  logFeelingEditButtonClick,
  logFeelingAddComment,
  logFeelingAddContext,
  logFeelingResponseToxic,
};
