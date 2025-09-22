require("dotenv").config();
const { prisma } = require("./prisma");
const hybridNotificationService = require("./utils/hybridNotificationService");

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
    await hybridNotificationService.sendHybridNotification({
      pushTokens: mainReminders.map((reminder) => reminder.user?.pushNotifToken).filter(Boolean),
      title: "Comment allez-vous aujourd'hui ?",
      body: "N'oubliez pas de renseigner votre journée dans Jardin Mental 🌿",
      type: "reminder_main",
      enableEncryption: true,
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
    // Group reminders by custom message to send batch notifications
    const remindersByMessage = goalReminders.reduce((acc, r) => {
      const customMessage = r.reminder?.customMessage;
      const key = customMessage || "default";
      if (!acc[key]) {
        acc[key] = {
          pushTokens: [],
          customMessage: customMessage,
        };
      }
      if (r.reminder?.user?.pushNotifToken) {
        acc[key].pushTokens.push(r.reminder.user.pushNotifToken);
      }
      return acc;
    }, {});

    // Send notifications for each message group
    for (const [key, group] of Object.entries(remindersByMessage)) {
      if (group.pushTokens.length > 0) {
        await hybridNotificationService.sendHybridNotification({
          pushTokens: group.pushTokens,
          title: "Vous avez un objectif aujourd'hui 🎯",
          body: group.customMessage || "N'oubliez de préciser si vous l'avez réalisé dans Jardin Mental",
          type: "reminder_goal",
          enableEncryption: true,
        });
      }
    }
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
    await hybridNotificationService.sendHybridNotification({
      pushTokens: inactivityReminders.map((r) => r.reminder?.user?.pushNotifToken).filter(Boolean),
      title: "Comment s'est passée cette semaine ?",
      body: "Prenez le temps de la renseigner sur Jardin Mental",
      type: "reminder_inactivity",
      enableEncryption: true,
    });
  }
};

module.exports = { executeReminderCronJob };
