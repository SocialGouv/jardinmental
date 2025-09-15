import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { autoLayoutAnimation } from "../utils/autoLayoutAnimation";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";
import CheckMarkIcon from "@assets/svg/icon/check";
import CrossIcon from "@assets/svg/icon/Cross";

export const InputToggle = forwardRef(({ checked, onCheckedChanged, containerStyle }, ref) => {
  useImperativeHandle(ref, () => {
    return {
      toggle,
    };
  });

  const [_checked, _setChecked] = useState(checked);
  useEffect(() => {
    _setChecked(checked);
  }, [checked]);

  const toggle = () => {
    const nextChecked = !_checked;
    _setChecked(nextChecked);
    autoLayoutAnimation();
    onCheckedChanged?.({ checked: nextChecked });
  };

  return (
    <View
      style={[
        styles.container,
        {
          // borderColor: _checked ? colors.LIGHT_BLUE : "#CCCCCC",
          backgroundColor: _checked ? TW_COLORS.CNAM_CYAN_700_DARKEN_40 : TW_COLORS.GRAY_700,
        },
        containerStyle,
      ]}
    >
      {_checked && (
        <View className="absolute left-2 top-[6]">
          <CheckMarkIcon width={15} height={15} color={TW_COLORS.WHITE} />
        </View>
      )}
      <Pressable style={{ flex: 1 }} onPress={toggle} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
        <View
          style={[
            styles.contentContainer,
            {
              alignItems: !_checked ? "flex-start" : "flex-end",
            },
          ]}
        >
          <View
            className="bg-white"
            style={[
              styles.circle,
              // {
              //   backgroundColor: _checked ? colors.LIGHT_BLUE : "#CCCCCC",
              // },
            ]}
            collapsable={false}
          />
        </View>
      </Pressable>
      {!_checked && (
        <View className="absolute right-2 top-[6]">
          <CrossIcon color={TW_COLORS.WHITE} />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 57,
    height: 28,
    borderRadius: 24,
    // borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 16,
  },
});
