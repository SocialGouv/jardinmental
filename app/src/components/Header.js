import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Icon from "./Icon";
import Text from "./MyText";
import Settings from "../scenes/settings/settings-modal";
import Drawer from "./drawer";
import { useIsFocused } from "@react-navigation/native";
import { getBadgeNotesVersion } from "../scenes/news";
import localStorage from "../utils/localStorage";
import NeedUpdateContext from "../context/needUpdate";

const Header = ({ title, navigation }) => {
  const needUpdate = useContext(NeedUpdateContext);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState();
  const [badge, setBadge] = useState(false);

  const updateBadge = useCallback(async () => {
    const news = await getBadgeNotesVersion();
    const supported = await localStorage.getSupported();
    const badgeProNPS = await localStorage.getVisitProNPS();
    setBadge(needUpdate || news || (supported === "PRO" && !badgeProNPS));
  }, [needUpdate]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) updateBadge();
  }, [isFocused, updateBadge]);

  return (
    <View style={styles.container}>
      <Settings visible={settingsVisible} navigation={navigation} onClick={() => setSettingsVisible(false)} />
      <Drawer
        visible={drawerVisible}
        navigation={navigation}
        onClick={() => {
          updateBadge();
          setDrawerVisible(false);
        }}
      />
      <Icon color="#fff" badge={badge} icon="BurgerSvg" width={20} height={20} onPress={() => setDrawerVisible(true)} />
      <Text style={styles.title}>{title}</Text>
      <Icon color="#fff" spin={settingsVisible} icon="GearSvg" width={25} height={25} onPress={() => setSettingsVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    // backgroundColor: "transparent",
    marginRight: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 5,
  },
  title: {
    textAlign: "center",
    fontSize: Dimensions.get("window").width > 380 ? 15 : 14,
    fontFamily: "SourceSans3-Bold",
    fontWeight: "500",
    color: "#fff",
    marginRight: "auto",
    flex: 1,
  },
});

export default Header;
