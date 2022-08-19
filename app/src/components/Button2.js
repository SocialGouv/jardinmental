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
    _style = {
      backgroundColor: "#1FC6D5",
      shadowColor: "#0A215C",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    };
    if (!fill && size === "normal") _style.minWidth = "70%";
    _textStyle.color = "#FFF";
  } else if (preset === "secondary") {
    _style.backgroundColor = "transparent";
    _style.borderColor = colors.DARK_BLUE;
    _style.borderWidth = 1;
    _textStyle.color = colors.DARK_BLUE;
  }

  if (checkable) {
    if (preset === "primary") {
      // TODO
    } else if (preset === "secondary") {
      _style.backgroundColor = !checked ? "transparent" : colors.DARK_BLUE;
      _textStyle.color = !checked ? colors.DARK_BLUE : "white";
    }
  }

  if (type === "outline") {
    _style.backgroundColor = "transparent";
    _style.borderColor = colors.DARK_BLUE;
    _style.borderWidth = 1;
    _textStyle.color = colors.DARK_BLUE;
  }

  if (type === "clear") {
    _style.backgroundColor = "transparent";
    _textStyle.color = textStyle?.color ?? colors.DARK_BLUE;

    if (square) {
      _style.minHeight = 0;
      _style.padding = 7;
    }
  }

  if (size === "small") {
    _style.minHeight = 30;
    _style.paddingHorizontal = 12;
    _style.paddingVertical = 0;
    _textStyle.fontSize = 14;
    _textStyle.fontWeight = "normal";
    _iconStyle.marginRight = 5;
    _iconSize = iconSize ?? 16;
  }

  const frontColor = textStyle.color || _textStyle.color || styles.text.color;

  const iconStyles = [
    styles.icon,
    { width: Math.min(_iconSize, styles.text.fontSize), height: Math.min(_iconSize, styles.text.fontSize) },
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
    <View style={[styles.container, _containerStyle, containerStyle, fill && { width: "100%" }]}>
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} testID={testID}>
        <View
          style={[
            styles.button,
            _style,
            style,
            fill && { width: "100%" },
            square && {
              aspectRatio: 1,
              paddingHorizontal: 0,
              borderRadius: size === "small" ? 15 : 20,
            },
            disabled && styles.disabled,
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
              style={[styles.text, _textStyle, textStyle]}
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

const styles = StyleSheet.create({
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
});
