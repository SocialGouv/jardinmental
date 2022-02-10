import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput, Keyboard, Platform } from "react-native";
import { colors } from "../../../utils/colors";
import CircledIcon from "../../../components/CircledIcon";
import Button from "../../../components/RoundButtonIcon";

const AddSymptom = ({
  onChange = console.log,
  placeholder = "Ajouter...",
  styleContainer,
  onChangeText = console.log,
}) => {
  const [value, setValue] = useState();

  return (
    <View style={[styles.container, styleContainer]}>
      <View style={styles.inputContainer}>
        <TextInput
          multiline={true}
          numberOfLines={Platform.OS === "ios" ? null : 3}
          minHeight={Platform.OS === "ios" ? 30 * 3 : null}
          textAlignVertical={"top"}
          onChangeText={(e) => {
            setValue(e);
            onChangeText(e);
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.LIGHT_GRAY}
          style={styles.text}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          backgroundColor={colors.LIGHT_BLUE}
          iconColor={colors.WHITE}
          borderColor={colors.WHITE}
          icon="plus"
          visible={true}
          onPress={() => {
            onChange(value);
            setValue("");
            onChangeText("");
            Keyboard.dismiss();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    width: "100%",
    display: "flex",
    position: "absolute",
    bottom: -25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginRight: 8,
    transform: [{ rotate: "180deg" }],
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    flex: 1,
    borderWidth: 1,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: "#F4FCFD",
    borderRadius: 8,
    color: colors.DARK_BLUE,
  },
  container: {
    marginVertical: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    textAlign: "left",
    color: colors.DARK_BLUE,
    flex: 1,
  },
});

export default AddSymptom;
