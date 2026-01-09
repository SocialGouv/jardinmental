import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import { colors } from "@/utils/colors";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Typography } from "./Typography";

export const Card = ({
  preset, // 'lighten'
  title,
  text,
  className,
  containerStyle,
  contentContainerStyle,
  innerContentContainerStyle,
  icon,
  image,
  onPress,
  mergeChildren = true,
  children,
}) => {
  const styles = applyStyles({ preset });

  const PressableIfNeeded = ({ children }) =>
    onPress ? (
      <TouchableOpacity onPress={onPress} hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
        {children}
      </TouchableOpacity>
    ) : (
      <>{children}</>
    );
  return (
    <View className={mergeClassNames("m-4 bg-blue bg-cyan-50-lighten-90 p-4 rounded-xl")}>
      <PressableIfNeeded>
        <View style={[styles.contentContainer, contentContainerStyle]}>
          {icon && <Icon width="26" height="26" color="#000091" {...icon} style={styles.image} />}
          {image && <Image {...image} style={styles.image} />}
          <View style={[styles.innerContentContainer, innerContentContainerStyle]}>
            {title && <Typography className={mergeClassNames(typography.textLgBold, "text-cnam-primary-900")}>{title}</Typography>}
            {text && <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 mt-4")}>{text}</Typography>}
            {children && mergeChildren && <View style={styles.childrenContainer}>{children}</View>}
          </View>
          {onPress && <Icon icon="ChevronRightSvg" color="#000091" height="16" width="16" />}
        </View>
        {children && !mergeChildren && <View style={styles.childrenContainer}>{children}</View>}
      </PressableIfNeeded>
    </View>
  );
};

const applyStyles = ({ preset }) => {
  const appliedStyles = {
    ..._styles.base,
  };

  // // FIX-EVAL: Fix made to have the app running but the code clear need a refactoring
  const applyIfNeeded = (cumStyles, styleKey) => {
    for (let key of Object.keys(_styles[styleKey])) cumStyles[key] = { ...cumStyles[key], ..._styles[styleKey][key] };
  };

  if (preset === "lighten") applyIfNeeded(appliedStyles, "lighten");
  if (preset === "grey") applyIfNeeded(appliedStyles, "grey");
  // Before the fix
  // const applyIfNeeded = (cumStyles, condition, styleKey) => {
  //   if (eval(condition)) {
  //     for (let key of Object.keys(_styles[styleKey])) cumStyles[key] = {...cumStyles[key], ..._styles[styleKey][key]};
  //   }
  // };
  // applyIfNeeded(appliedStyles, "preset==='lighten'", "lighten");
  // applyIfNeeded(appliedStyles, "preset==='grey'", "grey");

  return appliedStyles;
};

const _styles = {
  base: StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: colors.LIGHT_BLUE_TRANS_02,
      borderColor: colors.LIGHT_BLUE_TRANS_02,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
    },
    contentContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    image: {
      maxHeight: 40,
      maxWidth: 40,
      marginRight: 16,
    },
    innerContentContainer: {
      flexShrink: 1,
      flexGrow: 1,
      flexDirection: "column",
    },
    title: {
      fontSize: 16,
      marginBottom: 2,
      fontFamily: "SourceSans3",
      fontWeight: "700",
      textAlign: "left",
      color: colors.BLUE,
    },
    text: {
      fontSize: 14,
      marginVertical: 2,
      fontFamily: "SourceSans3",
      fontWeight: "400",
      textAlign: "left",
      color: colors.BLUE,
    },
    childrenContainer: {
      marginTop: 14,
    },
  }),
  lighten: StyleSheet.create({
    container: {
      backgroundColor: "#F4FCFD",
      borderColor: "#DEF4F5",
    },
    title: {
      fontSize: 18,
    },
  }),
  grey: StyleSheet.create({
    container: {
      backgroundColor: "#F8F9FB",
      borderColor: "#E7EAF1",
    },
  }),
};
