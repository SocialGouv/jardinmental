/* eslint-disable no-extend-native */
/*
Date.prototype.toCustomLocaleString doesn't work natively in Android.
see https://github.com/facebook/react-native/issues/19410

FIXME: check if with Hermes it's working, and check how to use Hermes
see https://facebook.github.io/react-native/docs/hermes


*/
Date.prototype.toCustomLocaleString = function (locale, options) {
  try {
    /*
    options: {
      year: "numeric" || 2-digit
      month: numeric || short || long
      weekday: numeric || short || long
      day: "numeric"
      hour: '2-digit' ,
      minute: '2-digit'
    }
     */
    const months = {
      en: {
        long: [
          'january',
          'february',
          'march',
          'april',
          'may',
          'june',
          'july',
          'august',
          'september',
          'october',
          'november',
          'december',
        ],
        short: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'may',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      fr: {
        long: [
          'janvier',
          'février',
          'mars',
          'avril',
          'mai',
          'juin',
          'juillet',
          'août',
          'septembre',
          'octobre',
          'novembre',
          'decembre',
        ],
        short: [
          'jan.',
          'fév.',
          'mars',
          'avr.',
          'mai',
          'juin',
          'juil.',
          'aoû',
          'sep.',
          'oct.',
          'nov.',
          'dec.',
        ],
      },
    };
    const weekdays = {
      en: {
        long: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        short: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
      },
      fr: {
        long: [
          'dimanche',
          'lundi',
          'mardi',
          'mercredi',
          'jeudi',
          'vendredi',
          'samedi',
        ],
        short: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
      },
    };

    const numeric = 'numeric';
    const twodigits = '2-digit';
    const short = 'short';
    const long = 'long';

    const formattedDate = new Date(this);
    const isValid =
      formattedDate instanceof Date && !isNaN(formattedDate.valueOf());
    if (!isValid) {
      return 'Invalid Date';
    }
    let year = formattedDate.getFullYear();
    let month = formattedDate.getMonth();
    let weekday = formattedDate.getDay();
    let date = formattedDate.getDate();
    let hour = formattedDate.getHours();
    let minute = formattedDate.getMinutes();

    if (!options.year) {
      year = '';
    }
    if (options.year === numeric) {
      // year = year;
    }
    if (options.year === twodigits) {
      year = year.toString().slice(2);
    }

    if (!options.month) {
      month = '';
    }
    if (options.month === numeric) {
      month = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    }
    if (options.month === short) {
      month = months[locale].short[month];
    }
    if (options.month === long) {
      month = months[locale].long[month];
    }

    if (!options.weekday) {
      weekday = '';
    }
    if (options.weekday === numeric) {
      // weekday = weekday;
    }
    if (options.weekday === short) {
      weekday = weekdays[locale].short[weekday];
    }
    if (options.weekday === long) {
      weekday = weekdays[locale].long[weekday];
    }

    if (!options.day) {
      date = '';
    }
    if (options.day === numeric) {
      // date = date;
    }

    if (!options.hour) {
      hour = '';
    }
    if (options.hour === twodigits) {
      hour = hour < 10 ? `0${hour}` : `${hour}`;
    }

    if (!options.minute) {
      minute = '';
    }
    if (options.minute === twodigits) {
      minute = minute < 10 ? `0${minute}` : `${minute}`;
    }

    if (weekday && date && month && minute && hour) {
      switch (locale) {
        default:
        case 'fr':
          // fr: lundi 18 mars à 22:05
          return `${weekday} ${date} ${month} à ${hour}:${minute}`;
        case 'en':
          // en: Monday, March 18, 10:00 PM
          return `${weekday}, ${month} ${date}, ${hour % 12}:${minute} ${
            hour > 11 ? 'PM' : 'AM'
          }`;
      }
    }

    if (minute && hour) {
      switch (locale) {
        default:
        case 'fr':
          // fr: 22:05
          return `${hour}:${minute}`;
        case 'en':
          // en: 10:00 PM
          return `${hour % 12}:${minute} ${hour > 11 ? 'PM' : 'AM'}`;
      }
    }

    if (weekday && year && month && date) {
      switch (locale) {
        default:
        case 'fr':
          // fr: lun. 18 mars 19
          return `${weekday} ${date} ${month} ${year}`;
        case 'en':
          // en: Sat, Jul 13, 19
          return `${weekday}, ${month} ${date}, ${year}`;
      }
    }

    if (weekday && month && date) {
      switch (locale) {
        default:
        case 'fr':
          // fr: samedi 13 juillet
          return `${weekday} ${date} ${month}`;
        case 'en':
          // en: Saturday, July 13
          return `${weekday}, ${month} ${date}`;
      }
    }

    if (month && date) {
      switch (locale) {
        default:
        case 'fr':
          // fr: 13/07
          return `${date}/${month}`;
        case 'en':
          // en: 7/13
          return `${Number(month)}/${date}`;
      }
    }

    if (month && year) {
      return `${month} ${year}`;
    }

    if (weekday) {
      return weekday;
    }
    if (month) {
      return month;
    }
  } catch (e) {
    console.log('toCustomLocaleString error', e);
    return this;
  }
};

Date.prototype.getLocalePureTime = function (locale) {
  return new Date(this).toCustomLocaleString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

Date.prototype.getLocaleTime = function (locale) {
  return (
    'à ' +
    new Date(this).toCustomLocaleString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
};
Date.prototype.getLocaleDate = function (locale) {
  return new Date(this).toCustomLocaleString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};
