import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Pressable } from "react-native";
import { BasicIcon } from "../CircledIcon";
import { answers as emojis } from "../../scenes/survey-v2/utils";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";

export const Smiley = ({ indicator, value, onValueChanged }) => {
  return (
    <View style={[styles.emojisContainer]}>
      {emojis
        .map((emoji, i) => {
          let _emoji = {};
          if (indicator.order === "DESC") {
            _emoji = emojis[emojis.length - 1 - i];
          } else {
            Object.assign(_emoji, emoji);
          }
          _emoji.score = i + 1;
          return _emoji;
        })
        .map((emoji, i) => {
          const active = value === emoji.score;
          return (
            <Pressable
              key={i}
              onPress={() => {
                const nextValue = emoji?.score;
                console.log("✍️  nextValue", nextValue);
                onValueChanged?.({ indicator, value: nextValue });
              }}
            >
              {({ pressed }) => (
                <View>
                  <BasicIcon
                    color={pressed ? emoji.pressedBackgroundColor : emoji.backgroundColor}
                    borderColor={TW_COLORS.PRIMARY}
                    iconColor={emoji.iconColor}
                    icon={emoji.icon}
                    borderWidth={active ? 2 : 0}
                    iconContainerStyle={{ marginRight: 0 }}
                    iconWidth={32}
                    iconHeight={32}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
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
    padding: 16,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    textAlign: "left",
    color: colors.BLUE,
    flexShrink: 1,
    marginLeft: 8,
    paddingTop: 3,
  },
  emojisContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  selectionContainer: {
    // padding: 6,
    // backgroundColor: "white",
    // borderColor: "#DEF4F5",
    // borderWidth: 1,
    // borderRadius: 8,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
});
