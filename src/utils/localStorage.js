import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEY_IS_FIRST_LAUNCH,
  STORAGE_KEY_SYMPTOMS,
} from '../common/constants';

const getSymptoms = async () => {
  const symptoms = await AsyncStorage.getItem(STORAGE_KEY_SYMPTOMS);
  if (symptoms) {
    return JSON.parse(symptoms);
  }
};

const setSymptoms = async (symp) => {
  await AsyncStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(symp));
};

const getIsFirstAppLaunch = async () =>
  await AsyncStorage.getItem(STORAGE_KEY_IS_FIRST_LAUNCH);

const setIsFirstAppLaunch = async (isAppFirstLaunch) => {
  await AsyncStorage.setItem(
    STORAGE_KEY_IS_FIRST_LAUNCH,
    JSON.stringify(isAppFirstLaunch),
  );
};

export default {
  getSymptoms,
  setSymptoms,
  getIsFirstAppLaunch,
  setIsFirstAppLaunch,
};
