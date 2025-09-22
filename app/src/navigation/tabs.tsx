import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Status from "../scenes/status";
import Exercise from "../scenes/exercise";
import Suivi from "../scenes/suivi";
import Resources from "../scenes/resources";
import SurveyMenu from "../../assets/svg/SurveyMenu";
import ExerciseMenu from "../../assets/svg/ExerciseMenu";
import GraphMenu from "../../assets/svg/GraphMenu";
import { View, Text, SafeAreaView, Platform } from "react-native";
import { colors } from "../utils/colors";
import localStorage from "../utils/localStorage";
import logEvents from "../services/logEvents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IosStatusBarColor from "@/components/IosStatusBar";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import BookOpenIcon from "../../assets/svg/icon/BookOpen";

const Tab = createMaterialTopTabNavigator();

const Tabs = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { setCustomColor } = useStatusBar();

  useFocusEffect(
    React.useCallback(() => {
      // Reset current index when the screen is focused
      setCustomColor(TW_COLORS.PRIMARY);
    }, [])
  );

  const startSurvey = async () => {
    const user_indicateurs = await localStorage.getIndicateurs();
    logEvents.logFeelingStart();
    if (!user_indicateurs) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day");
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Status"
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarShowIcon: true,
        tabBarShowLabel: true,
        tabBarIndicatorStyle: { display: "none" }, // Hide the indicator
        tabBarStyle: {
          maxHeight: 80,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
        },
        tabBarIconStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontSize: 10,
          marginHorizontal: 0,
          padding: 0,
        },
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: "#a1a1a1",
      }}
    >
      <Tab.Screen
        name="Status"
        options={{
          tabBarLabel: "Mes entrées",
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <SurveyMenu height={24} width={24} color={color} />
            </View>
          ),
        }}
      >
        {(p) => (
          <View style={{ paddingTop: insets.top, flex: 1 }}>
            {Platform.OS === "ios" && <IosStatusBarColor />}
            <Status {...p} startSurvey={startSurvey} />
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Calendar"
        options={{
          tabBarLabel: "Mes analyses",
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <GraphMenu height={24} width={24} color={color} />
            </View>
          ),
        }}
      >
        {(p) => (
          <View style={{ paddingTop: insets.top, flex: 1 }}>
            {Platform.OS === "ios" && <IosStatusBarColor />}
            <Suivi {...p} startSurvey={startSurvey} />
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Resources"
        options={{
          tabBarLabel: "Ressources",
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <BookOpenIcon height={24} width={24} color={color} />
            </View>
          ),
        }}
      >
        {(p) => (
          <View style={{ paddingTop: insets.top, flex: 1 }}>
            {Platform.OS === "ios" && <IosStatusBarColor />}
            <Resources {...p} />
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Exercise"
        options={{
          tabBarLabel: "Beck",
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <ExerciseMenu height={24} width={24} color={color} />
            </View>
          ),
        }}
      >
        {(p) => (
          <View style={{ paddingTop: insets.top, flex: 1 }}>
            {Platform.OS === "ios" && <IosStatusBarColor />}
            <Exercise {...p} startSurvey={startSurvey} />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Tabs;
