import {categoryStates} from '../constants';

export const diaryData = [
  {
    date: "Aujourd'hui",
    patientState: undefined,
  },
  {
    date: 'Hier',
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
  {
    date: 'Vendredi',
    patientState: null,
  },
  {
    date: 'Jeudi',
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
  {
    date: 'Mercredi',
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
];
