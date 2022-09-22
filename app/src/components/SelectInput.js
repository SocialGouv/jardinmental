import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, LayoutAnimation, Platform } from "react-native";
import { colors } from "../utils/colors";
import RNPickerSelect from "react-native-picker-select";
import Icon from "./Icon";

export const SelectInput = ({
  items,
  value,
  onValueChange,
  placeholder,
  containerStyle,
  style,
  textValueStyle,
  iconContainerStyle,
  ...props
}) => {
  const pickerRef = useRef();
  const innerPickerRef = useRef();

  const [visibleValue, setVisibleValue] = useState(value);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS === "android") innerPickerRef?.current?.focus?.();
          else if (Platform.OS === "ios") pickerRef?.current?.togglePicker?.(true);
        }}
      >
        <View style={[styles.button, style]} pointerEvents="none">
          <Text style={[styles.textValue, textValueStyle]}>
            {visibleValue ? items.find((item) => item.value === visibleValue)?.label : placeholder}
          </Text>
          <Icon
            styleContainer={[styles.iconContainer, iconContainerStyle]}
            icon="ChevronDownSvg"
            color={colors.DARK_BLUE}
            width={15}
            height={15}
          />
        </View>
      </TouchableOpacity>

      <RNPickerSelect
        ref={pickerRef}
        useNativeAndroidPickerStyle={false}
        items={items || []}
        value={value}
        onValueChange={(_value) => {
          if (_value) {
            setVisibleValue(_value);
            onValueChange?.(_value);
            if (value !== _value) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          }
        }}
        placeholder={placeholder && { label: placeholder, value: null }}
        style={pickerStyles}
        pickerProps={{
          ref: innerPickerRef,
        }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    height: 36,
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
  pickerContainer: {
    display: "none",
  },
});

const pickerStyles = {
  inputIOSContainer: styles.pickerContainer,
  inputAndroidContainer: styles.pickerContainer,
};
