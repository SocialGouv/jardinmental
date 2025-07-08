
import { Indicator, INDICATORS_CATEGORIES } from './Indicator';

export enum SurveyScreenType {
    // group information by category
    'category'='category',
    'individual'='individual',
    'goals'='goals',
    'context'='context',
    'toxic'='toxic',
    'encouragement'='encouragement'
}

interface BaseSurveyScreen {
    id: string;
    type: SurveyScreenType;
    title: string;
}

interface EncouragementSurveyScreen extends BaseSurveyScreen {
    type: SurveyScreenType.encouragement;
    description?: string;
    extraInfo?: string;
}

interface CategoryScreen extends BaseSurveyScreen {
    type: SurveyScreenType.category;
    indicators: Indicator[];
    category: INDICATORS_CATEGORIES
}

interface IndividualScreen extends BaseSurveyScreen {
    type: SurveyScreenType.individual;
    indicators: Indicator[];
}

interface GoalsScreen extends BaseSurveyScreen {
    type: SurveyScreenType.goals;
}

interface ToxicScreen extends BaseSurveyScreen {
    type: SurveyScreenType.toxic;
}

interface ContextScreen extends BaseSurveyScreen {
    type: SurveyScreenType.context;
}

export type SurveyScreenInterface =
    | EncouragementSurveyScreen
    | CategoryScreen
    | IndividualScreen
    | GoalsScreen
    | ToxicScreen
    | ContextScreen;

// Navigation types
export type SurveyStackParamList = {
    [key: `screen-survey-${string}`]: {
        screenData: SurveyScreenInterface;
        screenIndex: number;
        isOnboarding: boolean;
    };
};

export interface SurveyNavigatorRouteParams {
    currentSurvey?: import('./DiaryData').DiaryDataNewEntryInput;
    editingSurvey?: boolean;
    redirect?: boolean;
}
