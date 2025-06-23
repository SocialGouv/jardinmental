import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

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
}

export interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  type: 'generic' | 'special';
  backgroundColor?: string;
  illustration?: React.ReactNode;
}

export interface Difficulty {
  id: string;
  name: string;
  selected: boolean;
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

// Navigation Props
export interface NavigationButtonsProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  showPrevious?: boolean;
  showSkip?: boolean;
  nextDisabled?: boolean;
  nextText?: string;
  skipText?: string;
  loading?: boolean;
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
  OnboardingCheckInMoodSummary: undefined
  OnboardingCheckInIntroductionCompleted: undefined
  OnboardingChooseIndicator: undefined
  OnboardingReminder: undefined
};

export type OnboardingV2ScreenProps<T extends keyof OnboardingV2StackParamList> = {
  navigation: StackNavigationProp<OnboardingV2StackParamList, T>;
  route: RouteProp<OnboardingV2StackParamList, T>;
};
