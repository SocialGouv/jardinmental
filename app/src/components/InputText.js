import React, { useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

const PressableIfNeeded = ({ onPress, children }) =>
  onPress ? (
    <Pressable onPress={onPress} hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
      {children}
    </Pressable>
  ) : (
    <>{children}</>
  );

export const InputText = ({ fill, onPress, disabled, containerStyle, style, ...props }) => {
  const inputRef = useRef();

  const focus = () => {
    console.log("focus");
    inputRef?.current?.focus?.();
  };

  if (onPress === undefined) {
    onPress = focus;
  }

  return (
    <View style={[styles.container, fill && { width: "100%" }, containerStyle]}>
      <PressableIfNeeded onPress={onPress}>
        <View style={[styles.contentContainer]}>
          <TextInput
            ref={inputRef}
            maxFontSizeMultiplier={2}
            placeholderTextColor="#4D4D4D"
            editable={!disabled}
            {...props}
            style={[styles.input, disabled && styles.disabled, style]}
          />
        </View>
      </PressableIfNeeded>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    borderRadius: 12,
    borderColor: "#26387C",
    borderWidth: 1,
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    width: "100%",
    fontFamily: "Karla",
    paddingVertical: 0,
    fontSize: 16,
    color: "#000",
  },
  disabled: {
    opacity: 0.5,
  },
});
