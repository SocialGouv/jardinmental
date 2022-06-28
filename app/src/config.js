import envConfig from "react-native-config";
import { version, buildNumber } from "../package.json";

const SCHEME = envConfig.SCHEME;
const HOST = envConfig.HOST;
const VERSION = version;
const BUILD_NUMBER = buildNumber;
const TIPIMAIL_API_KEY = envConfig.TIPIMAIL_API_KEY;
const TIPIMAIL_API_USER = envConfig.TIPIMAIL_API_USER;

export { SCHEME, HOST, VERSION, BUILD_NUMBER, TIPIMAIL_API_KEY, TIPIMAIL_API_USER };
