import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { InputCheckbox } from "../../../components/InputCheckbox";
import { mergeClassNames } from "@/utils/className";

export const GoalAddCheckable = ({ goal, checked, onCheckedChanged, index }) => {
  const [_checked, _setChecked] = useState(checked);
  useEffect(() => {
    _setChecked(checked);
  }, [checked]);

  return (
    <View className={mergeClassNames(index !== 0 ? "border-t border-gray-300" : "", "pb-2 pt-1")} pointerEvents="none">
      <Pressable
        onPress={() => {
          const nextChecked = !_checked;
          _setChecked(nextChecked);
          onCheckedChanged?.({ checked: nextChecked, goal });
        }}
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      >
        <View style={[styles.contentContainer]} pointerEvents="none">
          <InputCheckbox label={goal.label} checked={_checked} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // borderWidth: 1,
    borderRadius: 16,
    marginVertical: 4,
  },
  contentContainer: {
    // paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
