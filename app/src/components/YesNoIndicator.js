import React from "react";
import Text from "./MyText";
import { colors } from "@/utils/colors";
import { StyleSheet, View } from "react-native";
import { TW_COLORS } from "@/utils/constants";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  button: {
    borderRadius: 40,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: colors.BLUE,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonRed: {
    backgroundColor: TW_COLORS.NEGATIVE,
    borderColor: TW_COLORS.NEGATIVE,
  },
  buttonGreen: {
    backgroundColor: TW_COLORS.POSITIVE,
    borderColor: TW_COLORS.POSITIVE,
  },
  buttonText: {
    color: colors.BLUE,
    fontWeight: "700",
    fontSize: 17,
  },
});

const YesNoIndicator = ({ no, yes }) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.button,
          { marginRight: 15 },
          no === "red" && styles.buttonRed,
          no === "green" && styles.buttonGreen,
        ]}
      >
        <Text style={styles.buttonText}>Non</Text>
      </View>
      <View style={[styles.button, yes === "red" && styles.buttonRed, yes === "green" && styles.buttonGreen]}>
        <Text style={styles.buttonText}>Oui</Text>
      </View>
    </View>
  );
};

export default YesNoIndicator;
