export const icons = {
  veryGood: 'VeryGoodSvg',
  good: 'GoodSvg',
  middle: 'MiddleSvg',
  bad: 'BadSvg',
  veryBad: 'VeryBadSvg',
  today: 'TodaySvg',
  yesterday: 'YesterdaySvg',
  notes: 'NotesSvg',
};

export const colors = {
  veryBad: '#FFC0C0',
  bad: '#FCD0A7',
  middle: '#FCE285',
  good: '#F0F277',
  veryGood: '#E2FA80',
  veryBadTrans: '#fdcccc',
  badTrans: '#fbd8b8',
  middleTrans: '#fbe79c',
  goodTrans: '#f1f491',
  veryGoodTrans: '#edfaca',
};

export const scoresMapIcon = {
  1: {color: colors.veryBad, faceIcon: icons.veryBad},
  2: {color: colors.bad, faceIcon: icons.bad},
  3: {color: colors.middle, faceIcon: icons.middle},
  4: {color: colors.good, faceIcon: icons.good},
  5: {color: colors.veryGood, faceIcon: icons.veryGood},
};

export const colorsMap = Object.keys(colors).map((key) => colors[key]);

export const categoryStates = {
  VERY_GOOD: {
    id: 'VERY_GOOD',
    level: 5,
    icon: icons.veryGood,
    color: colors.veryGood,
    label: 'Très bien',
  },
  GOOD: {
    id: 'GOOD',
    level: 4,
    icon: icons.good,
    color: colors.good,
    label: 'Bien',
  },
  MIDDLE: {
    id: 'MIDDLE',
    level: 3,
    icon: icons.middle,
    color: colors.middle,
    label: 'Moyen',
  },
  BAD: {
    id: 'BAD',
    level: 2,
    icon: icons.bad,
    color: colors.bad,
    label: 'Mauvais',
  },
  VERY_BAD: {
    id: 'VERY_BAD',
    level: 1,
    icon: icons.veryBad,
    color: colors.veryBad,
    label: 'Très mauvais',
  },
};

export const categories = {
  MOOD: 'MOOD',
  ANXIETY: 'ANXIETY',
  BADTHOUGHTS: 'BADTHOUGHTS',
  SENSATIONS: 'SENSATIONS',
  SLEEP: 'SLEEP',
  DAILYACTIVITIES: 'DAILYACTIVITIES',
  COMMUNICATION: 'COMMUNICATION',
};
export const reliquatCategories = {
  BADTHOUGHTS_FREQUENCE: 'BADTHOUGHTS_FREQUENCE',
  ANXIETY_FREQUENCE: 'ANXIETY_FREQUENCE',
  SENSATIONS_FREQUENCE: 'SENSATIONS_FREQUENCE',
};

export const displayedCategories = {
  MOOD: 'Humeur',
  ANXIETY: 'Anxiété',
  BADTHOUGHTS: 'Idées parasites',
  SLEEP: 'Sommeil',
  SENSATIONS: 'Sensations étranges',
  DAILYACTIVITIES: 'Faire mes activités quotidiennes',
  COMMUNICATION: 'Communication avec mon entourage',
  BADTHOUGHTS_FREQUENCE: 'Idées parasites',
  ANXIETY_FREQUENCE: 'Anxiété',
  SENSATIONS_FREQUENCE: 'Sensations étranges',
};

export const surveyDate = {
  YESTERDAY: {
    id: 'YESTERDAY',
    icon: icons.yesterday,
    color: 'white',
    label: 'Hier',
  },
  TODAY: {
    id: 'TODAY',
    icon: icons.today,
    color: 'white',
    label: "Aujourd'hui",
  },
};

export const frequence = {
  NEVER: {
    id: 'NEVER',
    level: 3,
    icon: icons.veryGood,
    color: colors.veryGood,
    label: 'Jamais',
  },
  SEVERAL_TIMES: {
    id: 'SEVERAL_TIMES',
    level: 2,
    icon: icons.middle,
    color: colors.middle,
    label: 'Plusieurs fois',
  },
  MANY_TIMES: {
    id: 'MANY_TIMES',
    level: 1,
    icon: icons.veryBad,
    color: colors.veryBad,
    label: 'De nombreuses fois',
  },
};

export const intensity = {
  LIGHT: {
    id: 'LIGHT',
    level: 3,
    icon: icons.veryGood,
    color: colors.veryGood,
    label: 'Légèrement pénible',
  },
  MIDDLE: {
    id: 'MIDDLE',
    level: 2,
    icon: icons.middle,
    color: colors.middle,
    label: 'Moyennement pénible',
  },
  HIGH: {
    id: 'HIGH',
    level: 1,
    icon: icons.veryBad,
    color: colors.veryBad,
    label: 'Très pénible',
  },
};

export const DEFAULT_BECK_WHERE_LIST = [
  'À la maison',
  'Au lycée',
  'Dans la rue',
  'Au travail',
];
export const DEFAULT_BECK_WHO_LIST = ['Charles', 'Karim', 'Inès'];
export const DEFAULT_BECK_EMOTION_LIST = [
  'Anxiété',
  'Colère',
  'Tristesse',
  'Peur',
  'Déception',
  'Culpabilité',
  'Solitude',
  'Honte',
  'Frustration',
  'Jalousie',
];
export const DEFAULT_BECK_SENSATION_LIST = [
  'Tête qui tourne',
  'Larmes aux yeux',
  'Gorge serrée',
  'Poids sur la poitrine',
  'Mal au ventre',
  'Coeur qui bat vite',
  'Chaleur',
  'Froid',
  'Tremblements',
  'Nausée',
  'Souffle court',
];

export const BeckStepTitles = [
  'La situation',
  'La situation',
  'Vos émotions',
  'Vos pensées',
  'Comportement et Résultats',
  'Restructuration',
];

export const STORAGE_KEY_SURVEY_RESULTS = '@SURVEY_RESULTS';
export const STORAGE_KEY_START_DATE = '@SURVEY_DATE';
export const STORAGE_KEY_SYMPTOMS = '@SYMPTOMS';
export const STORAGE_KEY_IS_FIRST_LAUNCH = '@IS_FIRST_LAUNCH';
export const STORAGE_KEY_ONBOARDING_STEP = '@ONBOARDING_STEP';
export const STORAGE_KEY_ONBOARDING_DONE = '@ONBOARDING_DONE';
export const STORAGE_KEY_MEDICAL_TREATMENT = '@MEDICAL_TREATMENT';
export const STORAGE_KEY_SUPPORTED = '@SUPPORTED';
export const STORAGE_KEY_CUSTOM_SYMPTOMS = '@CUSTOM_SYMPTOMS';
export const STORAGE_KEY_NOTES_VERSION = '@NOTES_VERSION';
export const STORAGE_KEY_VISIT_PRO_NPS = '@VISIT_PRO_NPS';
export const STORAGE_KEY_CUSTOM_DRUGS = '@CUSTOM_DRUGS';
export const STORAGE_KEY_IS_BECK_ACTIVATED = '@STORAGE_KEY_IS_BECK_ACTIVATED';
export const STORAGE_KEY_BECK_WHERE_LIST = '@BECK_WHERE_LIST';
export const STORAGE_KEY_BECK_WHO_LIST = '@BECK_WHO_LIST';
export const STORAGE_KEY_BECK_EMOTION_LIST = '@BECK_EMOTION_LIST';
export const STORAGE_KEY_BECK_SENSATION_LIST = '@BECK_SENSATION_LIST';
export const STORAGE_KEY_BECK_SHOW_WELCOME = '@BECK_SHOW_WELCOME_DEFAULT';
export const STORAGE_KEY_DIARY_NOTES = '@DIARY_NOTES';
export const STORAGE_KEY_NPS_PRO_CONTACT = '@NPS_PRO_CONTACT';

export const ONBOARDING_STEPS = {
  STEP_CGU: 'STEP_CGU',
  STEP_SUPPORTED: 'STEP_SUPPORTED',
  STEP_SYMPTOMS: 'STEP_SYMPTOMS',
  STEP_DRUGS: 'STEP_DRUGS',
  STEP_REMINDER: 'STEP_REMINDER',
};
