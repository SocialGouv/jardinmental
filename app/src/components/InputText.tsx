import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, TextInput, View, Text, Animated, Platform, TextInputProps, ViewStyle, TextStyle } from "react-native";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import FileIcon from "@assets/svg/icon/File";

interface InputTextProps extends TextInputProps {
  fill?: boolean;
  preset?: "groupItem" | "lighten" | "floatingLabel" | "iconWithHidePlaceholder";
  onPress?: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  style?: TextStyle;
  hidePlaceholder?: boolean;
}

const PressableIfNeeded = React.memo(({ onPress, children }: { onPress?: () => void; children: React.ReactNode }) =>
  onPress ? (
    <Pressable onPress={onPress} hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
      {children}
    </Pressable>
  ) : (
    <>{children}</>
  )
);

PressableIfNeeded.displayName = 'PressableIfNeeded';

export const InputText = React.memo(({ fill, preset, onPress, disabled, containerStyle, style, hidePlaceholder, ...props }: InputTextProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const previousShouldFloat = useRef(Boolean(props.value));
  const animatedValue = useRef(new Animated.Value(props.value ? 1 : 0)).current;

  const focus = useCallback(() => {
    console.log("focus");
    inputRef?.current?.focus?.();
  }, []);

  const finalOnPress = onPress === undefined ? focus : onPress;

  const styles = useMemo(() => applyStyles({ preset }), [preset]);

  // Animation logic for floating label
  const isFloatingLabelPreset = preset === "floatingLabel";
  const shouldLabelFloat = isFocused || Boolean(props.value);

  // Trigger animation when shouldLabelFloat changes
  useEffect(() => {
    if (isFloatingLabelPreset && shouldLabelFloat !== previousShouldFloat.current) {
      previousShouldFloat.current = shouldLabelFloat;
      Animated.timing(animatedValue, {
        toValue: shouldLabelFloat ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [shouldLabelFloat, isFloatingLabelPreset, animatedValue]);

  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  }, [props.onFocus]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  }, [props.onBlur]);

  const viewStyle = useMemo(() =>
    isFloatingLabelPreset
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
        }
      : {
          position: "absolute" as const,
          left: 16,
          top: 16,
          backgroundColor: "transparent",
        },
    [isFloatingLabelPreset, animatedValue]
  );

  const labelStyle = useMemo(() =>
    isFloatingLabelPreset
      ? {
          fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
          }),
          color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [TW_COLORS.GRAY_600, colors.BLUE],
          }),
          backgroundColor: "transparent",
          paddingHorizontal: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 4],
          }),
          fontFamily: "SourceSans3-Regular",
        }
      : {
          fontSize: 16,
          color: TW_COLORS.GRAY_600,
          backgroundColor: "transparent",
          paddingHorizontal: 1,
          fontFamily: "SourceSans3-Regular",
        },
    [isFloatingLabelPreset, animatedValue]
  );

  return (
    <View style={[styles.container, fill && { width: "100%" }, containerStyle]}>
      <PressableIfNeeded onPress={finalOnPress}>
        <View style={[styles.contentContainer]}>
          {isFloatingLabelPreset && props.placeholder && (
            <Animated.View style={viewStyle}>
              <View className="bg-white absolute -left-0 w-full h-2" style={{ bottom: Platform.OS === "android" ? 0.5 : 0.2 }} />
              <View className="flex-row items-center justify-center">
                {!isFocused && !props.value && (
                  <View className="mr-1">
                    <FileIcon color={TW_COLORS.GRAY_400} />
                  </View>
                )}
                <Animated.Text style={labelStyle}>{props.placeholder}</Animated.Text>
              </View>
            </Animated.View>
          )}
          {preset === "iconWithHidePlaceholder" && props.placeholder && !isFocused && !props.value && (
            <Animated.View style={viewStyle} className={"px-3"}>
              <View className="flex-row items-start justify-center">
                {!isFocused && !props.value && (
                  <View className="mr-1">
                    <FileIcon color={TW_COLORS.GRAY_400} />
                  </View>
                )}
                <Animated.Text style={labelStyle}>{props.placeholder}</Animated.Text>
              </View>
            </Animated.View>
          )}
          <TextInput
            ref={inputRef}
            maxFontSizeMultiplier={2}
            placeholderTextColor={TW_COLORS.GRAY_700}
            editable={!disabled}
            pointerEvents={disabled || props.editable === false ? "none" : "auto"}
            {...props}
            placeholder={isFloatingLabelPreset || preset === "iconWithHidePlaceholder" ? "" : props.placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[styles.input, disabled && styles.disabled, style]}
          />
        </View>
      </PressableIfNeeded>
    </View>
  );
});

InputText.displayName = 'InputText';

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
