import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import Matomo from './matomo';
import {STORAGE_KEY_SUPPORTED} from '../common/constants';
import Lumiere from './lumiere';

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

  /* lumiere */

  Lumiere.init('app_h3LEvGuH6y7VzFNyWh9t0');
  Lumiere.registerUser(userId);

  Lumiere.addUserProperties({
    visits: newVisits,
    supported,
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
    Lumiere.sendEvent(category, action, {[name]: value});
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
  logSupportedSelect,
  logCustomSymptomAdd,
  logInfoClick,
  logInfosOpen,
  logFeelingStartYesterday,
  logDrugsOpen,
};
