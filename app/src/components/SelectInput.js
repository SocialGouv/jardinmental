import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, LayoutAnimation } from "react-native";
import { colors } from "../utils/colors";
import RNPickerSelect from "react-native-picker-select";
import Icon from "./Icon";

export const SelectInput = ({
  items,
  value,
  onValueChange,
  placeholder,
  containerStyle,
  textValueStyle,
  iconContainerStyle,
}) => {
  const pickerRef = useRef();

  const [visibleValue, setVisibleValue] = useState(value);

  return (
    <>
      <TouchableOpacity onPress={() => pickerRef?.current?.togglePicker?.(true)}>
        <View style={[styles.container, containerStyle]} pointerEvents="none">
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
        onValueChange={(value) => {
          if (value) {
            setVisibleValue(value);
            onValueChange?.(value);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          }
        }}
        placeholder={placeholder && { label: placeholder, value: null }}
        style={pickerStyles}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  textValue: {
    fontSize: 14,
    color: colors.DARK_BLUE,
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