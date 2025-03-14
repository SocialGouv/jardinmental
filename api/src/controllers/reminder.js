const express = require("express");
const { setDay, setHours, setMinutes } = require("date-fns");
const { zonedTimeToUtc } = require("date-fns-tz");
const { catchErrors } = require("../middlewares/errors");
const { prisma } = require("../prisma");
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
    utcTimeHours: !isNaN(utcTimeHours) ? utcTimeHours : undefined,
    utcTimeMinutes: !isNaN(utcTimeMinutes) ? utcTimeMinutes : undefined,
    utcDaysOfWeek,
  };
};

router.put(
  "/",
  catchErrors(async (req, res) => {
    const { pushNotifToken, type, timeHours, timeMinutes, localId, daysOfWeek, timezone, disabled } = req.body || {};

    if (
      !pushNotifToken ||
      (type !== "Main" && type !== "Goal" && type !== "Inactivity") ||
      (disabled !== true &&
        (!timezone ||
          isNaN(timeHours) ||
          isNaN(timeMinutes) ||
          (type === "Goal" && !localId && !daysOfWeek) ||
          (type === "Inactivity" && !daysOfWeek)))
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

router.put(
  "/refreshPushNotifToken",
  catchErrors(async (req, res) => {
    const { newPushNotifToken, oldPushNotifToken } = req.body || {};

    if (!newPushNotifToken || !oldPushNotifToken) return res.status(400).json({ ok: false, error: "wrong parameters" });

    const user = await prisma.anonymisedUser.findUnique({ where: { pushNotifToken: oldPushNotifToken } });
    if (user) {
      await prisma.anonymisedUser.update({
        where: { id: user.id },
        data: {
          pushNotifToken: newPushNotifToken,
        },
      });
    }

    return res.status(200).send({ ok: true });
  })
);

module.exports = { router };
