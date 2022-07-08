import { Alert, Linking, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { VERSION, BUILD_NUMBER } from "../config";
import API from "../services/api";

const NeedUpdateContext = React.createContext();

export const NeedUpdateContextProvider = ({ children }) => {
  const [needUpdate, setNeedUpdate] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await API.get({ path: "/version" });
      if (response.ok && BUILD_NUMBER !== response.data.MOBILE_BUILD_NUMBER) {
        setNeedUpdate(true);
        Alert.alert(
          `La nouvelle version ${response.data.MOBILE_VERSION}(${response.data.MOBILE_BUILD_NUMBER}) de Ma Tête et Moi est disponible !`,
          `Vous avez la version ${VERSION}(${BUILD_NUMBER}) actuellement sur votre téléphone`,
          [
            {
              text: "Télécharger",
              onPress: () =>
                Linking.openURL(
                  Platform.select({
                    ios: "https://apps.apple.com/fr/app/mon-suivi-psy/id1540061393",
                    android: "https://play.google.com/store/apps/details?id=com.monsuivipsy",
                  })
                ),
            },
            { text: "Plus tard", style: "cancel" },
          ],
          { cancelable: true }
        );
      }
    })();
  }, []);

  return <NeedUpdateContext.Provider value={needUpdate}>{children}</NeedUpdateContext.Provider>;
};

export default NeedUpdateContext;
