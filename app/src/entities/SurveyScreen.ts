
export enum SurveyScreenType {
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

interface EncouragementSurveyScreen {
    type: SurveyScreenType.encouragement
    description?: string;
    extraInfo?: string;
}

interface CaregoryScreen  {
    type: SurveyScreenType.category
}

interface IndividualScreen {
    type: SurveyScreenType.individual
}

interface GoalsScreen  {
    type: SurveyScreenType.goals
}

interface ToxicScreen  {
    type: SurveyScreenType.toxic
}

interface ContextScreen {
    type: SurveyScreenType.context
}

export type SurveyScreenInterface = BaseSurveyScreen & (EncouragementSurveyScreen | IndividualScreen | IndividualScreen | ToxicScreen | ContextScreen | CaregoryScreen | GoalsScreen)