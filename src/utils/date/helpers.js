import {format, parseISO} from 'date-fns';
import {fr} from 'date-fns/locale';

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

export const formatDate = (d) => {
  if (!d) return '-';
  const isoDate = parseISO(d);

  return format(isoDate, 'EEEE d MMMM', {locale: fr});
};

export const getTime = (d) => {
  if (!d) return null;
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const timeStringToISODate = (timeString) => {
  if (!timeString) return null;
  const date = new Date();
  const [hours, minutes] = timeString.split(':');
  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
};

export const displayOnlyHourAndMinute = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

export const changeTimezone = (date, ianatz) => {
  // suppose the date is 12:00 UTC
  var invdate = new Date(
    date.toLocaleString('fr-FR', {
      timeZone: ianatz,
    }),
  );
  console.log(invdate);

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime() - diff); // needs to substract
};
