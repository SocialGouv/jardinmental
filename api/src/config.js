const { version, mobileAppVersion, mobileAppAndroidBuildNumber, mobileAppIosBuildNumber } = require("../package.json");

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || process.env.NODE_ENV || "development";

const SENTRY_KEY = process.env.SENTRY_KEY || "https://b43d73353b7b48b8857deb69bca98da2@o348403.ingest.sentry.io/2213011";

const VERSION = version;
const MOBILE_VERSION = mobileAppVersion;
const MOBILE_ANDROID_BUILD_NUMBER = mobileAppAndroidBuildNumber;
const MOBILE_IOS_BUILD_NUMBER = mobileAppIosBuildNumber;
const MINIMUM_MOBILE_BUILD_NUMBER = 116; // manually change this number to force update app

const DATABASE_URL = process.env.DATABASE_URL;

const CRONJOBS_ENABLED = process.env.CRONJOBS_ENABLED === "true";

const PUSH_NOTIFICATION_GCM_ID = process.env.PUSH_NOTIFICATION_GCM_ID;
const PUSH_NOTIFICATION_APN_KEY = process.env.PUSH_NOTIFICATION_APN_KEY?.replace(/\\n/g, "\n");
const PUSH_NOTIFICATION_APN_KEY_ID = process.env.PUSH_NOTIFICATION_APN_KEY_ID;
const PUSH_NOTIFICATION_APN_TEAM_ID = process.env.PUSH_NOTIFICATION_APN_TEAM_ID;

const TIPIMAIL_API_KEY = process.env.TIPIMAIL_API_KEY;
const TIPIMAIL_API_USER = process.env.TIPIMAIL_API_USER;

const HMAC_SECRET = process.env.HMAC_SECRET;

if (process.env.NODE_ENV === "development") {
  console.log("✍️ ~CONFIG ", {
    PORT,
    ENVIRONMENT,
    SENTRY_KEY,
    VERSION,
    MOBILE_VERSION,
    MOBILE_ANDROID_BUILD_NUMBER,
    MOBILE_IOS_BUILD_NUMBER,
    MINIMUM_MOBILE_BUILD_NUMBER,
    DATABASE_URL,
    CRONJOBS_ENABLED,
    TIPIMAIL_API_KEY,
    TIPIMAIL_API_USER,
    HMAC_SECRET,
  });
}

module.exports = {
  PORT,
  ENVIRONMENT,
  SENTRY_KEY,
  VERSION,
  MOBILE_VERSION,
  MOBILE_ANDROID_BUILD_NUMBER,
  MOBILE_IOS_BUILD_NUMBER,
  MINIMUM_MOBILE_BUILD_NUMBER,
  DATABASE_URL,
  CRONJOBS_ENABLED,
  PUSH_NOTIFICATION_GCM_ID,
  PUSH_NOTIFICATION_APN_KEY,
  PUSH_NOTIFICATION_APN_KEY_ID,
  PUSH_NOTIFICATION_APN_TEAM_ID,
  TIPIMAIL_API_KEY,
  TIPIMAIL_API_USER,
  HMAC_SECRET,
};
