import React, { useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors } from "@/utils/colors";

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
            pointerEvents={disabled || props.editable === false ? "none" : "auto"}
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

  // FIX-EVAL: Fix made to have the app running but the code clear need a refactoring
  const applyIfNeeded = (cumStyles, styleKey) => {
    for (let key of Object.keys(_styles[styleKey])) cumStyles[key] = { ...cumStyles[key], ..._styles[styleKey][key] };
  };
  if (preset === "groupItem") applyIfNeeded(appliedStyles, "groupItem");
  if (preset === "lighten") applyIfNeeded(appliedStyles, "lighten");

  // Before the fix
  // const applyIfNeeded = (cumStyles, condition, styleKey) => {
  //   if (eval(condition)) {
  //     for (let key of Object.keys(_styles[styleKey]))
  //       cumStyles[key] = { ...cumStyles[key], ..._styles[styleKey][key] };
  //   }
  // };
  // applyIfNeeded(appliedStyles, "preset==='groupItem'", "groupItem");
  // applyIfNeeded(appliedStyles, "preset==='lighten'", "lighten");

  return appliedStyles;
};

const _styles = {
  base: StyleSheet.create({
    container: {
      alignItems: "stretch",
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      borderColor: colors.BLUE,
      borderWidth: 1,
    },
    contentContainer: {
      padding: 16,
    },
    input: {
      width: "100%",
      fontFamily: "SourceSans3",
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
      backgroundColor: colors.WHITE,
      borderColor: colors.LIGHT_BLUE,
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
  lighten: StyleSheet.create({
    container: {
      borderColor: "#E7EAF1",
    },
  }),
};
