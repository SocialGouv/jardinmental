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

const colors = {
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
  ANXIETY_FREQUENCE: 'ANXIETY_FREQUENCE',
  ANXIETY_INTENSITY: 'ANXIETY_INTENSITY',
  BADTHOUGHTS_FREQUENCE: 'BADTHOUGHTS_FREQUENCE',
  BADTHOUGHTS_INTENSITY: 'BADTHOUGHTS_INTENSITY',
  SENSATIONS_FREQUENCE: 'SENSATIONS_FREQUENCE',
  SENSATIONS_INTENSITY: 'SENSATIONS_INTENSITY',
  SLEEP: 'SLEEP',
  NOTES: 'NOTES',
};

export const displayedCategories = {
  MOOD: 'Humeur',
  ANXIETY_FREQUENCE: 'Anxiété',
  BADTHOUGHTS_FREQUENCE: 'Idées parasites',
  SLEEP: 'Sommeil',
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

export const STORAGE_KEY_SURVEY_RESULTS = '@SURVEY_RESULTS';
export const STORAGE_KEY_START_DATE = '@SURVEY_DATE';
export const STORAGE_KEY_SYMPTOMS = '@SYMPTOMS';
export const STORAGE_KEY_IS_FIRST_LAUNCH = '@IS_FIRST_LAUNCH';
export const STORAGE_KEY_MEDICAL_TREATMENT = '@MEDICAL_TREATMENT';
export const STORAGE_KEY_SUPPORTED = '@SUPPORTED';
export const STORAGE_KEY_CUSTOM_SYMPTOMS = '@CUSTOM_SYMPTOMS';
export const STORAGE_KEY_NOTIFICATION_NEWS_VERSION =
  '@NOTIFICATION_NEWS_VERSION';
