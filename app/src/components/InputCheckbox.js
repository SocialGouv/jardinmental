import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Lottie from "lottie-react-native";
import checkmarkAnimation from "../../assets/lottiefiles/checkmark.json";
import { colors } from "@/utils/colors";

export const InputCheckbox = ({ label, checked, fill, onCheckedChanged, containerStyle, contentContainerStyle }) => {
  const [_checked, _setChecked] = useState(checked);
  useEffect(() => {
    _setChecked(checked);
  }, [checked]);

  return (
    <View style={[styles.container, fill && { width: "100%" }, containerStyle]}>
      <Pressable
        onPress={() => {
          const nextChecked = !_checked;
          _setChecked(nextChecked);
          onCheckedChanged?.({ checked: nextChecked });
        }}
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      >
        <View style={[styles.contentContainer, contentContainerStyle]}>
          <View
            style={[
              styles.checkboxContainer,
              !_checked
                ? {
                    borderColor: colors.BLUE,
                  }
                : {
                    borderColor: colors.LIGHT_BLUE,
                    backgroundColor: colors.LIGHT_BLUE,
                  },
            ]}
          >
            {_checked && (
              <Lottie
                source={checkmarkAnimation}
                style={[{ width: 10, height: 20 }]}
                loop={false}
                autoPlay
                colorFilters={[
                  {
                    keypath: "Shape Layer 1",
                    color: "white",
                  },
                ]}
              />
            )}
          </View>
          <Text style={[styles.label]}>{label}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    textAlign: "left",
    color: colors.BLUE,
    flexShrink: 1,
    marginLeft: 8,
    paddingTop: 2,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
