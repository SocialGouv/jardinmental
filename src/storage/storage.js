import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY_SURVEY_RESULTS} from '../common/constants';

export const initStorage = async () => {
  try {
    if ((await AsyncStorage.getItem(STORAGE_KEY_SURVEY_RESULTS)) === null) {
      await AsyncStorage.setItem(
        STORAGE_KEY_SURVEY_RESULTS,
        JSON.stringify([]),
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export const getItemFromStorage = async (storageKey) => {
  try {
    return JSON.parse(await AsyncStorage.getItem(storageKey));
  } catch (error) {
    console.error(error);
  }
};

export const setItemFromStorage = async (storageKey, value) => {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const appendElementToStorageArray = async (
  storageKey,
  elementToAppend,
) => {
  try {
    const storageElementToUpdate = await getItemFromStorage(storageKey);
    const newValue = storageElementToUpdate.push(elementToAppend);
    await setItemFromStorage(storageKey, newValue);
  } catch (error) {
    console.error(error);
  }
};
