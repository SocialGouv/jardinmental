const { executeReminderCronJob } = require("./reminderCronJob");
const { capture } = require("./third-parties/sentry");

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
