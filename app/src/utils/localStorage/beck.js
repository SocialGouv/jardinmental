import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  STORAGE_KEY_IS_BECK_ACTIVATED,
  STORAGE_KEY_BECK_WHERE_LIST,
  STORAGE_KEY_BECK_WHO_LIST,
  STORAGE_KEY_BECK_EMOTION_LIST,
  STORAGE_KEY_BECK_SENSATION_LIST,
} from "../../utils/constants";

const getIsBeckActivated = async () => {
  const a = await AsyncStorage.getItem(STORAGE_KEY_IS_BECK_ACTIVATED);
  return JSON.parse(a);
};

const setIsBeckActivated = async (v) => {
  await AsyncStorage.setItem(STORAGE_KEY_IS_BECK_ACTIVATED, JSON.stringify(v));
};

// where
const getBeckWhereList = async () => {
  const beckWhereList = await AsyncStorage.getItem(STORAGE_KEY_BECK_WHERE_LIST);
  return JSON.parse(beckWhereList) || [];
};
const setBeckWhereList = async (wheres) => {
  await AsyncStorage.setItem(STORAGE_KEY_BECK_WHERE_LIST, JSON.stringify(wheres));
};
const addBeckWhereList = async (where) => {
  const beckWhereList = await getBeckWhereList();
  beckWhereList.push(where);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_WHERE_LIST, JSON.stringify(beckWhereList));
};
const removeBeckWhereList = async (where) => {
  let beckWhereList = await getBeckWhereList();
  beckWhereList = beckWhereList.filter((w) => w !== where);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_WHERE_LIST, JSON.stringify(beckWhereList));
  return beckWhereList;
};

// who
const getBeckWhoList = async () => {
  const beckWhoList = await AsyncStorage.getItem(STORAGE_KEY_BECK_WHO_LIST);
  return JSON.parse(beckWhoList) || [];
};

const setBeckWhoList = async (whos) => {
  await AsyncStorage.setItem(STORAGE_KEY_BECK_WHO_LIST, JSON.stringify(whos));
};
const addBeckWhoList = async (who) => {
  const beckWhoList = await getBeckWhoList();
  beckWhoList.push(who);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_WHO_LIST, JSON.stringify(beckWhoList));
};
const removeBeckWhoList = async (who) => {
  let beckWhoList = await getBeckWhoList();
  beckWhoList = beckWhoList.filter((w) => w !== who);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_WHO_LIST, JSON.stringify(beckWhoList));
  return beckWhoList;
};

// emotion
const getBeckEmotionList = async () => {
  const beckEmotionList = await AsyncStorage.getItem(STORAGE_KEY_BECK_EMOTION_LIST);
  return JSON.parse(beckEmotionList) || [];
};

const setBeckEmotionList = async (emotions) => {
  await AsyncStorage.setItem(STORAGE_KEY_BECK_EMOTION_LIST, JSON.stringify(emotions));
};
const addBeckEmotionList = async (emotion) => {
  const beckEmotionList = await getBeckEmotionList();
  beckEmotionList.push(emotion);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_EMOTION_LIST, JSON.stringify(beckEmotionList));
};
const removeBeckEmotionList = async (emotion) => {
  let beckEmotionList = await getBeckEmotionList();
  beckEmotionList = beckEmotionList.filter((e) => e !== emotion);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_EMOTION_LIST, JSON.stringify(beckEmotionList));
  return beckEmotionList;
};

// sensation
const getBeckSensationList = async () => {
  const beckEmotionList = await AsyncStorage.getItem(STORAGE_KEY_BECK_SENSATION_LIST);
  return JSON.parse(beckEmotionList) || [];
};

const setBeckSensationList = async (sensations) => {
  await AsyncStorage.setItem(STORAGE_KEY_BECK_SENSATION_LIST, JSON.stringify(sensations));
};
const addBeckSensationList = async (sensation) => {
  const beckSensationList = await getBeckSensationList();
  beckSensationList.push(sensation);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_SENSATION_LIST, JSON.stringify(beckSensationList));
};
const removeBeckSensationList = async (sensation) => {
  let beckSensationList = await getBeckSensationList();
  beckSensationList = beckSensationList.filter((e) => e !== sensation);
  await AsyncStorage.setItem(STORAGE_KEY_BECK_SENSATION_LIST, JSON.stringify(beckSensationList));
  return beckSensationList;
};

export default {
  getIsBeckActivated,
  setIsBeckActivated,
  getBeckWhereList,
  setBeckWhereList,
  addBeckWhereList,
  removeBeckWhereList,
  getBeckWhoList,
  setBeckWhoList,
  addBeckWhoList,
  removeBeckWhoList,
  getBeckEmotionList,
  setBeckEmotionList,
  addBeckEmotionList,
  removeBeckEmotionList,
  getBeckSensationList,
  setBeckSensationList,
  addBeckSensationList,
  removeBeckSensationList,
};
