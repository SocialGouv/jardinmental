import {categoryStates} from '../common/constants';
import {beforeToday, formatDay, today} from '../services/date/helpers';

export const diaryData = [
  {
    date: formatDay(today),
    patientState: undefined,
  },
  {
    date: formatDay(beforeToday(1)),
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
  {
    date: formatDay(beforeToday(2)),
    patientState: null,
  },
  {
    date: formatDay(beforeToday(3)),
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
  {
    date: formatDay(beforeToday(4)),
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
  {
    date: formatDay(beforeToday(5)),
    patientState: null,
  },
  {
    date: formatDay(beforeToday(6)),
    patientState: {
      mood: categoryStates.GOOD,
      badThought: categoryStates.VERY_GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.VERY_BAD,
      sensations: categoryStates.BAD,
    },
  },
  {
    date: formatDay(beforeToday(7)),
    patientState: {
      mood: categoryStates.VERY_GOOD,
      badThought: categoryStates.GOOD,
      anxiety: categoryStates.BAD,
      sleep: categoryStates.MIDDLE,
      sensations: categoryStates.VERY_BAD,
    },
  },
];
