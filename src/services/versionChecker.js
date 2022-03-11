import React from "react";
import { Linking, Alert, Platform } from "react-native";
import VersionCheck from "react-native-version-check";

export const needUpdate = async () => {
  const res = await VersionCheck.needUpdate();
  return res.isNeeded;
};

export default () => {
  const [show, setShow] = React.useState(false);

  const getInfosStore = async () => {
    const t = await needUpdate();
    setShow(t);
  };

  React.useEffect(() => {
    if (!show) return;
    Alert.alert("Une nouvelle version est disponible !", "", [
      {
        text: "Installer maintenant",
        onPress: () =>
          Linking.openURL(
            Platform.OS === "ios"
              ? "itms-apps://apps.apple.com/FR/app/id1540061393"
              : "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.monsuivipsy"
          ),
        style: "default",
      },
      {
        text: "Plus tard",
        onPress: () => {
          setShow(false);
        },
        style: "cancel",
      },
    ]);
  }, [show]);

  React.useEffect(() => {
    getInfosStore();
  }, []);

  return null;
};
