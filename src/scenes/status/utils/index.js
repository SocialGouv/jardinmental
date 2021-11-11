import {beforeToday} from '../../../utils/date/helpers';
import {compareAsc, parseISO} from 'date-fns';

export const canEdit = (d) => {
  const limitDate = beforeToday(7);
  const canEditBool = compareAsc(parseISO(d), limitDate) === 1;
  return canEditBool;
};
