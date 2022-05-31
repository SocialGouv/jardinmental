import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import logEvents from "../../services/logEvents";

const TabPicker = ({ onChange, ongletActif = "all" }) => {
  const handlePress = (tab) => {
    logEvents.logStatusSubPage(tab);
    onChange(tab);
  };
  return (
    <View style={tabStyles.currentDateContainer}>
      <TouchableOpacity
        onPress={() => handlePress("all")}
        style={[
          tabStyles.tabButtonContainer,
          ongletActif === "all" ? tabStyles.tabActif : tabStyles.tabInactif,
        ]}
      >
        <View
          style={[
            tabStyles.tabButtonContainer,
            // ongletActif === "all" ? tabStyles.tabActif : tabStyles.tabInactif,
          ]}
        >
          <Text style={[tabStyles.button, ongletActif === "all" ? tabStyles.actif : tabStyles.inactif]}>
            Tout voir
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handlePress("NOTES")}
        style={[
          tabStyles.tabButtonContainer,
          ongletActif === "NOTES" ? tabStyles.tabActif : tabStyles.tabInactif,
        ]}
      >
        <View
          style={[
            tabStyles.tabButtonContainer,
            // ongletActif === "NOTES" ? tabStyles.tabActif : tabStyles.tabInactif,
          ]}
        >
          <Text style={[tabStyles.button, ongletActif === "NOTES" ? tabStyles.actif : tabStyles.inactif]}>
            Notes
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  currentDateContainer: {
    backgroundColor: "#F6D6A6",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    display: "flex",
    // borderColor: colors.BLUE,
    // borderBottomWidth: 1,
  },
  button: {
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
  },
  actif: {
    color: "#56240E",
    fontWeight: "bold",
  },
  inactif: {
    color: "#666",
  },
  tabActif: {
    borderColor: "#56240E",
    borderBottomWidth: 3,
  },
});

export default TabPicker;
