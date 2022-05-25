import React from "react";
import { Linking, Platform, StyleSheet, View, TouchableOpacity } from "react-native";
import VersionCheck from "react-native-version-check";

import ModalBase from "../components/modal/ModalBase";
import Text from "../components/MyText";
import { colors } from "../utils/colors";

export const needUpdate = async () => {
  const res = await VersionCheck.needUpdate();
  return res?.isNeeded;
};

export default () => {
  const [show, setShow] = React.useState(false);

  const getInfosStore = async () => {
    const t = await needUpdate();
    setShow(t);
  };

  React.useEffect(() => {
    getInfosStore();
  }, []);

  return (
    <ModalBase
      onModalHide={() => {}}
      visible={show}
      // maybe later
      // onClick={() => navigation.navigate("news")}
      renderContent={
        <>
          <View style={stylesModal.titleContainer}>
            <Text style={stylesModal.title}>🎉</Text>
            <Text style={stylesModal.title}>Une nouvelle version est disponible !</Text>
          </View>
          <View style={stylesModal.buttonsContainer}>
            <View style={stylesModal.buttonStoreContainer}>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    Platform.OS === "ios"
                      ? "itms-apps://apps.apple.com/FR/app/id1540061393"
                      : "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.monsuivipsy"
                  )
                }
              >
                <Text style={stylesModal.buttonStoreText}>Installer maintenant</Text>
              </TouchableOpacity>
            </View>
            <View style={stylesModal.buttonCancelContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                }}
              >
                <Text style={stylesModal.buttonCancelText}>Plus tard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      }
    />
  );
};

const stylesModal = StyleSheet.create({
  buttonsContainer: {
    alignItems: "center",
    paddingTop: 25,
  },
  buttonStoreContainer: {
    marginVertical: 25,
    backgroundColor: colors.LIGHT_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonStoreText: {
    color: "#ffffff",
    fontSize: 16,
  },
  buttonCancelContainer: {},
  buttonCancelText: {
    color: colors.BLUE,
    textDecorationLine: "underline",
    fontSize: 12,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: colors.BLUE,
    fontWeight: "bold",
  },
});
