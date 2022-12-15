import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { InputCheckbox } from "../../../components/InputCheckbox";

export const GoalAddCheckable = ({ goal, checked, onCheckedChanged }) => {
  const [_checked, _setChecked] = useState(checked);
  useEffect(() => {
    _setChecked(checked);
  }, [checked]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: _checked ? "#F4FCFD" : "#F8F9FB",
          borderColor: _checked ? "#DEF4F5" : "#E7EAF1",
        },
      ]}
    >
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
    borderWidth: 1,
    borderRadius: 16,
    marginVertical: 8,
  },
  contentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
