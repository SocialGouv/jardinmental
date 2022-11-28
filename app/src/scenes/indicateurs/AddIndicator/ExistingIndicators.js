import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../utils/colors";
import Text from "../../../components/MyText";
import CheckBox from "@react-native-community/checkbox";

const ExistingIndicators = ({ chosenCategories, setToogleCheckbox, existingIndicatorsList }) => {
  return (
    <View>
      {existingIndicatorsList.map((cat, index) => (
        <View key={index} style={styles.categories}>
          <CheckBox
            animationDuration={0.2}
            boxType="square"
            style={styles.checkbox}
            value={chosenCategories[cat]}
            onValueChange={(newValue) => setToogleCheckbox(cat, newValue)}
            // for android
            tintColors={{ true: colors.LIGHT_BLUE, false: "#aaa" }}
            // for ios
            tintColor="#aaa"
            onCheckColor={colors.LIGHT_BLUE}
            onTintColor={colors.LIGHT_BLUE}
            onAnimationType="bounce"
            offAnimationType="bounce"
          />
          <Text style={styles.label}>{cat}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
  },
  exempleContainer: {
    width: "100%",
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    padding: 20,
    marginBottom: 12,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  checkbox: {
    marginHorizontal: 10,
    width: 25,
    height: 25,
  },
  categories: {
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 17,
    fontWeight: "600",
  },
});

export default ExistingIndicators;
