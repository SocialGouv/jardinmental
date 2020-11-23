import {categoryStates, frequence} from '../common/constants';
import {addDays} from 'date-fns';
import {formatDay, oneDay} from '../services/date/helpers';

export const startDate = new Date(Date.now() - 10 * oneDay);

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
};
