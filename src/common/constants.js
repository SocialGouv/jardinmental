export const icons = {
  veryGood: 'VeryGoodSvg',
  good: 'GoodSvg',
  middle: 'MiddleSvg',
  bad: 'BadSvg',
  veryBad: 'VeryBadSvg',
  today: 'TodaySvg',
  yesterday: 'YesterdaySvg',
};

const colors = {
  veryGood: '#E2FA80',
  good: '#F0F277',
  middle: '#FCE285',
  bad: '#FCD0A7',
  veryBad: '#FFC0C0',
  veryGoodTrans: '#edfaca',
  goodTrans: '#f1f491',
  middleTrans: '#fbe79c',
  badTrans: '#fbd8b8',
  veryBadTrans: '#fdcccc',
};

export const colorsMap = Object.keys(colors)
  .map((key) => colors[key])
  .reverse();

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
    level: 1,
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
    level: 3,
    icon: icons.veryBad,
    color: colors.veryBad,
    label: 'De nombreuses fois',
  },
};

export const intensity = {
  LIGHT: {
    id: 'LIGHT',
    level: 1,
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
    level: 3,
    icon: icons.veryBad,
    color: colors.veryBad,
    label: 'Très pénible',
  },
};

export const STORAGE_KEY_SURVEY_RESULTS = '@SURVEY_RESULTS';
export const STORAGE_KEY_START_DATE = '@SURVEY_DATE';
