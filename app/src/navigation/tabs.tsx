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
import StatusBarColor from "@/components/StatusBar";
import { useFocusEffect } from "@react-navigation/native";
import { useStatusBar } from "@/context/StatusBarContext";
import { TW_COLORS } from "@/utils/constants";
import BookOpenIcon from "../../assets/svg/icon/BookOpen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();

const Tabs = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { setCustomColor } = useStatusBar();
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
            <StatusBarColor />
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
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            logEvents.logOpenAnalysisMain();
          },
        })}
      >
        {(p) => (
          <View style={{ paddingTop: insets.top, flex: 1 }}>
            <StatusBarColor />
            <Suivi {...p} startSurvey={startSurvey} />
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Resources"
        options={{
          tabBarLabel: "Ressources",
          tabBarIcon: ({ focused, color }) => (
            <View style={{ alignItems: "center", position: "relative" }}>
              <BookOpenIcon height={24} width={24} color={color} />
              {!hasVisitedResources && <View className="bg-red-500 rounded-full w-2 h-2 absolute -top-1 -right-1" />}
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: async (e) => {
            const currentRouteName = navigation.getState().routes[navigation.getState().index].name;
            if (currentRouteName !== "Resources") {
              logEvents.logOpenedRessources();
            }

            if (!hasVisitedResources) {
              try {
                await AsyncStorage.setItem("hasVisitedResources", "true");
                setHasVisitedResources(true);
              } catch (_error) {}
            }
          },
        })}
      >
        {(p) => (
          <View style={{ paddingTop: insets.top, flex: 1 }}>
            <StatusBarColor />
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
            <StatusBarColor />
            <Exercise {...p} startSurvey={startSurvey} />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Tabs;
