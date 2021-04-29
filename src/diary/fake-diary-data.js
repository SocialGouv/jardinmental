import {categoryStates, frequence} from '../common/constants';
import {addDays} from 'date-fns';
import {formatDay, oneDay} from '../services/date/helpers';

const MAX_DAY = 12;
export const startDate = new Date(Date.now() - MAX_DAY * oneDay);

export const fakeDiaryData = {
  [formatDay(startDate)]: null,
  [formatDay(addDays(startDate, 1))]: null,
  [formatDay(addDays(startDate, 2))]: null,
  [formatDay(addDays(startDate, 3))]: {
    MOOD: categoryStates.BAD,
    ANXIETY_FREQUENCE: frequence.SEVERAL_TIMES,
    ANXIETY_INTENSITY: categoryStates.MIDDLE,
    BADTHOUGHTS_FREQUENCE: frequence.MANY_TIMES,
    BADTHOUGHTS_INTENSITY: categoryStates.VERY_GOOD,
    SENSATIONS_FREQUENCE: frequence.NEVER,
    SENSATIONS_INTENSITY: categoryStates.VERY_BAD,
    SLEEP: categoryStates.VERY_GOOD,
    NOTES: 'Test note',
    POSOLOGY: [
      {
        name1: 'Imovane',
        name2: 'Zopiclone',
        values: ['10 mg', '25 mg', '50 mg'],
        value: '10 mg',
      },
      {
        name1: 'Lamictal',
        name2: 'Lamotrigine',
        value: '20 mg',
        values: ['10 mg', '25 mg', '50 mg'],
      },
      {
        name1: 'Mélatonine',
        value: '150 mg',
        values: ['10 mg', '25 mg', '50 mg'],
      },
    ],
  },
  [formatDay(addDays(startDate, 4))]: {
    MOOD: categoryStates.GOOD,
    ANXIETY_FREQUENCE: frequence.NEVER,
    ANXIETY_INTENSITY: categoryStates.GOOD,
    BADTHOUGHTS_FREQUENCE: frequence.SEVERAL_TIMES,
    BADTHOUGHTS_INTENSITY: categoryStates.MIDDLE,
    SENSATIONS_FREQUENCE: frequence.MANY_TIMES,
    SENSATIONS_INTENSITY: categoryStates.BAD,
    SLEEP: categoryStates.VERY_BAD,
    NOTES: null,
  },
  [formatDay(addDays(startDate, 5))]: null,
  [formatDay(addDays(startDate, 6))]: {
    MOOD: categoryStates.VERY_GOOD,
    ANXIETY_FREQUENCE: frequence.MANY_TIMES,
    ANXIETY_INTENSITY: categoryStates.VERY_BAD,
    BADTHOUGHTS_FREQUENCE: frequence.MANY_TIMES,
    BADTHOUGHTS_INTENSITY: categoryStates.VERY_GOOD,
    SENSATIONS_FREQUENCE: frequence.MANY_TIMES,
    SENSATIONS_INTENSITY: categoryStates.GOOD,
    SLEEP: categoryStates.MIDDLE,
    NOTES:
      'This is a very long note. This is a very long note. This is a very long note. This is a very long note. This is a very long note. This is a very long note. This is a very long note. ',
  },
  [formatDay(addDays(startDate, 7))]: {
    MOOD: categoryStates.VERY_GOOD,
    ANXIETY_FREQUENCE: frequence.MANY_TIMES,
    ANXIETY_INTENSITY: categoryStates.VERY_BAD,
    BADTHOUGHTS_FREQUENCE: frequence.MANY_TIMES,
    BADTHOUGHTS_INTENSITY: categoryStates.VERY_GOOD,
    SENSATIONS_FREQUENCE: frequence.MANY_TIMES,
    SENSATIONS_INTENSITY: categoryStates.GOOD,
    SLEEP: categoryStates.MIDDLE,
    NOTES: '',
  },
  [formatDay(addDays(startDate, 8))]: {
    MOOD: categoryStates.VERY_GOOD,
    ANXIETY_FREQUENCE: frequence.MANY_TIMES,
    ANXIETY_INTENSITY: categoryStates.VERY_BAD,
    BADTHOUGHTS_FREQUENCE: frequence.MANY_TIMES,
    BADTHOUGHTS_INTENSITY: categoryStates.VERY_GOOD,
    SENSATIONS_FREQUENCE: frequence.MANY_TIMES,
    SENSATIONS_INTENSITY: categoryStates.GOOD,
    SLEEP: categoryStates.MIDDLE,
    NOTES: {},
  },
  [formatDay(addDays(startDate, 9))]: {
    MOOD: categoryStates.VERY_GOOD,
    ANXIETY_FREQUENCE: frequence.MANY_TIMES,
    ANXIETY_INTENSITY: categoryStates.VERY_BAD,
    BADTHOUGHTS_FREQUENCE: frequence.MANY_TIMES,
    BADTHOUGHTS_INTENSITY: categoryStates.VERY_GOOD,
    SENSATIONS_FREQUENCE: frequence.MANY_TIMES,
    SENSATIONS_INTENSITY: categoryStates.GOOD,
    SLEEP: categoryStates.MIDDLE,
  },
  [formatDay(addDays(startDate, 10))]: {
    MOOD: categoryStates.VERY_GOOD,
    ANXIETY_FREQUENCE: frequence.MANY_TIMES,
    ANXIETY_INTENSITY: categoryStates.VERY_BAD,
    BADTHOUGHTS_FREQUENCE: frequence.MANY_TIMES,
    BADTHOUGHTS_INTENSITY: categoryStates.VERY_GOOD,
    SENSATIONS_FREQUENCE: frequence.MANY_TIMES,
    SENSATIONS_INTENSITY: categoryStates.GOOD,
    SLEEP: categoryStates.MIDDLE,
    NOTES: {notesEvents: "ceci est une note d'event"},
  },
};
