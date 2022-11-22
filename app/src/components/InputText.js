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

export const InputText = ({ fill, preset, onPress, disabled, containerStyle, style, ...props }) => {
  const inputRef = useRef();

  const focus = () => {
    console.log("focus");
    inputRef?.current?.focus?.();
  };

  if (onPress === undefined) {
    onPress = focus;
  }

  const styles = applyStyles({ preset });

  return (
    <View style={[styles.container, fill && { width: "100%" }, containerStyle]}>
      <PressableIfNeeded onPress={onPress}>
        <View style={[styles.contentContainer]}>
          <TextInput
            ref={inputRef}
            maxFontSizeMultiplier={2}
            placeholderTextColor="#4D4D4D"
            editable={!disabled}
            pointerEvents={(disabled || !props.editable) && "none"}
            {...props}
            style={[styles.input, disabled && styles.disabled, style]}
          />
        </View>
      </PressableIfNeeded>
    </View>
  );
};

const applyStyles = ({ preset }) => {
  const appliedStyles = {
    ..._styles.base,
  };

  const applyIfNeeded = (cumStyles, condition, styleKey) => {
    if (eval(condition)) {
      for (let key of Object.keys(_styles[styleKey]))
        cumStyles[key] = { ...cumStyles[key], ..._styles[styleKey][key] };
    }
  };

  applyIfNeeded(appliedStyles, "preset==='groupItem'", "groupItem");

  return appliedStyles;
};

const _styles = {
  base: StyleSheet.create({
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
  }),
  groupItem: StyleSheet.create({
    container: {
      backgroundColor: "#FFFFFF",
      borderColor: "#1FC6D5",
      borderRadius: 4,
    },
    contentContainer: {
      padding: 0,
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    disabled: {
      opacity: 1,
    },
  }),
};
