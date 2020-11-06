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

export const displayedCategories = {
  mood: 'Humeur',
  anxiety: 'Anxiété',
  badThoughts: 'Idées parasites',
  sleep: 'Sommeil',
  sensations: 'Sensations étranges',
};

export const categories = {
  mood: 'mood',
  'anxiety-frequence': 'anxiety-frequence',
  'anxiety-intensity': 'anxiety-intensity',
  'badThoughts-frequence': 'badThoughts-frequence',
  'badThoughts-intensity': 'badThoughts-intensity',
  'sensations-frequence': 'sensations-frequence',
  'sensations-intensity': 'sensations-intensity',
  sleep: 'sleep',
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
