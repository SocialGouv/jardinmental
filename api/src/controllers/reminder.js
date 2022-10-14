const express = require("express");
const { setDay, setHours, setMinutes } = require("date-fns");
const { zonedTimeToUtc } = require("date-fns-tz");
const { catchErrors } = require("../middlewares/errors");
const { prisma } = require("../prisma");
const { capture } = require("../third-parties/sentry");
const { sendNotification } = require("../third-parties/pushNotification");
const router = express.Router();

const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const nowUtc = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
};

const toUtcData = ({ timeHours, timeMinutes, daysOfWeek, timezone }) => {
  let time = nowUtc();
  time = setHours(time, timeHours);
  time = setMinutes(time, timeMinutes);
  const utcTime = zonedTimeToUtc(time, timezone);
  const utcTimeHours = utcTime.getUTCHours();
  const utcTimeMinutes = utcTime.getUTCMinutes();

  let utcDaysOfWeek = undefined;
  if (daysOfWeek) {
    utcDaysOfWeek = {};
    for (const dayOfWeek of DAYS_OF_WEEK) {
      const dayOfWeekIndex = DAYS_OF_WEEK.indexOf(dayOfWeek);
      let date = nowUtc();
      date = setHours(date, timeHours);
      date = setMinutes(date, timeMinutes);
      date = setDay(date, dayOfWeekIndex);
      const utcDate = zonedTimeToUtc(date, timezone);
      const utcDayOfWeekIndex = utcDate.getDay();
      if (utcDayOfWeekIndex === dayOfWeekIndex) {
        utcDaysOfWeek = {
          ...daysOfWeek,
        };
        break;
      } else {
        const utcDayOfWeek = DAYS_OF_WEEK[utcDayOfWeekIndex];
        utcDaysOfWeek[utcDayOfWeek] = daysOfWeek[dayOfWeek] || false;
      }
    }
  }

  return {
    utcTimeHours,
    utcTimeMinutes,
    utcDaysOfWeek,
  };
};

router.put(
  "/",
  catchErrors(async (req, res) => {
    const { pushNotifToken, type, timeHours, timeMinutes, localId, daysOfWeek, timezone, disabled } = req.body || {};

    if (
      !pushNotifToken ||
      (type !== "Main" && type !== "Goal") ||
      !timezone ||
      isNaN(timeHours) ||
      isNaN(timeMinutes) ||
      (type === "Goal" && !localId && !daysOfWeek)
    )
      return res.status(400).json({ ok: false, error: "wrong parameters" });

    const { utcTimeHours, utcTimeMinutes, utcDaysOfWeek } = toUtcData({ timeHours, timeMinutes, daysOfWeek, timezone });

    let user = await prisma.anonymisedUser.findUnique({ where: { pushNotifToken } });
    if (!user) {
      user = await prisma.anonymisedUser.create({
        data: {
          pushNotifToken,
        },
      });
    }

    const reminderUpdatedData = (createOrUpdate) => ({
      utcTimeHours,
      utcTimeMinutes,
      utcDaysOfWeek: utcDaysOfWeek
        ? createOrUpdate === "create"
          ? { create: utcDaysOfWeek }
          : { upsert: { create: utcDaysOfWeek, update: utcDaysOfWeek } }
        : undefined,
      type,
      localId,
      disabled,
    });
    let reminder = await prisma.reminder.findFirst({
      where: {
        userId: user.id,
        type,
        localId,
      },
    });
    if (!reminder) {
      reminder = await prisma.reminder.create({
        data: {
          user: { connect: { id: user.id } },
          ...reminderUpdatedData("create"),
        },
        include: {
          utcDaysOfWeek: true,
        },
      });
    } else {
      reminder = await prisma.reminder.update({
        where: { id: reminder.id },
        data: reminderUpdatedData("update"),
        include: {
          utcDaysOfWeek: true,
        },
      });
    }

    return res.status(200).send({ ok: true, reminder });
  })
);

const reminderCronJob = async (req, res) => {
  const now = nowUtc();
  const utcTimeHours = now.getUTCHours();
  const utcTimeMinutes = now.getUTCMinutes();
  const utcDayOfWeek = DAYS_OF_WEEK[now.getDay()];
  console.log(utcDayOfWeek, utcTimeHours, utcTimeMinutes);

  const mainReminders = await prisma.reminder.findMany({
    where: {
      type: "Main",
      disabled: false,
      utcTimeHours,
      utcTimeMinutes,
    },
    include: {
      user: true,
    },
  });
  for (const reminder of mainReminders) {
    if (!reminder?.user?.pushNotifToken) continue;
    sendNotification({
      pushNotifToken: reminder.user.pushNotifToken,
      title: "Comment allez-vous aujourd’hui ?",
      body: "N’oubliez pas de renseigner votre journée dans Jardin Mental",
      clickAction: "jardinmental://reminder",
      topic: "Rappel général",
    });
  }

  const goalReminders = await prisma.reminderUtcDaysOfWeek.findMany({
    where: {
      [utcDayOfWeek]: true,
      reminder: {
        type: "Goal",
        disabled: false,
        utcTimeHours,
        utcTimeMinutes,
      },
    },
    include: {
      reminder: {
        include: {
          user: true,
        },
      },
    },
  });
  for (const { reminder } of goalReminders) {
    if (!reminder?.user?.pushNotifToken) continue;
    sendNotification({
      pushNotifToken: reminder.user.pushNotifToken,
      title: "Vous avez un objectif aujourd’hui 🎯",
      body: "N’oubliez de préciser si vous l’avez réalisé dans Jardin Mental",
      clickAction: "jardinmental://goals",
      topic: "Rappel d'objectif",
    });
  }
};

module.exports = { router, reminderCronJob };
