import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Platform, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import RNPickerSelect from "react-native-picker-select";
import Icon from "../../components/Icon";
import { ListItem } from "@/components/SelectionnableItem";

export default ({ drug, onDelete }) => {
  const [showFreeText, setShowFreeText] = useState(false);
  const [freeText, setFreeText] = useState("");

  if (!drug) return null;
  useEffect(() => {
    setShowFreeText(drug?.isFreeText);
    setFreeText(drug?.value);
  }, [drug]);

  const render = () => {
    return <ListItem id={""} label={drug?.name1} description={drug?.name2 ? `(${drug?.name2})` : undefined} selected={false} onPress={onDelete} />;
  };

  return render();
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: "#F4FCFD",
    borderRadius: 8,
    color: colors.DARK_BLUE,
    minWidth: "100%",
    textAlign: "center",
    // padding: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: "#F4FCFD",
    borderRadius: 8,
    color: colors.DARK_BLUE,
    minWidth: "100%",
    textAlign: "center",
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  delete: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: -5,
    backgroundColor: "#F4FCFD",
    borderRadius: 16,
    borderColor: "#D4F0F2",
    borderWidth: 1,
    zIndex: 2,
    width: 18,
    height: 18,
  },
  close: {
    fontSize: 16,
    color: colors.LIGHT_BLUE,
    marginLeft: 5,
    padding: 0,
  },
  posologyItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flex: 1,
  },
  posologyName: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  left: {
    flex: 2,
    // paddingRight: 30,
    display: "flex",
    flexDirection: "row",
  },
  right: {
    flex: 1,
    // paddingRight: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text1: {
    fontSize: 15,
    color: "#000",
  },
  text2: {
    fontSize: 13,
    marginLeft: 10,
    color: colors.DARK_BLUE,
    fontStyle: "italic",
  },
  freeTextContainer: {
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: "#F4FCFD",
    borderRadius: 8,
    color: colors.DARK_BLUE,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  freeText: {
    fontSize: 16,
    borderRadius: 4,
    color: colors.DARK_BLUE,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    padding: 0,
  },
});
