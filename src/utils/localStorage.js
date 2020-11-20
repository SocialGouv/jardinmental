import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY_SYMPTOMS} from '../common/constants';

const getSymptoms = async () => {
  const symp = await AsyncStorage.getItem(STORAGE_KEY_SYMPTOMS);
  if (symp) return JSON.parse(symp);
};

const setSymptoms = async (symp) => {
  await AsyncStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(symp));
};

export default {getSymptoms, setSymptoms};
