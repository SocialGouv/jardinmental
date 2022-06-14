import envConfig from "react-native-config";
import { version } from "../package.json";

const SCHEME = envConfig.SCHEME;
const HOST = envConfig.HOST;
const VERSION = version;

export { SCHEME, HOST, VERSION };
