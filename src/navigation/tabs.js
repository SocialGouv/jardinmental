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
import Text from "../components/MyText";

const Tab = createMaterialTopTabNavigator();

const Tabs = ({ navigation, route }) => {
  const [plusVisible, setPlusVisible] = React.useState(false);
  const MemoizedFloatingPlusButton = React.memo(FloatingPlusButton);

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

  const handlePlusVisible = (v) => {
    if (v === plusVisible) return;
    setPlusVisible(v);
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Status"
        swipeEnabled={true}
        tabBarPosition="bottom"
        tabBarOptions={{
          activeTintColor: colors.BLUE,
          inactiveTintColor: "#a1a1a1",
          showIcon: true,
          indicatorStyle: { height: 0 },
          style: styles.tabBar,
          iconStyle: {
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
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ fontSize: 10, marginHorizontal: 0, padding: 0, color }}>Mes entrées</Text>
            ),
            tabBarIcon: ({ color }) => <SurveyMenu height={24} style={{ color }} />,
          }}
        >
          {(p) => <Status {...p} setPlusVisible={handlePlusVisible} />}
        </Tab.Screen>
        <Tab.Screen
          name="Calendar"
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ fontSize: 10, marginHorizontal: 0, padding: 0, color }}>Mes analyses</Text>
            ),
            tabBarIcon: ({ color }) => <GraphMenu height={24} style={{ color }} />,
          }}
        >
          {(p) => <Suivi {...p} setPlusVisible={handlePlusVisible} />}
        </Tab.Screen>
        <Tab.Screen
          name="Exercise"
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ fontSize: 10, marginHorizontal: 0, padding: 0, color }}>Beck</Text>
            ),
            tabBarIcon: ({ color }) => <ExerciseMenu height={24} style={{ color }} />,
          }}
        >
          {(p) => <Exercise {...p} setPlusVisible={handlePlusVisible} />}
        </Tab.Screen>
      </Tab.Navigator>
      <MemoizedFloatingPlusButton shadow onPress={startSurvey} plusVisible={plusVisible} />
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
