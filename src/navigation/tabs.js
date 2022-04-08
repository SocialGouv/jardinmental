import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Status from "../scenes/status";
import Exercise from "../scenes/exercise";
import Suivi from "../scenes/suivi";
import SurveyMenu from "../../assets/svg/SurveyMenu";
import ExerciseMenu from "../../assets/svg/ExerciseMenu";
import GraphMenu from "../../assets/svg/GraphMenu";
import localStorage from "../utils/localStorage";
import logEvents from "../services/logEvents";
import { colors } from "../utils/colors";
import FloatingPlusButton from "../components/FloatingPlusButton";

const Tab = createMaterialTopTabNavigator();

const Tabs = ({ navigation, route }) => {
  const startSurvey = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents.logFeelingStart();
    if (!symptoms) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day");
    }
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Status"
        swipeEnabled={true}
        tabBarPosition="bottom"
        tabBarOptions={{
          activeTintColor: colors.LIGHT_BLUE,
          inactiveTintColor: colors.BLUE,
          showIcon: true,
          indicatorStyle: { height: 0 },
          style: styles.tabBar,
          iconStyle: {
            // borderColor: 'red',
            // borderWidth: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          labelStyle: {
            textTransform: "capitalize",
            fontSize: 10,
            marginHorizontal: 0,
            padding: 0,
          },
        }}
      >
        <Tab.Screen
          name="Status"
          component={Status}
          options={{
            tabBarLabel: "Mes entrées",
            tabBarIcon: ({ color }) => <SurveyMenu height={24} style={{ color }} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={Suivi}
          options={{
            tabBarLabel: "Mes Analyses",
            tabBarIcon: ({ color }) => <GraphMenu height={24} style={{ color }} />,
          }}
        />
        <Tab.Screen
          name="Exercise"
          component={Exercise}
          options={{
            tabBarLabel: "Beck",
            tabBarIcon: ({ color }) => <ExerciseMenu height={24} style={{ color }} />,
          }}
        />
      </Tab.Navigator>
      <FloatingPlusButton shadow onPress={startSurvey} />
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
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
  surveyButton: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === "android" ? 40 : 50,
    zIndex: 1,
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    paddingVertical: Platform.OS === "android" ? 5 : 17,
    fontWeight: "700",
  },
});

export default Tabs;
