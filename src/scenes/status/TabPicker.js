import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";

const TabPicker = ({ onChange, ongletActif = "all" }) => {
  return (
    <View style={tabStyles.currentDateContainer}>
      <TouchableOpacity onPress={() => onChange("all")}>
        <Text style={[tabStyles.button, ongletActif === "all" ? tabStyles.actif : tabStyles.inactif]}>
          Tout voir
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange("NOTES")}>
        <Text style={[tabStyles.button, ongletActif === "NOTES" ? tabStyles.actif : tabStyles.inactif]}>
          Notes
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  currentDateContainer: {
    backgroundColor: "transparent",
    borderColor: colors.BLUE,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 5,
    display: "flex",
  },
  button: {
    padding: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  actif: {
    color: colors.BLUE,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  inactif: {
    color: colors.LIGHT_BLUE,
  },
});

export default TabPicker;
