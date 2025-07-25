import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Difficulty, Objective } from '../scenes/onboarding-v2/types';
import { NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from '@/utils/liste_indicateurs.1';

const STORAGE_KEY_USER_PROFILE = '@USER_PROFILE';

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isProfileSelected: boolean;
  setProfile: (profile: UserProfile) => void;
  updateUserDifficulties: (difficulties: NEW_INDICATORS_CATEGORIES[]) => Promise<void>;
  updateUserObjectives: (objectives: Objective[]) => Promise<void>;
  updateUserSubcategories: (subcategories: NEW_INDICATORS_SUBCATEGORIES[]) => Promise<void>;
  clearProfile: () => void;
  loadProfile: () => Promise<void>;
}

type UserProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROFILE'; payload: UserProfile | null }
  | { type: 'CLEAR_PROFILE' };

const initialState: UserProfileState = {
  profile: null,
  isLoading: true,
};

const userProfileReducer = (state: UserProfileState, action: UserProfileAction): UserProfileState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_PROFILE':
      return { ...state, profile: action.payload, isLoading: false };

    case 'CLEAR_PROFILE':
      return { ...state, profile: null, isLoading: false };

    default:
      return state;
  }
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userProfileReducer, initialState);

  const setProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(profile));
      dispatch({ type: 'SET_PROFILE', payload: profile });
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_USER_PROFILE);
      dispatch({ type: 'CLEAR_PROFILE' });
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  };

  const updateUserDifficulties = async (difficulties: NEW_INDICATORS_CATEGORIES[]) => {
    if (state.profile) {
      try {
        const updatedProfile = {
          ...state.profile,
          selectedDifficulties: difficulties,
        };
        await setProfile(updatedProfile);
      } catch (error) {
        console.error('Error updating user difficulties:', error);
      }
    }
  };

  const updateUserObjectives = async (objectives: Objective[]) => {
    if (state.profile) {
      try {
        const updatedProfile = {
          ...state.profile,
          objectives: objectives
        };
        await setProfile(updatedProfile);
      } catch (error) {
        console.error('Error updating user objectives:', error);
      }
    }
  };

  const updateUserSubcategories = async (subcategories: NEW_INDICATORS_SUBCATEGORIES[]) => {
    if (state.profile) {
      try {
        const updatedProfile = {
          ...state.profile,
          selectedSubcategories: subcategories
        };
        await setProfile(updatedProfile);
      } catch (error) {
        console.error('Error updating user subcategories:', error);
      }
    }
  };

  const loadProfile = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const savedProfile = await AsyncStorage.getItem(STORAGE_KEY_USER_PROFILE);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        dispatch({ type: 'SET_PROFILE', payload: parsedProfile });
      } else {
        // default profile
        dispatch({
          type: 'SET_PROFILE', payload: {
            id: 'non-suivi',
            name: 'Non, je ne suis pas suivi(e)',
            selectedDifficulties: [],
            objectives: []
          }
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      dispatch({ type: 'SET_PROFILE', payload: null });
    }
  };

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const contextValue: UserProfileContextType = {
    profile: state.profile,
    isLoading: state.isLoading,
    isProfileSelected: state.profile !== null,
    setProfile,
    updateUserDifficulties,
    updateUserObjectives,
    updateUserSubcategories,
    clearProfile,
    loadProfile,
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};

export default UserProfileContext;
