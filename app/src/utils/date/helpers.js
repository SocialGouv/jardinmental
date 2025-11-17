import { format, parseISO, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import { firstLetterUppercase } from "../../utils/string-util";

export const oneDay = 1000 * 60 * 60 * 24;
export const beforeToday = (offset = 0, date = new Date()) => new Date(Date.parse(date) - offset * oneDay);
export const formatDay = (date) => date.toISOString().split("T")[0];
export const makeSureDate = (date) => {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
};
export const makeSureTimestamp = (date) => {
  if (date instanceof Date) {
    return Date.parse(date);
  }
  return date;
};

export const today = (offset = 0, withTime = false) => {
  if (withTime) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1);
  }
  return dateWithoutTime(new Date(), offset);
};
const dateWithoutTime = (inputDate, offset = 0) => {
  const date = makeSureDate(inputDate);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset, 0, 0, 0);
};

export const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
export const shortMonths = ["Jan.", "Fév.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sep.", "Oct.", "Nov.", "Déc."];

export const getTodaySWeek = (date = new Date()) => {
  const weekDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const firstDay = beforeToday(weekDay, date);
  const lastDay = beforeToday(-(6 - weekDay), date);
  return { firstDay: new Date(firstDay), lastDay: new Date(lastDay) };
};

export const getArrayOfDates = ({ startDate, numberOfDays = null, reverse = false }) => {
  const parsedStartDate = Date.parse(new Date(startDate));
  const dates = [parsedStartDate];
  const lastDay = numberOfDays ? parsedStartDate + numberOfDays * oneDay : Date.parse(new Date(formatDay(new Date())));
  let dateAdded = parsedStartDate;
  while (dateAdded < lastDay) {
    dateAdded = dateAdded + oneDay;
    dates.push(dateAdded);
  }
  const sortedDates = [...dates].map((parsed) => formatDay(new Date(parsed))).sort();
  if (reverse) {
    return sortedDates.reverse();
  }
  return sortedDates;
};

export const getArrayOfDatesFromTo = ({ fromDate, toDate }) => {
  const parsedStartDate = Date.parse(new Date(fromDate));
  const lastDay = Date.parse(new Date(toDate));
  const dates = [parsedStartDate];
  let dateAdded = parsedStartDate;
  while (dateAdded < lastDay) {
    dateAdded = dateAdded + oneDay;
    dates.push(dateAdded);
  }
  const sortedDates = [...dates].map((parsed) => formatDay(new Date(parsed))).sort();
  return sortedDates;
};

export const formatDate = (d, withYear) => {
  if (!d) return "-";
  const isoDate = parseISO(d);

  return format(isoDate, withYear ? "EEEE d MMMM yyyy" : "EEEE d MMMM", { locale: fr });
};

export const formatRelativeDate = (date, withYear) => {
  const isoDate = parseISO(date);
  if (isToday(isoDate)) {
    return "aujourd'hui";
  } else if (isYesterday(isoDate)) {
    return "hier";
  } else {
    return format(isoDate, withYear ? "EEEE d MMMM yyyy" : "EEEE d MMMM", { locale: fr });
  }
};
export const getFirst3LetterWeekDay = (date) => {
  const isoDate = parseISO(date);
  const d = format(isoDate, "EEEE d MMMM", { locale: fr });
  return d.substring(0, 3);
};

export const getTime = (d) => {
  if (!d) return null;
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const timeStringToISODate = (timeString) => {
  if (!timeString) return null;
  const date = new Date();
  const [hours, minutes] = timeString.split(":");
  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
};

export const displayOnlyHourAndMinute = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const changeTimezone = (date, ianatz) => {
  // suppose the date is 12:00 UTC
  var invdate = new Date(
    date.toLocaleString("fr-FR", {
      timeZone: ianatz,
    })
  );
  console.log(invdate);

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime() - diff); // needs to substract
};

export const isAfterToday = (date) => {
  const today = new Date();
  const test = new Date(date);
  return test > today;
};

export const formatDateThread = (date) => {
  const isoDate = parseISO(date);
  if (isToday(isoDate)) {
    return "Aujourd'hui";
  } else if (isYesterday(isoDate)) {
    return "Hier";
  } else {
    const formattedDate = format(isoDate, "EEEE d MMMM", { locale: fr });
    return firstLetterUppercase(formattedDate);
  }
};

export function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

export function formatDateToFrenchNumericFormat(date) {
  return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join("/");
}
