import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Text from "./MyText";
import { colors } from "../utils/colors";
import RNPickerSelect from "react-native-picker-select";
import Icon from "./Icon";
import { autoLayoutAnimation } from "../utils/autoLayoutAnimation";

export const SelectInput = ({ items, value, onValueChange, placeholder, containerStyle, style, textValueStyle, iconContainerStyle, ...props }) => {
  const pickerRef = useRef();
  const innerPickerRef = useRef();

  const [visibleValue, setVisibleValue] = useState(value);

  // For iOS, we need to handle placeholder differently to prevent it from being selectable
  const placeholderConfig =
    Platform.OS === "ios"
      ? placeholder && !value
        ? { label: placeholder, value: "", color: "#9CA3AF" }
        : {}
      : placeholder
      ? { label: placeholder, value: null }
      : {};

  return (
    <View style={[styles.container, containerStyle]}>
      <RNPickerSelect
        ref={pickerRef}
        useNativeAndroidPickerStyle={false}
        items={items || []}
        value={value}
        onValueChange={(_value) => {
          // Prevent selection of placeholder on iOS (empty string) and null values
          if (_value && _value !== null && _value !== "") {
            setVisibleValue(_value);
            onValueChange?.(_value);
            if (value !== _value) autoLayoutAnimation();
          }
        }}
        placeholder={placeholderConfig}
        style={pickerStyles}
        pickerProps={{
          ref: innerPickerRef,
        }}
        {...props}
      >
        <View style={[styles.button, style]} pointerEvents={Platform.OS === "ios" ? "none" : "auto"}>
          <Text style={[styles.textValue, textValueStyle]}>
            {visibleValue ? items.find((item) => item.value === visibleValue)?.label : placeholder}
          </Text>
          <Icon styleContainer={[styles.iconContainer, iconContainerStyle]} icon="ChevronDownSvg" color={colors.DARK_BLUE} width={15} height={15} />
        </View>
      </RNPickerSelect>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    height: 40,
    borderRadius: 36,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  textValue: {
    fontSize: 14,
    color: colors.DARK_BLUE,
    flexGrow: 1,
  },
  iconContainer: {
    width: null,
    height: null,
    marginLeft: 6,
  },
});

const pickerStyles = {
  inputIOSContainer: styles.pickerContainer,
  inputAndroidContainer: styles.pickerContainer,
};
