import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, TextInput, View, Animated } from "react-native";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";

const PressableIfNeeded = ({ onPress, children }) =>
  onPress ? (
    <Pressable onPress={onPress} hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
      {children}
    </Pressable>
  ) : (
    <>{children}</>
  );

export const InputText = ({ fill, preset, onPress, disabled, containerStyle, style, placeholder, value, ...props }) => {
  const inputRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, hasValue]);

  const focus = () => {
    console.log("focus");
    inputRef?.current?.focus?.();
  };

  if (onPress === undefined) {
    onPress = focus;
  }

  const styles = applyStyles({ preset });

  // Adjust positioning based on preset
  const getInitialTop = () => {
    if (preset === "groupItem") {
      return 6; // groupItem has paddingVertical: 6
    }
    return 16; // base has padding: 16
  };

  const initialTop = getInitialTop();

  const labelStyle = {
    position: "absolute",
    left: 14,
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [initialTop, 2],
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 11],
    }),
    color: TW_COLORS.GRAY_700,
    backgroundColor: "transparent",
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontFamily: "SourceSans3",
    overflow: "hidden",
    zIndex: 1,
    pointerEvents: "none", // Critical: allows clicks to pass through to the input
    // maxWidth: "85%",
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChangeText = (text) => {
    setHasValue(!!text);
    props.onChangeText?.(text);
  };

  return (
    <View style={[styles.container, fill && { width: "100%" }, containerStyle]}>
      <PressableIfNeeded onPress={onPress}>
        <View style={[styles.contentContainer]}>
          {placeholder && (
            <Animated.Text style={labelStyle} numberOfLines={1} ellipsizeMode="clip">
              {placeholder}
            </Animated.Text>
          )}
          <TextInput
            ref={inputRef}
            maxFontSizeMultiplier={2}
            placeholderTextColor={TW_COLORS.GRAY_700}
            editable={!disabled}
            pointerEvents={disabled || props.editable === false ? "none" : "auto"}
            {...props}
            placeholder={""}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
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
      overflow: "visible",
    },
    contentContainer: {
      paddingTop: 19,
      paddingBottom: 13,
      paddingHorizontal: 16,
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
  groupItem: StyleSheet.create({
    container: {
      backgroundColor: colors.WHITE,
      borderColor: colors.LIGHT_BLUE,
      borderRadius: 4,
      overflow: "visible",
    },
    contentContainer: {
      padding: 0,
      paddingHorizontal: 16,
      paddingVertical: 6,
      position: "relative",
    },
    disabled: {
      opacity: 1,
    },
  }),
  lighten: StyleSheet.create({
    container: {
      borderColor: "#E7EAF1",
      overflow: "visible",
    },
  }),
};
