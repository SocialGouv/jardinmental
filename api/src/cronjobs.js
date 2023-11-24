const cron = require("node-cron");
const { capture } = require("./third-parties/sentry");
const { CRONJOBS_ENABLED } = require("./config");

const { reminderCronJob } = require("./controllers/reminder");

cron.schedule("* * * * *", async () => {
  // every minute
  launchCronJob("reminder", reminderCronJob);
});

const launchCronJob = async (name, job) => {
  if (CRONJOBS_ENABLED === false) {
    console.log(`should start cronjob ${name} but CRONJOBS_ENABLED=false`);
    return;
  }

  try {
    await job();
  } catch (e) {
    capture(e, { level: "error", extra: { name } });
  }
};
