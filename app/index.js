import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "./src/utils/date/polyfill";

AppRegistry.registerComponent(appName, () => App);
