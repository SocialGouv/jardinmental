import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Separator from "./Separator";
import { colors } from "@/utils/colors";
export const InputGroup = ({ children, containerStyle, highlight }) => {
  return (
    <View
      style={[
        styles.groupContainer,
        highlight
          ? {
              backgroundColor: "#F4FCFD",
              borderColor: "#DEF4F5",
            }
          : {
              backgroundColor: "#F8F9FB",
              borderColor: "#E7EAF1",
            },
        containerStyle,
      ]}
    >
      {children
        .filter((child) => !!child)
        .map((child, index) => (
          <View key={`${index}`}>
            {index > 0 && <Separator />}
            {child}
          </View>
        ))}
    </View>
  );
};

export const InputGroupItem = ({ label, children, onPress }) => {
  return (
    <View style={styles.itemContainer}>
      <Pressable onPress={onPress} hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
        <View style={styles.itemContentContainer}>
          {label && <Text style={styles.itemLabel}>{label}</Text>}
          {children}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: "100%",
  },
  itemContainer: {},
  itemContentContainer: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    textAlign: "left",
    color: colors.BLUE,
    flex: 1,
    marginRight: 8,
  },
});
