export const today = new Date();
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
  const weekDay = date.getDay() === 0 ? 7 : date.getDay() - 1;
  const firstDay = beforeToday(weekDay, date);
  const lastDay = beforeToday(-(7 - weekDay), date);
  return { firstDay: new Date(firstDay), lastDay: new Date(lastDay) };
};

export const dateWithTimeAndOffsetFromToday = (hours, minutes, offset) => {
  const date = new Date();
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + offset,
    hours,
    minutes
  );
};

export const timeIsAfterNow = (inputDate) => {
  const date = makeSureDate(inputDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (hours > new Date().getHours()) return true;
  if (hours < new Date().getHours()) return false;
  if (minutes <= new Date().getMinutes()) return false;
  return true;
};
