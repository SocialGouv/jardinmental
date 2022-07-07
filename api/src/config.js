const { version, mobileAppVersion, mobileAppBuildNumber } = require("../package.json");

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || process.env.NODE_ENV || "development";

const SENTRY_KEY = process.env.SENTRY_KEY || "https://b43d73353b7b48b8857deb69bca98da2@o348403.ingest.sentry.io/2213011";

const VERSION = version;
const MOBILE_VERSION = mobileAppVersion;
const MOBILE_BUILD_NUMBER = mobileAppBuildNumber;
const MINIMUM_MOBILE_BUILD_NUMBER = 116; // manually change this number to force update app

console.log("✍️ ~CONFIG ", {
  PORT,
  ENVIRONMENT,
  SENTRY_KEY,
  VERSION,
  MOBILE_VERSION,
  MOBILE_BUILD_NUMBER,
  MINIMUM_MOBILE_BUILD_NUMBER,
})

module.exports = {
  PORT,
  ENVIRONMENT,
  SENTRY_KEY,
  VERSION,
  MOBILE_VERSION,
  MOBILE_BUILD_NUMBER,
  MINIMUM_MOBILE_BUILD_NUMBER,
};
