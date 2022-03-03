import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Diary from "../scenes/diary";
import Status from "../scenes/status";
import Exercise from "../scenes/exercise";
import Suivi from "../scenes/suivi";
import SurveyMenu from "../../assets/svg/SurveyMenu";
import DiaryMenu from "../../assets/svg/DiaryMenu";
import ExerciseMenu from "../../assets/svg/ExerciseMenu";
import GraphMenu from "../../assets/svg/GraphMenu";
import localStorage from "../utils/localStorage";
import { colors } from "../utils/colors";
import { getAlertNotesVersion, LAST_NOTES_VERSION, NEWS_DATA } from "../scenes/news";
import Text from "../components/MyText";
import ModalBase from "../components/modal/ModalBase";
import pck from "../../package.json";

const Tab = createMaterialTopTabNavigator();

const Tabs = ({ navigation, route }) => {
  const [alertNotesVersionVisible, setAlertNotesVersionVisible] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const n = await getAlertNotesVersion();
      setAlertNotesVersionVisible(n);
    })();
  }, []);

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
            tabBarLabel: "Mon état",
            tabBarIcon: ({ color }) => <SurveyMenu height={24} style={{ color }} />,
          }}
        />
        <Tab.Screen
          name="Diary"
          component={Diary}
          options={{
            tabBarLabel: "Mon journal",
            tabBarIcon: ({ color }) => <DiaryMenu height={24} style={{ color }} />,
          }}
        />
        <Tab.Screen
          name="Exercise"
          component={Exercise}
          options={{
            tabBarLabel: "Exercice",
            tabBarIcon: ({ color }) => <ExerciseMenu height={24} style={{ color }} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={Suivi}
          options={{
            tabBarLabel: "Mon suivi",
            tabBarIcon: ({ color }) => <GraphMenu height={24} style={{ color }} />,
          }}
        />
      </Tab.Navigator>
      <ModalBase
        onModalHide={() => {
          localStorage.setAlertNotesVersion(LAST_NOTES_VERSION);
        }}
        visible={alertNotesVersionVisible}
        // maybe later
        // onClick={() => navigation.navigate("news")}
        renderContent={
          <>
            <Text style={stylesModal.title}>🎉 Nouvelle version installée !</Text>
            <Text style={stylesModal.content}>
              {NEWS_DATA.find((e) => e.version === pck.version)?.modalText}
            </Text>
            <Text style={stylesModal.footer}>version {pck.version}</Text>
          </>
        }
        title="🎉 Nouvelle version disponible"
      />
    </>
  );
};

const stylesModal = StyleSheet.create({
  title: {
    fontSize: 16,
    color: colors.BLUE,
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    color: "#111",
    padding: 10,
  },
  footer: {
    fontSize: 11,
    color: "#ccc",
    textAlign: "center",
  },
});

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
