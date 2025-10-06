import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SquircleButton, SquircleView } from "expo-squircle-view";

import Status from "@/scenes/status";
import Exercise from "@/scenes/exercise";
import Suivi from "@/scenes/suivi";
import Resources from "@/scenes/resources";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import StatusBarColor from "@/components/StatusBar";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import BookOpenIcon from "@assets/svg/icon/BookOpen";
import { typography } from "@/utils/typography";
import TrendUpIcon from "@assets/svg/icon/TrendUp";
import WaveIcon from "@assets/svg/icon/Wave";
import CloudIcon from "@assets/svg/icon/Cloud";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();

const Tabs = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { setCustomColor } = useStatusBar();
  const [activeTab, setActiveTab] = useState("Status");
  const [hasVisitedResources, setHasVisitedResources] = React.useState(true); // Default to true to avoid flash

  React.useEffect(() => {
    const checkResourcesVisited = async () => {
      try {
        const visited = await AsyncStorage.getItem("hasVisitedResources");
        setHasVisitedResources(visited === "true");
      } catch (_error) {
        setHasVisitedResources(true);
      }
    };
    checkResourcesVisited();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );

  const startSurvey = async () => {
    const user_indicateurs = await localStorage.getIndicateurs();
    logEvents._deprecatedLogFeelingStart();
    if (!user_indicateurs) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day", {
        origin: "no_data_screen",
      });
    }
  };

  const tabs = [
    {
      name: "Status",
      label: "Observations",
      icon: WaveIcon,
      component: Status,
    },
    {
      name: "Calendar",
      label: "Analyses",
      icon: TrendUpIcon,
      component: Suivi,
      onPress: () => logEvents.logOpenAnalysisMain(),
    },
    {
      name: "Resources",
      label: "Ressources",
      icon: BookOpenIcon,
      component: Resources,
      badge: hasVisitedResources,
      onPress: async () => {
        logEvents.logOpenedRessources();
        if (!hasVisitedResources) {
          try {
            await AsyncStorage.setItem("hasVisitedResources", "true");
            setHasVisitedResources(true);
          } catch (_error) {
            console.error(_error);
          }
        }
      },
    },
    {
      name: "Exercise",
      label: "Beck",
      icon: CloudIcon,
      component: Exercise,
    },
  ];

  const renderTabContent = () => {
    const currentTab = tabs.find((tab) => tab.name === activeTab);
    if (!currentTab) return null;

    const Component = currentTab.component;
    const props = { navigation, route, startSurvey };

    return (
      <View style={{ paddingTop: insets.top, flex: 1 }}>
        <StatusBarColor />
        <Component {...props} />
      </View>
    );
  };

  const handleTabPress = (tabName) => {
    const tab = tabs.find((t) => t.name === tabName);
    if (tab?.onPress) {
      tab.onPress();
    }
    setActiveTab(tabName);
  };
  return (
    <View style={{ flex: 1 }}>
      {/* Content area with padding bottom to avoid overlap with floating navbar */}
      <View style={{ flex: 1 }}>{renderTabContent()}</View>
      {/* Floating Tab Bar */}
      <View
        style={{
          position: "absolute",
          // when there is no insets bottom (ie: iOS SE) we add a little padding to avoid tabbar to stick to bottom edge
          bottom: insets.bottom === 0 ? 5 : insets.bottom,
          left: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        <SquircleView
          cornerSmoothing={100}
          preserveSmoothing={true}
          accessible={true}
          accessibilityRole="tablist"
          accessibilityLabel="Main navigation tabs"
          style={{
            backgroundColor: TW_COLORS.CNAM_PRIMARY_800,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            borderRadius: 20,
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              const IconComponent = tab.icon;
              const color = isActive ? TW_COLORS.CNAM_PRIMARY_25 : TW_COLORS.CNAM_PRIMARY_25;
              const backgroundColor = isActive ? TW_COLORS.CNAM_PRIMARY_700 : "transparent";

              return (
                <SquircleButton
                  key={tab.name}
                  onPress={() => handleTabPress(tab.name)}
                  preserveSmoothing={true}
                  cornerSmoothing={100}
                  accessible={true}
                  accessibilityRole="tab"
                  accessibilityLabel={`${tab.label} tab`}
                  accessibilityState={{ selected: isActive }}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 8,
                    backgroundColor,
                    borderRadius: 10,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <IconComponent height={24} width={24} color={color} />
                    {tab.badge === false && <View className="bg-red-500 rounded-full w-2 h-2 absolute -top-2 -right-2" />}
                  </View>
                  <Text
                    className={isActive ? typography.textXsBold : typography.textXsRegular}
                    style={{
                      textTransform: "capitalize",
                      fontSize: 10,
                      marginTop: 4,
                      color: color,
                    }}
                  >
                    {tab.label}
                  </Text>
                </SquircleButton>
              );
            })}
          </View>
        </SquircleView>
      </View>
    </View>
  );
};

export default Tabs;
