import {categoryStates} from '../common/constants';
import {today} from '../services/date/helpers';
import {subDays} from 'date-fns';

export const fakeDiaryData = [
  {
    date: today,
    patientState: null,
  },
  {
    date: subDays(today, 1),
    patientState: null,
  },
  {
    date: subDays(today, 2),
    patientState: null,
  },
  {
    date: subDays(today, 3),
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
  {
    date: subDays(today, 4),
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
  {
    date: subDays(today, 5),
    patientState: null,
  },
  {
    date: subDays(today, 6),
    patientState: {
      mood: categoryStates.GOOD,
      badThought: categoryStates.VERY_GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.VERY_BAD,
      sensations: categoryStates.BAD,
    },
  },
];
