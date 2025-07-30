import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ReactNode } from 'react';
import { NEW_INDICATORS_SUBCATEGORIES, NEW_INDICATORS_CATEGORIES } from '@/utils/liste_indicateurs.1';

export type OnboardingStep =
  | 'INTRO'
  | 'PROFILE'
  | 'CAROUSEL'
  | 'DIFFICULTIES'
  | 'OBJECTIVE'
  | 'CHECKIN';

export interface UserProfile {
  id: string;
  name: string;
  selectedDifficulties: NEW_INDICATORS_CATEGORIES[];
  objectives: Objective[];
  selectedSubcategories?: NEW_INDICATORS_SUBCATEGORIES[];
}

export interface CarouselSlide {
  id: string;
  title: string;
  description?: string;
  type: 'generic' | 'special';
  backgroundColor?: string;
  illustration?: React.ReactNode;
  children?: React.ReactNode;
}

export interface Difficulty {
  id: string;
  name: string;
  label: string;
  selected: boolean;
  icon: () => React.JSX.Element,
  description?: string,
  category: NEW_INDICATORS_CATEGORIES;
  subCat: NEW_INDICATORS_SUBCATEGORIES[]
}

export interface Objective {
  id: string;
  title: string;
}

export interface CheckInData {
  mood: number;
  energy: number;
  stress: number;
  notes?: string;
  selectedMoods?: string[];
}

export interface IndicatorItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  selected: boolean;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  profile: UserProfile | null;
  difficulties: Difficulty[];
  objective: Objective | null;
  checkInData: CheckInData | null;
  indicators: IndicatorItem[];
  progress: number;
}

// Carousel Props
export interface CarouselSlideProps {
  slide: CarouselSlide;
  isActive: boolean;
  onPress?: () => void;
}

export interface CarouselScreenProps {
  slides: CarouselSlide[];
  onComplete: () => void;
  onSkip: () => void;
}

export type OnboardingV2StackParamList = {
  Intro: undefined;
  Profile: undefined;
  Carousel: undefined;
  PersonalizationStart: undefined;
  PersonalizationDifficulties: undefined,
  PersonalizationObjective: undefined;
  PersonalizationOtherObjective: undefined,
  OnboardingCheckInStart: undefined
  OnboardingCheckInHowDoYouFeel: undefined
  OnboardingCheckInHowDoYouFeelDetails: { mood: number };
  OnboardingCheckInSleep: undefined
  OnboardingCheckInMoodSummary: {
    mood: number,
    selectedMoods: string[],
  }
  OnboardingCheckInIntroductionCompleted: undefined
  OnboardingLoadingScreen: undefined;
  OnboardingChooseIndicator: undefined
  OnboardingReminder: undefined
  StartFirstSurvey: undefined,
  CheckInSleepCompleted: undefined,
  OnboardingChooseIndicatorIntro: undefined,
  SubCategoriesScreen: undefined,
  'day-survey': {
    currentSurvey: {},
    editingSurvey: boolean,
    isOnboarding: boolean
  },
  'day-survey-v2': {
    currentSurvey: {},
    editingSurvey: boolean,
    isOnboarding: boolean
  }
};

export type OnboardingV2ScreenProps<T extends keyof OnboardingV2StackParamList> = {
  navigation: StackNavigationProp<OnboardingV2StackParamList, T>;
  route: RouteProp<OnboardingV2StackParamList, T>;
};
