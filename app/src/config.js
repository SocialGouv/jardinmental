// import envConfig from "react-native-config";
import {version, buildNumber} from '../package.json';

// const SCHEME = envConfig.SCHEME;
// const HOST = envConfig.HOST;
// const APP_ENV = envConfig.APP_ENV;
const SCHEME = process.env.EXPO_PUBLIC_SCHEME;
const HOST = process.env.EXPO_PUBLIC_HOST;
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV;
const VERSION = version;
const BUILD_NUMBER = buildNumber;
// const TIPIMAIL_API_KEY = envConfig.TIPIMAIL_API_KEY;
// const TIPIMAIL_API_USER = envConfig.TIPIMAIL_API_USER;

export {SCHEME, HOST, APP_ENV, VERSION, BUILD_NUMBER};
