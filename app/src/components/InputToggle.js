import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { autoLayoutAnimation } from "../utils/autoLayoutAnimation";
import { colors } from "@/utils/colors";

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
          borderColor: _checked ? colors.LIGHT_BLUE : "#CCCCCC",
          backgroundColor: _checked ? "rgba(31, 198, 213, 0.1)" : "#FFFFFF",
        },
        containerStyle,
      ]}
    >
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
            style={[
              styles.circle,
              {
                backgroundColor: _checked ? colors.LIGHT_BLUE : "#CCCCCC",
              },
            ]}
            collapsable={false}
          />
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 24,
    borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
});
