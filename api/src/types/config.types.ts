export interface Config {
  PORT: number;
  ENVIRONMENT: string;
  SENTRY_KEY: string;
  VERSION: string;
  MOBILE_VERSION: string;
  MOBILE_ANDROID_BUILD_NUMBER: number;
  MOBILE_IOS_BUILD_NUMBER: number;
  MINIMUM_MOBILE_BUILD_NUMBER: number;
  DATABASE_URL: string;
  CRONJOBS_ENABLED: boolean;
  PUSH_NOTIFICATION_GCM_ID?: string;
  PUSH_NOTIFICATION_APN_KEY?: string;
  PUSH_NOTIFICATION_APN_KEY_ID?: string;
  PUSH_NOTIFICATION_APN_TEAM_ID?: string;
  TIPIMAIL_API_KEY?: string;
  TIPIMAIL_API_USER?: string;
  HMAC_SECRET?: string;
}

export interface PackageJson {
  version: string;
  mobileAppVersion: string;
  mobileAppAndroidBuildNumber: number;
  mobileAppIosBuildNumber: number;
}
