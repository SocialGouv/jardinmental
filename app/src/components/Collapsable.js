import React, { useState, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ArrowUpSvg from "../../assets/svg/arrow-up.svg";
import { autoLayoutAnimation } from "../utils/autoLayoutAnimation";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";

export const Collapsable = ({
  preset, // 'primary' | 'secondary'
  title,
  children,
  containerStyle,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const styles = applyStyles({ preset });

  const onPress = useCallback(() => {
    setCollapsed(!collapsed);
    arrowAnimated.value = withTiming(collapsed ? 360 : 180);
    autoLayoutAnimation();
  }, [collapsed]);

  const arrowAnimated = useSharedValue(180);
  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowAnimated.value}deg` }],
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.pressableContainer]}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.headerContainer]}>
            {title && <Text style={[styles.title]}>{title}</Text>}
            <Animated.View style={arrowAnimatedStyle}>
              <ArrowUpSvg color={colors.BLUE} />
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
      {!collapsed && <View style={[styles.childrenContainer]}>{children}</View>}
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

  if (preset === "primary") applyIfNeeded(appliedStyles, "primary");
  if (preset === "secondary") applyIfNeeded(appliedStyles, "secondary");

  // Before the fix
  // const applyIfNeeded = (cumStyles, condition, styleKey) => {
  //   if (eval(condition)) {
  //     for (let key of Object.keys(_styles[styleKey]))
  //       cumStyles[key] = { ...cumStyles[key], ..._styles[styleKey][key] };
  //   }
  // };
  // applyIfNeeded(appliedStyles, "preset==='primary'", "primary");
  // applyIfNeeded(appliedStyles, "preset==='secondary'", "secondary");

  return appliedStyles;
};

const _styles = {
  base: StyleSheet.create({
    container: {
      width: "100%",
    },
    headerContainer: {
      flexDirection: "row",
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      fontSize: 18,
      marginBottom: 2,
      fontFamily: "SourceSans3",
      fontWeight: "400",
      color: colors.BLUE,
    },
  }),
  primary: StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderColor: TW_COLORS.CNAM_PRIMARY_800,
      marginTop: 10,
    },
    headerContainer: {
      minHeight: 52,
    },
    childrenContainer: {
      paddingBottom: 10,
    },
  }),
  secondary: StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: "#E7EAF1",
      borderRadius: 12,

      backgroundColor: "#F8F9FB",
      marginVertical: 8,
    },
    headerContainer: {
      paddingVertical: 12,
      paddingHorizontal: 15,
    },
    childrenContainer: {
      paddingTop: 10,
      paddingHorizontal: 15,
    },
  }),
};
