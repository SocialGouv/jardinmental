import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
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

interface HeaderProps {
  title: string;
  navigation: any;
  scrollY?: Animated.SharedValue<number>;
  scrollThreshold?: number;
}

const Header = ({ title, navigation, scrollY, scrollThreshold = 100 }: HeaderProps) => {
  const needUpdate = useContext(NeedUpdateContext);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
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

  // Animated styles for scroll-based fade out and slide up
  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }

    const opacity = interpolate(scrollY.value, [0, scrollThreshold], [1, 0], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, scrollThreshold], [0, -20], Extrapolate.CLAMP);

    return { opacity, transform: [{ translateY }] };
  });

  const supportButtonAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { opacity: 1, marginLeft: 4 };
    }

    const opacity = interpolate(scrollY.value, [0, scrollThreshold], [1, 0], Extrapolate.CLAMP);
    const width = scrollY.value > 10 ? interpolate(scrollY.value, [0, scrollThreshold], [90, 0], Extrapolate.CLAMP) : "auto";
    const marginLeft = interpolate(scrollY.value, [0, scrollThreshold], [4, 0], Extrapolate.CLAMP);

    return { opacity, width, marginLeft };
  });

  // Animated style for header container to reduce size
  const headerContainerStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { paddingVertical: 8 };
    }

    const paddingVertical = interpolate(scrollY.value, [0, scrollThreshold], [8, 4], Extrapolate.CLAMP);

    return { paddingVertical };
  });

  // Animated style for title container to reduce padding
  const titleContainerStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { paddingVertical: 16 };
    }

    const paddingVertical = interpolate(scrollY.value, [0, scrollThreshold], [16, 0], Extrapolate.CLAMP);
    const height = interpolate(scrollY.value, [0, scrollThreshold], [56, 0], Extrapolate.CLAMP);

    return { paddingVertical, height, overflow: "hidden" };
  });

  return (
    <Animated.View style={[headerContainerStyle]} className="px-4 flex-col pb-4">
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
            onPress={() => {
              navigation.push("infos");
            }}
            className="bg-cnam-primary-900 px-3 py-2 flex-row items-center"
          >
            <MessageHeartCircleIcon />
            <Animated.View style={supportButtonAnimatedStyle}>
              <Text numberOfLines={1} ellipsizeMode="tail" className={mergeClassNames(typography.textSmMedium, "text-white overflow-hidden")}>
                Soutient 24/7
              </Text>
            </Animated.View>
          </SquircleButton>
          <Icon
            color="#fff"
            spin={settingsVisible}
            icon="GearSvg"
            width={16}
            height={16}
            styleContainer={{}}
            onPress={() => setSettingsVisible(true)}
          />
        </View>
      </View>
      <Animated.View style={titleContainerStyle}>
        <Animated.Text style={titleAnimatedStyle} className={mergeClassNames(typography.textLgRegular, "text-white")}>
          {title}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

export default Header;
