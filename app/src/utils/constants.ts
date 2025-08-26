import { OnboardingStep } from "@/scenes/onboarding-v2/types";
import { colors as mainColors } from "./colors";
import { INDICATORS_CATEGORIES } from "@/entities/IndicatorCategories";

export const icons = {
  veryGood: "VeryGoodSvg",
  good: "GoodSvg",
  middle: "MiddleSvg",
  bad: "BadSvg",
  veryBad: "VeryBadSvg",
  today: "TodaySvg",
  yesterday: "YesterdaySvg",
  notes: "NotesSvg",
};

export const EMOTION_COLORS = {
  // bg
  // veryBad: "#F4A6A6",//"#F16B6B",
  // bad: "#FDD6A5",//"#FEAA5B",
  // middle: "#FFF4B2",//"#F2F478",
  // good: "#D0F0C0",//"#ACF352",
  // veryGood: "#A8E6CF",//"#5DEE5A",
  //
  veryBadTrans: "#fdcccc",
  badTrans: "#fbd8b8",
  middleTrans: "#fbe79c",
  goodTrans: "#f1f491",
  veryGoodTrans: "#edfaca",

  veryBad: "#F3A3CD", // "#822F2F", //"#840707",
  bad: "#F3B9B0", //"#91501A", //"#744519",
  middle: "#F9E1A7", //"#91501A",//"#6C630C",
  good: "#BBE7C6", //'#317535',//"#496300",
  veryGood: "#99DDDD", //'#21896B',//"#1A6300",
};

export const iconBorderColors = {
  veryBad: "#822F2F", //"#D13E3E",
  bad: "#862F22", //"#E7770F",
  middle: "#862F22", //"#F0DF49",
  good: "#224E2D", //"#7CCF12",
  veryGood: "#004439", //"#0FC321",
};

export const iconColors = {
  veryBad: "#822F2F", //"#840707",
  bad: "#91501A", //"#744519",
  middle: "#91501A", //"#6C630C",
  good: "#317535", //"#496300",
  veryGood: "#21896B", //"#1A6300",

  // veryBad: "#F3A3CD", // "#822F2F", //"#840707",
  // bad: '#F3B9B0',//"#91501A", //"#744519",
  // middle: '#F9E1A7',//"#91501A",//"#6C630C",
  // good: '#BBE7C6',//'#317535',//"#496300",
  // veryGood: '#99DDDD'//'#21896B',//"#1A6300",
};

export const scoresMapIcon = {
  "-1": {
    color: "transparent",
  },
  1: {
    color: EMOTION_COLORS.veryBad,
    faceIcon: icons.veryBad,
    borderColor: iconBorderColors.veryBad,
    iconColor: iconColors.veryBad,
  },
  2: {
    color: EMOTION_COLORS.bad,
    faceIcon: icons.bad,
    borderColor: iconBorderColors.bad,
    iconColor: iconColors.bad,
  },
  3: {
    color: EMOTION_COLORS.middle,
    faceIcon: icons.middle,
    borderColor: iconBorderColors.middle,
    iconColor: iconColors.middle,
  },
  4: {
    color: EMOTION_COLORS.good,
    faceIcon: icons.good,
    borderColor: iconBorderColors.good,
    iconColor: iconColors.good,
  },
  5: {
    color: EMOTION_COLORS.veryGood,
    faceIcon: icons.veryGood,
    borderColor: iconBorderColors.veryGood,
    iconColor: iconColors.veryGood,
  },
};

export const colorsMap = Object.keys(EMOTION_COLORS).map((key) => EMOTION_COLORS[key]);

export const categoryStates = {
  VERY_GOOD: {
    id: "VERY_GOOD",
    level: 5,
    icon: icons.veryGood,
    color: EMOTION_COLORS.veryGood,
    label: "Très bien",
  },
  GOOD: {
    id: "GOOD",
    level: 4,
    icon: icons.good,
    color: EMOTION_COLORS.good,
    label: "Bien",
  },
  MIDDLE: {
    id: "MIDDLE",
    level: 3,
    icon: icons.middle,
    color: EMOTION_COLORS.middle,
    label: "Moyen",
  },
  BAD: {
    id: "BAD",
    level: 2,
    icon: icons.bad,
    color: EMOTION_COLORS.bad,
    label: "Mauvais",
  },
  VERY_BAD: {
    id: "VERY_BAD",
    level: 1,
    icon: icons.veryBad,
    color: EMOTION_COLORS.veryBad,
    label: "Très mauvais",
  },
};

export const categories = {
  MOOD: "MOOD",
  ANXIETY: "ANXIETY",
  BADTHOUGHTS: "BADTHOUGHTS",
  SENSATIONS: "SENSATIONS",
  SLEEP: "SLEEP",
  DAILYACTIVITIES: "DAILYACTIVITIES",
  COMMUNICATION: "COMMUNICATION",
};
export const reliquatCategories = {
  BADTHOUGHTS_FREQUENCE: "BADTHOUGHTS_FREQUENCE",
  ANXIETY_FREQUENCE: "ANXIETY_FREQUENCE",
  SENSATIONS_FREQUENCE: "SENSATIONS_FREQUENCE",
};

export const displayedCategories = {
  MOOD: "Humeur",
  ANXIETY: "Anxiété",
  BADTHOUGHTS: "Idées parasites",
  SLEEP: "Sommeil",
  SENSATIONS: "Sensations étranges",
  DAILYACTIVITIES: "Faire mes activités quotidiennes",
  COMMUNICATION: "Communication avec mon entourage",
  BADTHOUGHTS_FREQUENCE: "Idées parasites",
  ANXIETY_FREQUENCE: "Anxiété",
  SENSATIONS_FREQUENCE: "Sensations étranges",
};

export const translateCategories = {
  MOOD: "Humeur",
  ANXIETY: "Anxiété",
  BADTHOUGHTS: "Idées parasites",
  SLEEP: "Sommeil",
  SENSATIONS: "Sensations étranges",
  DAILYACTIVITIES: "Faire mes activités quotidiennes",
  COMMUNICATION: "Communication avec mon entourage",
  TOXIC: "Substance",
  CONTEXT: "Contexte",
  [INDICATORS_CATEGORIES["Emotions/sentiments"]]: "vos émotions",
  [INDICATORS_CATEGORIES["Manifestations physiques"]]: "votre sommeil",
  [INDICATORS_CATEGORIES["Pensées"]]: "vos pensées",
  [INDICATORS_CATEGORIES["Comportements"]]: "vos comportements",
};

export const surveyDate = {
  YESTERDAY: {
    id: "YESTERDAY",
    icon: icons.yesterday,
    color: "white",
    label: "Hier",
  },
  TODAY: {
    id: "TODAY",
    icon: icons.today,
    color: "white",
    label: "Aujourd'hui",
  },
};

export const frequence = {
  NEVER: {
    id: "NEVER",
    level: 3,
    icon: icons.veryGood,
    color: EMOTION_COLORS.veryGood,
    label: "Jamais",
  },
  SEVERAL_TIMES: {
    id: "SEVERAL_TIMES",
    level: 2,
    icon: icons.middle,
    color: EMOTION_COLORS.middle,
    label: "Plusieurs fois",
  },
  MANY_TIMES: {
    id: "MANY_TIMES",
    level: 1,
    icon: icons.veryBad,
    color: EMOTION_COLORS.veryBad,
    label: "De nombreuses fois",
  },
};

export const intensity = {
  LIGHT: {
    id: "LIGHT",
    level: 3,
    icon: icons.veryGood,
    color: EMOTION_COLORS.veryGood,
    label: "Légèrement pénible",
  },
  MIDDLE: {
    id: "MIDDLE",
    level: 2,
    icon: icons.middle,
    color: EMOTION_COLORS.middle,
    label: "Moyennement pénible",
  },
  HIGH: {
    id: "HIGH",
    level: 1,
    icon: icons.veryBad,
    color: EMOTION_COLORS.veryBad,
    label: "Très pénible",
  },
};

export const DEFAULT_BECK_WHERE_LIST = ["À la maison", "Au lycée", "Dans la rue", "Au travail"];
export const DEFAULT_BECK_WHO_LIST = ["Charles", "Karim", "Inès"];
export const DEFAULT_BECK_EMOTION_LIST = [
  "Anxiété",
  "Colère",
  "Tristesse",
  "Peur",
  "Déception",
  "Culpabilité",
  "Solitude",
  "Honte",
  "Frustration",
  "Jalousie",
];
export const DEFAULT_BECK_SENSATION_LIST = [
  "Tête qui tourne",
  "Larmes aux yeux",
  "Gorge serrée",
  "Poids sur la poitrine",
  "Mal au ventre",
  "Coeur qui bat vite",
  "Chaleur",
  "Froid",
  "Tremblements",
  "Nausée",
  "Souffle court",
];

export const BeckStepTitles = ["La situation", "La situation", "Vos émotions", "Vos pensées", "Comportement et Résultats", "Restructuration"];

export const STORAGE_KEY_SURVEY_RESULTS = "@SURVEY_RESULTS";
export const STORAGE_KEY_START_DATE = "@SURVEY_DATE";
export const STORAGE_KEY_SYMPTOMS = "@SYMPTOMS";
export const STORAGE_KEY_GOALS = "@GOALS_TMP";
export const STORAGE_KEY_INDICATEURS = "@INDICATEURS";
export const STORAGE_KEY_IS_FIRST_LAUNCH = "@IS_FIRST_LAUNCH";
export const STORAGE_KEY_ONBOARDING_STEP = "@ONBOARDING_STEP";
export const STORAGE_KEY_ONBOARDING_DONE = "@ONBOARDING_DONE";
export const STORAGE_KEY_MEDICAL_TREATMENT = "@MEDICAL_TREATMENT";
export const STORAGE_KEY_SUPPORTED = "@SUPPORTED";
export const STORAGE_KEY_CUSTOM_SYMPTOMS = "@CUSTOM_SYMPTOMS";
export const STORAGE_KEY_NOTES_VERSION = "@NOTES_VERSION";
export const STORAGE_KEY_VISIT_PRO_NPS = "@VISIT_PRO_NPS";
export const STORAGE_KEY_CUSTOM_DRUGS = "@CUSTOM_DRUGS";
export const STORAGE_KEY_IS_BECK_ACTIVATED = "@STORAGE_KEY_IS_BECK_ACTIVATED";
export const STORAGE_KEY_BECK_WHERE_LIST = "@BECK_WHERE_LIST";
export const STORAGE_KEY_BECK_WHO_LIST = "@BECK_WHO_LIST";
export const STORAGE_KEY_BECK_EMOTION_LIST = "@BECK_EMOTION_LIST";
export const STORAGE_KEY_BECK_SENSATION_LIST = "@BECK_SENSATION_LIST";
export const STORAGE_KEY_BECK_SHOW_WELCOME = "@BECK_SHOW_WELCOME_DEFAULT";
export const STORAGE_KEY_DIARY_NOTES = "@DIARY_NOTES";
export const STORAGE_KEY_NPS_PRO_CONTACT = "@NPS_PRO_CONTACT";
export const STORAGE_KEY_CHECKLIST_BANNER_DISMISSED = "@CHECKLIST_BANNER_DISMISSED";
export const STORAGE_KEY_CHECKLIST_BANNER_STATE = "@CHECKLIST_BANNER_STATE";
export const STORAGE_KEY_PUSH_NOTIFICATION_TOKEN = "@PUSH_NOTIFICATION_TOKEN";
export const STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR = "@PUSH_NOTIFICATION_TOKEN_ERROR";
export const STORAGE_KEY_REMOVING_TOXIC_QUESTION_FROM_SURVEY_MIGRATION_DONE = "@REMOVING_TOXIC_QUESTION_FROM_SURVEY_MIGRATION_DONE";

// Checklist banner configuration
export const CHECKLIST_BANNER_CONFIG = {
  MAX_DISMISSALS: 5,
  BASE_DELAY_DAYS: 1,
};

export const ONBOARDING_STEPS = {
  STEP_CGU: "STEP_CGU",
  STEP_SUPPORTED: "STEP_SUPPORTED",
  STEP_SYMPTOMS: "STEP_SYMPTOMS",
  STEP_SYMPTOMS_SLEEP: "STEP_SYMPTOMS_SLEEP",
  STEP_SYMPTOMS_CUSTOM: "STEP_SYMPTOMS_CUSTOM",
  STEP_GOALS: "STEP_GOALS",
  STEP_HINT: "STEP_HINT",
  STEP_DRUGS: "STEP_DRUGS",
  STEP_REMINDER: "STEP_REMINDER",
  STEP_EXPLANATION: "STEP_EXPLANATION",
};

export const MATOMO_DIMENSION = {
  VERSION: 1,
  SYSTEM: 2,
  SUPPORTED: 3,
};

export const STEP_ORDER: OnboardingStep[] = ["INTRO", "PROFILE", "CAROUSEL", "DIFFICULTIES", "OBJECTIVE", "CHECKIN"];

export const TOTAL_STEPS = STEP_ORDER.length;

// Colors
export const TW_COLORS = {
  PRIMARY: "#3D6874", //mainColors.LIGHT_BLUE,
  SECONDARY: "#12747D", //'#00CEF7',
  POSITIVE: "#5DEE5A", // positive for action relative to mental health !== 'success action in app'
  NEGATIVE: "#F16B6B", // negative feeling for action relative to mental health
  // SUCCESS: "#5DEE5A", //#4CAF50',
  WARNING: "#FF9800",
  // ERROR: "#F44336",
  BACKGROUND: "#F5F5F5",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  GRAY_LIGHT: "#E0E0E0",
  GRAY_MEDIUM: "#9E9E9E",
  GRAY_DARK: "#424242",
  TEXT_PRIMARY: "#3D6874", //'#212121',
  TEXT_SECONDARY: "#757575",
  LIGHT_COLORS: "#3D6874",
  LIGHT_BLUE: "#EBFDFF",
  BRAND_800: "#12747D",
  BRAND_700: "#158993",
  BRAND_600: "#1CB2BF",
  BRAND_500: "#1FC6D5",
  CNAM_CYAN_DARKEN_20: "#0084B2",
  CNAM_CYAN_LIGHTEN_80: "#CCEDF9",
  CNAM_CYAN_200_LIGHTEN_60: "#99DBF2",
  CNAM_CYAN_50_LIGHTEN_90: "#E5F6FC",
  CNAM_CYAN_600_DARKEN_20: "#0084B2",
  CNAM_CYAN_700_DARKEN_40: "#006386",
  CNAM_CYAN_100_LIGHTEN_80: "#CCEDF9",
  CNAM_CYAN_0: "#00A5DF",
  CNAM_PRIMARY_900: "#134449",
  CNAM_PRIMARY_700: "#518B9A",
  BEIGE: "#FCEBD9",
  GRAY_800: "#4A5D5F",
  GRAY_700: "#617778",
  GRAY_200: "#627577ff",
  GRAY_600: "#799092",
  GRAY_950: "#093F43",
  GRAY_50: "#F7FCFD",
  GRAY_400: "#ACC3C5",
  BRAND_25: "#FAFFFF",
  BRAND_900: "#3D6874",
  SUCCESS: {
    TEXT: "#224E2D",
    BG: "#DDF3E3",
    BG_DARKEN: "#BBE7C6",
  },
  ERROR: {
    BG: "#F9DCD7",
    TEXT: "#5A2017",
  },
};

export const SHARED_HEADER = false;
export const HEADER_WITH_BANNER = false;
export const PROGRESS_BAR = true;
export const PROGRESS_BAR_AND_HEADER = true;
