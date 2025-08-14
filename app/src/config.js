// import envConfig from "react-native-config";
import { version, buildNumber } from "../package.json";

const SCHEME = process.env.EXPO_PUBLIC_SCHEME;
const HOST = process.env.EXPO_PUBLIC_HOST;
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV;
const VERSION = version;
const BUILD_NUMBER = buildNumber;

const HMAC_SECRET = process.env.EXPO_PUBLIC_HMAC_SECRET;

export { SCHEME, HOST, APP_ENV, VERSION, BUILD_NUMBER, HMAC_SECRET };
