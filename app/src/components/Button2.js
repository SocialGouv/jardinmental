import React from "react";
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import { colors } from "../utils/colors";

export const Button2 = ({
  preset = "primary", // 'primary' | 'secondary'
  type = "solid", //'solid' | 'clear' | 'outline'
  size = "default", // 'normal' | 'small'
  fill = false, // fill horizontally
  square = false,
  circle = false,
  checkable = false,
  title,
  onPress,
  disabled = false,
  loading = false,
  style = {},
  containerStyle = {},
  textStyle = {},
  iconStyle = {},
  icon, // can be a component or a string
  iconSize,
  checked = false,
  testID = "",
}) => {
  square = square || circle;
  const appliedStyles = applyStyles({ preset, type, checkable, checked, square, circle, size, fill });

  let _iconSize = iconSize ?? 20;
  if (size === "small") _iconSize = iconSize ?? 16;

  const frontColor = textStyle.color || appliedStyles.text.color;

  const iconStyles = [
    {
      width: Math.min(_iconSize, styles.base.text.fontSize),
      height: Math.min(_iconSize, styles.base.text.fontSize),
    },
    appliedStyles.icon,
    iconStyle,
    !title?.length && { marginRight: 0 },
  ];

  let _icon = null;
  if (React.isValidElement(icon)) {
    _icon = icon;
  } else if (typeof icon === "string") {
    _icon = <Icon icon={icon} width={_iconSize} height={_iconSize} />;
  }

  return (
    <View style={[appliedStyles.container, containerStyle, fill && { width: "100%" }]}>
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} testID={testID}>
        <View
          style={[
            appliedStyles.button,
            fill && { width: "100%" },
            square && {
              aspectRatio: 1,
              paddingHorizontal: 0,
              borderRadius: circle ? 100 : size === "small" ? 15 : 20,
            },
            style,
            disabled && appliedStyles.disabled,
          ]}
        >
          {!loading &&
            _icon &&
            (React.isValidElement(_icon)
              ? React.cloneElement(_icon, {
                  width: _iconSize,
                  height: _iconSize,
                  color: frontColor,
                  styleContainer: iconStyles,
                })
              : _icon)}
          {loading && <ActivityIndicator size={_iconSize} color={frontColor} style={iconStyles} />}

          {title && (
            <Text allowFontScaling={false} style={[appliedStyles.text, textStyle]} testID={`${testID}-text`}>
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const applyStyles = ({ preset, type, checkable, checked, square, size, fill }) => {
  const appliedStyles = {
    ...styles.base,
  };

  const applyIfNeeded = (cumStyles, condition, styleKey) => {
    if (eval(condition)) {
      cumStyles.button = { ...cumStyles.button, ...styles[styleKey].button };
      cumStyles.container = { ...cumStyles.container, ...styles[styleKey].container };
      cumStyles.text = { ...cumStyles.text, ...styles[styleKey].text };
      cumStyles.icon = { ...cumStyles.icon, ...styles[styleKey].icon };
      cumStyles.disabled = { ...cumStyles.disabled, ...styles[styleKey].disabled };
    }
  };

  applyIfNeeded(appliedStyles, "preset==='primary'", "primary");
  applyIfNeeded(appliedStyles, "preset==='secondary'", "secondary");
  applyIfNeeded(appliedStyles, "type==='outline'", "outline");
  applyIfNeeded(appliedStyles, "type==='clear'", "clear");
  applyIfNeeded(appliedStyles, "size==='small'", "small");

  if (!fill && size === "default") appliedStyles.button.minWidth = "70%";

  if (checkable && preset === "secondary") {
    appliedStyles.button.backgroundColor = !checked ? "transparent" : colors.DARK_BLUE;
    appliedStyles.text.color = !checked ? colors.DARK_BLUE : "white";
  }

  if (type === "clear" && square) {
    appliedStyles.button.minHeight = 0;
    appliedStyles.button.padding = 7;
  }

  return appliedStyles;
};

const styles = {
  base: StyleSheet.create({
    container: {},
    button: {
      flexDirection: "row",
      minHeight: 45,
      borderRadius: 45,
      paddingHorizontal: 30,
      paddingVertical: 10,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontWeight: "bold",
      fontSize: 19,
      textAlign: "center",
    },
    icon: {
      marginRight: 12,
    },
    disabled: {
      opacity: 0.6,
    },
  }),
  primary: StyleSheet.create({
    button: {
      backgroundColor: "#1FC6D5",
      shadowColor: "#0A215C",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    text: {
      color: "white",
    },
  }),
  secondary: StyleSheet.create({
    button: {
      backgroundColor: "white",
      borderColor: colors.DARK_BLUE,
      borderWidth: 1,
    },
    text: {
      color: colors.DARK_BLUE,
    },
  }),
  outline: StyleSheet.create({
    button: {
      backgroundColor: "#f8f9fb",
      borderColor: "#e2e6ee",
      borderWidth: 1,
    },
    text: {
      color: "#26387C",
    },
  }),
  clear: StyleSheet.create({
    button: {
      backgroundColor: "transparent",
    },
    text: {
      color: colors.DARK_BLUE,
    },
  }),
  small: StyleSheet.create({
    button: {
      minHeight: 36,
      paddingHorizontal: 12,
      paddingVertical: 0,
    },
    text: {
      fontSize: 14,
      fontWeight: "normal",
    },
    icon: {
      marginRight: 5,
    },
  }),
};
