import React from "react";
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import { colors } from "../utils/colors";

export const Button2 = ({
  preset = "primary", // 'primary' | 'secondary'
  type = "solid", //'solid' | 'clear' | 'outline'
  size = "normal", // 'normal' | 'small'
  fill = false, // fill horizontally
  square = false,
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
  let _style = {};
  let _containerStyle = {};
  let _textStyle = {};
  let _iconStyle = {};
  let _disabledStyle = {};
  let _iconSize = iconSize ?? 30;

  if (preset === "primary") {
    _style = { ..._style, ...styles.primary.button };
    _textStyle = { ..._textStyle, ...styles.primary.text };
  } else if (preset === "secondary") {
    _style = { ..._style, ...styles.secondary.button };
    _textStyle = { ..._textStyle, ...styles.secondary.text };
  }

  if (!fill && size === "normal") _style.minWidth = "70%";

  if (checkable) {
    if (preset === "primary") {
    } else if (preset === "secondary") {
      _style.backgroundColor = !checked ? "transparent" : colors.DARK_BLUE;
      _textStyle.color = !checked ? colors.DARK_BLUE : "white";
    }
  }

  if (type === "outline") {
    _style = { ..._style, ...styles.outline.button };
    _textStyle = { ..._textStyle, ...styles.outline.text };
  }

  if (type === "clear") {
    _style = { ..._style, ...styles.clear.button };
    _textStyle = { ..._textStyle, ...styles.clear.text };

    if (square) {
      _style.minHeight = 0;
      _style.padding = 7;
    }
  }

  if (size === "small") {
    _style = { ..._style, ...styles.small.button };
    _textStyle = { ..._textStyle, ...styles.small.text };
    _iconStyle = { ..._iconStyle, ...styles.small.icon };
    _iconSize = iconSize ?? 16;
  }

  const frontColor = textStyle.color || _textStyle.color || styles.base.text.color;

  const iconStyles = [
    styles.base.icon,
    {
      width: Math.min(_iconSize, styles.base.text.fontSize),
      height: Math.min(_iconSize, styles.base.text.fontSize),
    },
    _iconStyle,
    iconStyle,
    !title?.length && { marginRight: 0 },
  ];

  let _icon = null;
  if (React.isValidElement(icon)) {
    _icon = icon;
  } else if (typeof icon === "string") {
    _icon = <Icon icon={icon} />;
  }

  return (
    <View style={[styles.base.container, _containerStyle, containerStyle, fill && { width: "100%" }]}>
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} testID={testID}>
        <View
          style={[
            styles.base.button,
            _style,
            style,
            fill && { width: "100%" },
            square && {
              aspectRatio: 1,
              paddingHorizontal: 0,
              borderRadius: size === "small" ? 15 : 20,
            },
            disabled && styles.base.disabled,
            disabled && _disabledStyle,
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
            <Text
              allowFontScaling={false}
              style={[styles.base.text, _textStyle, textStyle]}
              testID={`${testID}-text`}
            >
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
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
      backgroundColor: "transparent",
      borderColor: colors.DARK_BLUE,
      borderWidth: 1,
    },
    text: {
      color: colors.DARK_BLUE,
    },
  }),
  outline: StyleSheet.create({
    button: {
      backgroundColor: "transparent",
      borderColor: colors.DARK_BLUE,
      borderWidth: 1,
    },
    text: {
      color: colors.DARK_BLUE,
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
      minHeight: 30,
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
