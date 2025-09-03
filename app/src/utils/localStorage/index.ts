import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  STORAGE_KEY_IS_FIRST_LAUNCH,
  STORAGE_KEY_SYMPTOMS, //legacy
  STORAGE_KEY_INDICATEURS,
  STORAGE_KEY_SUPPORTED,
  STORAGE_KEY_CUSTOM_SYMPTOMS,
  STORAGE_KEY_MEDICAL_TREATMENT,
  STORAGE_KEY_NOTES_VERSION,
  STORAGE_KEY_VISIT_PRO_NPS,
  STORAGE_KEY_CUSTOM_DRUGS,
  STORAGE_KEY_ONBOARDING_STEP,
  STORAGE_KEY_ONBOARDING_DONE,
  STORAGE_KEY_NPS_PRO_CONTACT,
  STORAGE_KEY_CHECKLIST_BANNER_DISMISSED,
  STORAGE_KEY_CHECKLIST_BANNER_STATE,
  CHECKLIST_BANNER_CONFIG,
  STORAGE_KEY_NEW_USER,
} from "../constants";
import { updateSymptomsFormatIfNeeded } from "./utils";
import localStorageBeck from "./beck";
import { Indicator } from "../../entities/Indicator";
import { UserProfile } from "../../scenes/onboarding-v2/types";

const getSymptoms = async () => {
  const symptoms = await AsyncStorage.getItem(STORAGE_KEY_SYMPTOMS);
  if (symptoms) {
    return JSON.parse(symptoms);
  }
};

const setSymptoms = async (symp) => {
  await AsyncStorage.setItem(STORAGE_KEY_SYMPTOMS, JSON.stringify(symp));
};

const getIndicateurs = async (): Promise<Indicator[]> => {
  let _indicateurs = await AsyncStorage.getItem(STORAGE_KEY_INDICATEURS);
  if (!_indicateurs) {
    // si on n'a pas d'indicateurs, on les récupère depuis le localStorage de symptoms, et on migre si besoin
    // sinon, c'est qu'on ne l'a pas encore configuré
    const symptoms = await AsyncStorage.getItem(STORAGE_KEY_SYMPTOMS);
    if (symptoms) {
      let parsedIndicateurs = updateSymptomsFormatIfNeeded(JSON.parse(symptoms));
      _indicateurs = JSON.stringify(parsedIndicateurs);
    }
    if (_indicateurs) {
      // si on a migré, on sauvegarde
      await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, _indicateurs);
    }
  }
  if (_indicateurs) {
    let parsedIndicateurs = updateSymptomsFormatIfNeeded(JSON.parse(_indicateurs));
    return parsedIndicateurs;
  } else {
    return [];
  }
};

const setIndicateurs = async (v: Indicator[]) => {
  await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(v));
};
const addIndicateur = async (indicateur: Indicator) => {
  let _indicateurs = await AsyncStorage.getItem(STORAGE_KEY_INDICATEURS);
  _indicateurs = JSON.parse(_indicateurs);
  _indicateurs.push(indicateur);
  await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(_indicateurs));
};

const replaceOrAddIndicateur = async (indicateur: Indicator) => {
  let _indicateurs = await AsyncStorage.getItem(STORAGE_KEY_INDICATEURS);
  _indicateurs = _indicateurs ? JSON.parse(_indicateurs) : [];

  const index = _indicateurs.findIndex((ind: Indicator) => ind.uuid === indicateur.uuid);
  if (index !== -1) {
    _indicateurs[index] = indicateur;
  } else {
    _indicateurs.push(indicateur);
  }

  await AsyncStorage.setItem(STORAGE_KEY_INDICATEURS, JSON.stringify(_indicateurs));
};

const getIsFirstAppLaunch = async () => await AsyncStorage.getItem(STORAGE_KEY_IS_FIRST_LAUNCH);

const setIsFirstAppLaunch = async (isAppFirstLaunch) => {
  await AsyncStorage.setItem(STORAGE_KEY_IS_FIRST_LAUNCH, JSON.stringify(isAppFirstLaunch));
};
const getOnboardingStep = async () => await AsyncStorage.getItem(STORAGE_KEY_ONBOARDING_STEP);

const setOnboardingStep = async (step) => {
  await AsyncStorage.setItem(STORAGE_KEY_ONBOARDING_STEP, step);
};
const getOnboardingDone = async () => {
  const onboardingDone = await AsyncStorage.getItem(STORAGE_KEY_ONBOARDING_DONE);
  if (onboardingDone) {
    return JSON.parse(onboardingDone);
  }
};

const setOnboardingDone = async (value) => {
  await AsyncStorage.setItem(STORAGE_KEY_ONBOARDING_DONE, JSON.stringify(value));
};

const getSupported = async () => {
  const supported = await AsyncStorage.getItem(STORAGE_KEY_SUPPORTED);
  if (supported) {
    return JSON.parse(supported);
  }
};

const setSupported = async (supported) => await AsyncStorage.setItem(STORAGE_KEY_SUPPORTED, JSON.stringify(supported));

const getCustomSymptoms = async () => {
  const customSymptoms = await AsyncStorage.getItem(STORAGE_KEY_CUSTOM_SYMPTOMS);
  return JSON.parse(customSymptoms) || [];
};

const setCustomSymptoms = async (symp) => {
  await AsyncStorage.setItem(STORAGE_KEY_CUSTOM_SYMPTOMS, JSON.stringify(symp));
};

const addCustomSymptoms = async (sym) => {
  const customSymptoms = await getCustomSymptoms();
  customSymptoms.push(sym);
  await AsyncStorage.setItem(STORAGE_KEY_CUSTOM_SYMPTOMS, JSON.stringify(customSymptoms));
};

const getMedicalTreatment = async () => {
  const a = await AsyncStorage.getItem(STORAGE_KEY_MEDICAL_TREATMENT);
  return JSON.parse(a);
};

const setMedicalTreatment = async (v) => {
  await AsyncStorage.setItem(STORAGE_KEY_MEDICAL_TREATMENT, JSON.stringify(v));
};

const removeDrugFromTreatment = async (drugId) => {
  let treatment = await getMedicalTreatment();
  treatment = treatment.filter((e) => e.id !== drugId);
  await AsyncStorage.setItem(STORAGE_KEY_MEDICAL_TREATMENT, JSON.stringify(treatment));
  return treatment;
};

const getNotesVersion = async () => {
  const a = await AsyncStorage.getItem(STORAGE_KEY_NOTES_VERSION);
  return JSON.parse(a);
};

const setNotesVersion = async (v) => {
  await AsyncStorage.setItem(STORAGE_KEY_NOTES_VERSION, JSON.stringify(v));
};

const getVisitProNPS = async () => {
  const a = await AsyncStorage.getItem(STORAGE_KEY_VISIT_PRO_NPS);
  return JSON.parse(a);
};

const setVisitProNPS = async (v) => {
  await AsyncStorage.setItem(STORAGE_KEY_VISIT_PRO_NPS, JSON.stringify(v));
};

const setNpsProContact = async (v) => {
  await AsyncStorage.setItem(STORAGE_KEY_NPS_PRO_CONTACT, JSON.stringify(v));
};

const getNpsProContact = async () => {
  const v = await AsyncStorage.getItem(STORAGE_KEY_NPS_PRO_CONTACT);
  return JSON.parse(v);
};

const getCustomDrugs = async () => {
  const customDrugs = await AsyncStorage.getItem(STORAGE_KEY_CUSTOM_DRUGS);
  return JSON.parse(customDrugs) || [];
};

const addCustomDrug = async (drug) => {
  const customDrugs = await getCustomDrugs();
  customDrugs.push(drug);
  await AsyncStorage.setItem(STORAGE_KEY_CUSTOM_DRUGS, JSON.stringify(customDrugs));
  return customDrugs;
};

// User Profile functions
const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await AsyncStorage.getItem("@USER_PROFILE");
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

const setUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem("@USER_PROFILE", JSON.stringify(profile));
  } catch (error) {
    console.error("Error setting user profile:", error);
  }
};

const clearUserProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("@USER_PROFILE");
  } catch (error) {
    console.error("Error clearing user profile:", error);
  }
};

// Enhanced checklist banner state functions
interface ChecklistBannerState {
  dismissCount: number;
  lastDismissedAt: number | null;
  permanentlyDismissed: boolean;
}

const getChecklistBannerState = async (): Promise<ChecklistBannerState> => {
  const state = await AsyncStorage.getItem(STORAGE_KEY_CHECKLIST_BANNER_STATE);
  if (state) {
    return JSON.parse(state);
  }

  // Default state
  return {
    dismissCount: 0,
    lastDismissedAt: null,
    permanentlyDismissed: false,
  };
};

const setChecklistBannerState = async (state: ChecklistBannerState) => {
  await AsyncStorage.setItem(STORAGE_KEY_CHECKLIST_BANNER_STATE, JSON.stringify(state));
};

const incrementChecklistBannerDismissCount = async (): Promise<ChecklistBannerState> => {
  const currentState = await getChecklistBannerState();
  const newDismissCount = currentState.dismissCount + 1;
  const newState: ChecklistBannerState = {
    dismissCount: newDismissCount,
    lastDismissedAt: Date.now(),
    permanentlyDismissed: newDismissCount >= CHECKLIST_BANNER_CONFIG.MAX_DISMISSALS,
  };

  await setChecklistBannerState(newState);
  return newState;
};


const getIsNewUser = async () => {
  const isNewUser = await AsyncStorage.getItem(STORAGE_KEY_NEW_USER);
  if (isNewUser) {
    return JSON.parse(isNewUser);
  }
};

const setIsNewUser = async (value) => {
  await AsyncStorage.setItem(STORAGE_KEY_NEW_USER, JSON.stringify(value));
};

export default {
  getSymptoms,
  setSymptoms,
  getIsFirstAppLaunch,
  setIsFirstAppLaunch,
  getOnboardingStep,
  setOnboardingStep,
  getOnboardingDone,
  setOnboardingDone,
  getSupported,
  setSupported,
  getCustomSymptoms,
  addCustomSymptoms,
  setCustomSymptoms,
  getMedicalTreatment,
  setMedicalTreatment,
  removeDrugFromTreatment,
  getNotesVersion,
  setNotesVersion,
  getVisitProNPS,
  setVisitProNPS,
  addCustomDrug,
  getCustomDrugs,
  setNpsProContact,
  getNpsProContact,
  getIndicateurs,
  replaceOrAddIndicateur,
  setIndicateurs,
  addIndicateur,
  getUserProfile,
  setUserProfile,
  clearUserProfile,
  getChecklistBannerState,
  setChecklistBannerState,
  incrementChecklistBannerDismissCount,
  getIsNewUser,
  setIsNewUser,
  ...localStorageBeck,
};

// Export the interface for use in other files
export type { ChecklistBannerState };
