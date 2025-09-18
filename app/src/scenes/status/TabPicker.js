import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import Text from "../../components/MyText";
import logEvents from "../../services/logEvents";
import { TW_COLORS } from "@/utils/constants";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";

const TabPicker = ({ onChange, ongletActif = "all" }) => {
  const handlePress = (tab) => {
    logEvents.logStatusSubPage(tab);
    onChange(tab);
  };
  return (
    <View style={tabStyles.currentDateContainer}>
      <TouchableOpacity
        onPress={() => handlePress("all")}
        style={[tabStyles.tabButtonContainer, ongletActif === "all" ? tabStyles.tabActif : tabStyles.tabInactif]}
      >
        <View style={[tabStyles.tabButtonContainer]}>
          <Text
            className={mergeClassNames(
              ongletActif === "all" ? `${typography.textMdBold} text-cnam-primary-900` : `${typography.textMdSemibold} text-cnam-primary-800`
            )}
            style={[tabStyles.button]}
          >
            Tout voir
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handlePress("NOTES")}
        style={[tabStyles.tabButtonContainer, ongletActif === "NOTES" ? tabStyles.tabActif : tabStyles.tabInactif]}
      >
        <View style={[tabStyles.tabButtonContainer]}>
          <Text
            className={mergeClassNames(
              ongletActif === "NOTES" ? `${typography.textMdBold} text-cnam-primary-900` : `${typography.textMdSemibold} text-cnam-primary-800`
            )}
            style={[tabStyles.button]}
          >
            Notes
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  currentDateContainer: {
    backgroundColor: TW_COLORS.CNAM_PRIMARY_50,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    display: "flex",
    height: 56,
    borderColor: colors.BLUE,
    borderBottomWidth: 1,
  },
  button: {
    padding: 10,
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
    fontWeight: "bold",
    color: TW_COLORS.CNAM_PRIMARY_900,
  },
  inactif: {
    fontWeight: "semibold",
    color: TW_COLORS.CNAM_PRIMARY_800,
  },
  tabActif: {
    borderColor: TW_COLORS.CNAM_PRIMARY_700,
    borderBottomWidth: 3,
  },
});

export default TabPicker;
