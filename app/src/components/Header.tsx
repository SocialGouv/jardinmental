import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import Settings from "../scenes/settings/settings-modal";
import Drawer from "./drawer";
import { useIsFocused } from "@react-navigation/native";
import { getBadgeNotesVersion } from "../scenes/news";
import localStorage from "../utils/localStorage";
import NeedUpdateContext from "../context/needUpdate";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import HorizontalDots from "@assets/svg/icon/HorizontalDots";
import MessageHeartCircleIcon from "@assets/svg/icon/MessageHeartCircle";
import { SquircleButton } from "expo-squircle-view";
import { TW_COLORS } from "@/utils/constants";

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
    <View style={styles.container} className="px-4 flex-col py-2">
      <Settings visible={settingsVisible} navigation={navigation} onClick={() => setSettingsVisible(false)} />
      <Drawer
        visible={drawerVisible}
        navigation={navigation}
        onClick={() => {
          updateBadge();
          setDrawerVisible(false);
        }}
      />
      <View className="flex-row justify-between items-center w-full">
        <TouchableOpacity
          onPress={() => {
            setDrawerVisible(true);
          }}
          className="border border-[1.5] border-cnam-primary-400 px-3 py-2 rounded-full flex-row space-x-1 items-center"
        >
          <HorizontalDots color={TW_COLORS.CNAM_PRIMARY_25} />
          <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-25")}>Plus d'info</Text>
        </TouchableOpacity>
        {/* <Text style={styles.title}>{title}</Text> */}
        <View className="flex-row">
          <SquircleButton
            cornerSmoothing={100}
            preserveSmoothing={true}
            borderRadius={16}
            className="bg-cnam-primary-900 px-3 py-2 flex-row space-x-1 items-center"
          >
            <MessageHeartCircleIcon />
            <Text className={mergeClassNames(typography.textSmMedium, "text-white")}>Soutient 24/7</Text>
          </SquircleButton>
          <Icon color="#fff" spin={settingsVisible} icon="GearSvg" width={16} height={16} onPress={() => setSettingsVisible(true)} />
        </View>
      </View>
      {/* <View className="py-4">
        <Text className={mergeClassNames(typography.textLgRegular, "text-white")}>Mes obervations</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 0,
    // backgroundColor: "transparent",
    // marginRight: "auto",
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // paddingBottom: 5,
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
