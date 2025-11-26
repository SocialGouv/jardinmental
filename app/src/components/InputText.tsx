import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, TextInput, View, Text, Animated } from "react-native";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";

const PressableIfNeeded = ({ onPress, children }) =>
  onPress ? (
    <Pressable onPress={onPress} hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
      {children}
    </Pressable>
  ) : (
    <>{children}</>
  );

export const InputText = ({ fill, preset, onPress, disabled, containerStyle, style, ...props }) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(props.value ? 1 : 0)).current;

  const focus = () => {
    console.log("focus");
    inputRef?.current?.focus?.();
  };

  if (onPress === undefined) {
    onPress = focus;
  }

  const styles = applyStyles({ preset });

  // Animation logic for floating label
  const isFloatingLabelPreset = preset === "floatingLabel";
  const shouldLabelFloat = isFocused || (props.value && props.value.length > 0);

  useEffect(() => {
    if (isFloatingLabelPreset) {
      Animated.timing(animatedValue, {
        toValue: shouldLabelFloat ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [shouldLabelFloat, isFloatingLabelPreset]);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const viewStyle = isFloatingLabelPreset
    ? {
        position: "absolute" as const,
        left: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 12],
        }),
        top: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [16, -10],
        }),
        backgroundColor: "transparent",
        // paddingHorizontal: animatedValue.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [0, 4],
        // }),
      }
    : null;

  const labelStyle = isFloatingLabelPreset
    ? {
        // position: "absolute" as const,
        // left: animatedValue.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [16, 12],
        // }),
        // top: animatedValue.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [16, -10],
        // }),
        fontSize: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 12],
        }),
        color: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [TW_COLORS.GRAY_700, colors.BLUE],
        }),
        backgroundColor: "transparent",
        paddingHorizontal: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 4],
        }),
        fontFamily: "SourceSans3",
      }
    : null;

  return (
    <View style={[styles.container, fill && { width: "100%" }, containerStyle]}>
      <PressableIfNeeded onPress={onPress}>
        <View style={[styles.contentContainer]}>
          {isFloatingLabelPreset && props.placeholder && (
            <Animated.View style={viewStyle}>
              <View className="bg-white absolute -left-0 w-full h-2" style={{ bottom: -2.5 }} />
              <Animated.Text style={labelStyle}>{props.placeholder}</Animated.Text>
            </Animated.View>
          )}
          <TextInput
            ref={inputRef}
            maxFontSizeMultiplier={2}
            placeholderTextColor={TW_COLORS.GRAY_700}
            editable={!disabled}
            pointerEvents={disabled || props.editable === false ? "none" : "auto"}
            {...props}
            placeholder={isFloatingLabelPreset ? "" : props.placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
  if (preset === "floatingLabel") applyIfNeeded(appliedStyles, "floatingLabel");

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
  floatingLabel: StyleSheet.create({
    container: {
      backgroundColor: "#FFFFFF",
      borderColor: colors.BLUE,
      borderWidth: 1,
      borderRadius: 12,
    },
    contentContainer: {
      padding: 16,
      position: "relative",
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
};
