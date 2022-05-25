import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import logEvents from "../../services/logEvents";

const CHART_TYPES = ["Frises", "Statistiques", "Courbes", "Déclencheurs"];

const TabPicker = ({ onChange, ongletActif = "Frises" }) => {
  const handlePress = (tab) => {
    // logEvents.logStatusSubPage(tab);
    onChange(tab);
  };

  return (
    <ScrollView
      horizontal
      style={tabStyles.scrollView}
      contentContainerStyle={tabStyles.scrollContainer}
      fadingEdgeLength={10}
      showsHorizontalScrollIndicator={false}
      snapToAlignment={"end"}
    >
      {CHART_TYPES.map((tab) => (
        <TouchableOpacity key={tab} onPress={() => handlePress(tab)} style={[tabStyles.tabButtonContainer]}>
          <View
            style={[
              tabStyles.tabButtonContainer,
              ongletActif === tab ? tabStyles.tabActif : tabStyles.tabInactif,
            ]}
          >
            <Text style={[tabStyles.button, ongletActif === tab ? tabStyles.actif : tabStyles.inactif]}>
              {tab}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const tabStyles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#F6FCFD",
    marginBottom: 15,
    borderColor: colors.BLUE,
    borderBottomWidth: 1,
  },
  scrollContainer: {},
  currentDateContainer: {
    backgroundColor: "#F6FCFD",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 5,
    display: "flex",
    borderColor: colors.BLUE,
    borderBottomWidth: 1,
  },
  button: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tabButtonContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40,
    paddingHorizontal: 10,
  },
  actif: {
    color: colors.BLUE,
    fontWeight: "bold",
  },
  inactif: {
    color: colors.BLUE,
  },
  tabActif: {
    borderColor: colors.BLUE,
    borderBottomWidth: 3,
  },
});

export default TabPicker;
