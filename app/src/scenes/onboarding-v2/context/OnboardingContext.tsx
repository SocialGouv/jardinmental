import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingState, OnboardingStep, UserProfile, Difficulty, Objective, CheckInData, IndicatorItem } from '../types';
import { STORAGE_KEYS, STEP_ORDER, STEP_PROGRESS, TOTAL_STEPS } from '../constants';

interface OnboardingContextType {
  state: OnboardingState;
  updateProfile: (profile: UserProfile) => void;
  updateDifficulties: (difficulties: Difficulty[]) => void;
  updateObjective: (objective: Objective) => void;
  updateCheckIn: (data: CheckInData) => void;
  updateIndicators: (indicators: IndicatorItem[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}

type OnboardingAction =
  | { type: 'SET_STATE'; payload: Partial<OnboardingState> }
  | { type: 'UPDATE_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_DIFFICULTIES'; payload: Difficulty[] }
  | { type: 'UPDATE_OBJECTIVE'; payload: Objective }
  | { type: 'UPDATE_CHECKIN'; payload: CheckInData }
  | { type: 'UPDATE_INDICATORS'; payload: IndicatorItem[] }
  | { type: 'SET_STEP'; payload: OnboardingStep }
  | { type: 'RESET' };

const initialState: OnboardingState = {
  currentStep: 'INTRO',
  profile: null,
  difficulties: [],
  objective: null,
  checkInData: null,
  indicators: [],
  progress: 0,
};

const onboardingReducer = (state: OnboardingState, action: OnboardingAction): OnboardingState => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    
    case 'UPDATE_PROFILE':
      return { ...state, profile: action.payload };
    
    case 'UPDATE_DIFFICULTIES':
      return { ...state, difficulties: action.payload };
    
    case 'UPDATE_OBJECTIVE':
      return { ...state, objective: action.payload };
    
    case 'UPDATE_CHECKIN':
      return { ...state, checkInData: action.payload };
    
    case 'UPDATE_INDICATORS':
      return { ...state, indicators: action.payload };
    
    case 'SET_STEP':
      const stepIndex = STEP_ORDER.indexOf(action.payload);
      const progress = stepIndex >= 0 ? ((stepIndex + 1) / TOTAL_STEPS) * 100 : 0;
      return { 
        ...state, 
        currentStep: action.payload,
        progress 
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const updateProfile = (profile: UserProfile) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const updateDifficulties = (difficulties: Difficulty[]) => {
    dispatch({ type: 'UPDATE_DIFFICULTIES', payload: difficulties });
  };

  const updateObjective = (objective: Objective) => {
    dispatch({ type: 'UPDATE_OBJECTIVE', payload: objective });
  };

  const updateCheckIn = (data: CheckInData) => {
    dispatch({ type: 'UPDATE_CHECKIN', payload: data });
  };

  const updateIndicators = (indicators: IndicatorItem[]) => {
    dispatch({ type: 'UPDATE_INDICATORS', payload: indicators });
  };

  const nextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      dispatch({ type: 'SET_STEP', payload: nextStep });
    }
  };

  const previousStep = () => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      dispatch({ type: 'SET_STEP', payload: prevStep });
    }
  };

  const goToStep = (step: OnboardingStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const resetOnboarding = () => {
    dispatch({ type: 'RESET' });
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_V2_STATE, JSON.stringify(state));
      
      if (state.profile) {
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_V2_PROFILE, JSON.stringify(state.profile));
      }
      
      if (state.difficulties.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_V2_DIFFICULTIES, JSON.stringify(state.difficulties));
      }
      
      if (state.objective) {
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_V2_OBJECTIVE, JSON.stringify(state.objective));
      }
      
      if (state.checkInData) {
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_V2_CHECKIN, JSON.stringify(state.checkInData));
      }
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  };

  const loadProgress = async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_V2_STATE);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SET_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
  };

  // Auto-save progress when state changes
  useEffect(() => {
    if (state.currentStep !== 'INTRO' || state.profile || state.difficulties.length > 0) {
      saveProgress();
    }
  }, [state]);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const contextValue: OnboardingContextType = {
    state,
    updateProfile,
    updateDifficulties,
    updateObjective,
    updateCheckIn,
    updateIndicators,
    nextStep,
    previousStep,
    goToStep,
    resetOnboarding,
    saveProgress,
    loadProgress,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;
