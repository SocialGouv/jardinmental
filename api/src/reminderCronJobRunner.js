require("dotenv").config();
const { prisma } = require("./prisma");
const { capture } = require("./third-parties/sentry");
const { sendNotifications } = require("./third-parties/expo-notifications");

const nowUtc = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
};
const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const executeReminderCronJob = async () => {
  const now = nowUtc();
  const utcTimeHours = now.getUTCHours();
  const utcTimeMinutes = now.getUTCMinutes();
  const utcDayOfWeek = DAYS_OF_WEEK[now.getDay()];

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
  if (mainReminders.length > 0) {
    await sendNotifications({
      pushTokens: mainReminders.map((reminder) => reminder.user?.pushNotifToken).filter(Boolean),
      title: "Comment allez-vous aujourd'hui ?",
      body: "N'oubliez pas de renseigner votre journée dans Jardin Mental 🌿",
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
  if (goalReminders.length > 0) {
    await sendNotifications({
      pushTokens: goalReminders.map((r) => r.reminder?.user?.pushNotifToken).filter(Boolean),
      title: "Vous avez un objectif aujourd'hui 🎯",
      body: "N'oubliez de préciser si vous l'avez réalisé dans Jardin Mental",
    });
  }

  const inactivityReminders = await prisma.reminderUtcDaysOfWeek.findMany({
    where: {
      [utcDayOfWeek]: true,
      reminder: {
        type: "Inactivity",
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
  if (inactivityReminders.length > 0) {
    await sendNotifications({
      pushTokens: inactivityReminders.map((r) => r.reminder?.user?.pushNotifToken).filter(Boolean),
      title: "Comment s'est passée cette semaine ?",
      body: "Prenez le temps de la renseigner sur Jardin Mental",
    });
  }
};

const run = async () => {
  try {
    console.log("Starting reminder cron job");
    await executeReminderCronJob();
    console.log("Reminder cron job completed successfully");
  } catch (error) {
    console.error("Error running reminder cron job:", error);
    capture(error, { level: "error", extra: { name: "reminderCronJob" } });
  } finally {
    process.exit(0);
  }
};

run();
