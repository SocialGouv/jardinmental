import React from "react";
import { StyleSheet, View, Pressable, PixelRatio } from "react-native";
import { BasicIcon } from "../CircledIcon";
import { answers as emojis } from "../../scenes/survey-v2/utils";
import { colors } from "@/utils/colors";
import { TW_COLORS } from "@/utils/constants";

type Emoji = {
  score?: number;
  backgroundColor?: string;
  iconColor?: string;
  icon?: string;
  pressedBackgroundColor?: string;
};

export const Smiley = ({ indicator, value, onValueChanged }) => {
  const fontScale = PixelRatio.getFontScale();
  return (
    <View style={[styles.emojisContainer]}>
      {emojis
        .map((emoji, i) => {
          let _emoji: Emoji = {};
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
                onValueChanged?.({ indicator, value: nextValue });
              }}
            >
              {({ pressed }) => (
                <View>
                  {/* 
                    We apply "inverse scaling" to keep the component clickable despite Android's accessibility zoom.
                  */}
                  <BasicIcon
                    color={pressed ? emoji.pressedBackgroundColor : emoji.backgroundColor}
                    borderColor={TW_COLORS.PRIMARY}
                    iconColor={emoji.iconColor}
                    icon={emoji.icon}
                    borderWidth={active ? 2 : 0}
                    iconContainerStyle={{ marginRight: 0 }}
                    iconWidth={fontScale > 1 ? 28 : 32}
                    isScaled={fontScale > 1}
                    iconHeight={fontScale > 1 ? 28 : 32}
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
