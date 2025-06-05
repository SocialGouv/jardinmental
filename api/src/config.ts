import { readFileSync } from 'fs';
import { join } from 'path';

// Read package.json to get version info
const packageJsonPath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

export const PORT = Number(process.env.PORT) || 3000;
export const ENVIRONMENT = process.env.ENVIRONMENT || process.env.NODE_ENV || "development";

export const SENTRY_KEY = process.env.SENTRY_KEY;

export const VERSION = packageJson.version;
export const MOBILE_VERSION = packageJson.mobileAppVersion;
export const MOBILE_ANDROID_BUILD_NUMBER = packageJson.mobileAppAndroidBuildNumber;
export const MOBILE_IOS_BUILD_NUMBER = packageJson.mobileAppIosBuildNumber;
export const MINIMUM_MOBILE_BUILD_NUMBER = 116; // manually change this number to force update app

export const DATABASE_URL = process.env.DATABASE_URL;

export const CRONJOBS_ENABLED = process.env.CRONJOBS_ENABLED === "true";

export const PUSH_NOTIFICATION_GCM_ID = process.env.PUSH_NOTIFICATION_GCM_ID;
export const PUSH_NOTIFICATION_APN_KEY = process.env.PUSH_NOTIFICATION_APN_KEY?.replace(/\\n/g, "\n");
export const PUSH_NOTIFICATION_APN_KEY_ID = process.env.PUSH_NOTIFICATION_APN_KEY_ID;
export const PUSH_NOTIFICATION_APN_TEAM_ID = process.env.PUSH_NOTIFICATION_APN_TEAM_ID;

export const TIPIMAIL_API_KEY = process.env.TIPIMAIL_API_KEY;
export const TIPIMAIL_API_USER = process.env.TIPIMAIL_API_USER;

export const HMAC_SECRET = process.env.HMAC_SECRET;

export const DEBUG_ENDPOINTS_ENABLED = process.env.DEBUG_ENDPOINTS_ENABLED === "true";

if (process.env.NODE_ENV === "development") {
  console.log("✍️ ~CONFIG ", {
    PORT,
    ENVIRONMENT,
    VERSION,
    MOBILE_VERSION,
    MOBILE_ANDROID_BUILD_NUMBER,
    MOBILE_IOS_BUILD_NUMBER,
    MINIMUM_MOBILE_BUILD_NUMBER,
    CRONJOBS_ENABLED,
  });
}
