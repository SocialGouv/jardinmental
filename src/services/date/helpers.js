export const oneDay = 1000 * 60 * 60 * 24;
export const beforeToday = (offset = 0, date = new Date()) =>
  new Date(Date.parse(date) - offset * oneDay);
export const formatDay = (date) => date.toISOString().split('T')[0];

export const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
export const shortMonths = [
  'Jan.',
  'Fév.',
  'Mars',
  'Avr.',
  'Mai',
  'Juin',
  'Juil.',
  'Août',
  'Sep.',
  'Oct.',
  'Nov.',
  'Déc.',
];

export const getTodaySWeek = (date = new Date()) => {
  const weekDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const firstDay = beforeToday(weekDay, date);
  const lastDay = beforeToday(-(6 - weekDay), date);
  return {firstDay: new Date(firstDay), lastDay: new Date(lastDay)};
};

export const getArrayOfDates = ({
  startDate,
  numberOfDays = null,
  reverse = false,
}) => {
  const parsedStartDate = Date.parse(new Date(startDate));
  const dates = [parsedStartDate];
  const lastDay = numberOfDays
    ? parsedStartDate + numberOfDays * oneDay
    : Date.parse(new Date(formatDay(new Date())));
  let dateAdded = parsedStartDate;
  while (dateAdded < lastDay) {
    dateAdded = dateAdded + oneDay;
    dates.push(dateAdded);
  }
  const sortedDates = [...dates]
    .map((parsed) => formatDay(new Date(parsed)))
    .sort();
  if (reverse) {
    return sortedDates.reverse();
  }
  return sortedDates;
};
