import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { InputText } from "../../../components/InputText";
import { InputCheckbox } from "../../../components/InputCheckbox";
import { colors } from "@/utils/colors";
import BasicCard from "@/components/BasicCard";
import CheckMarkIcon from "@assets/svg/icon/check";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

export const GoalCheckboxItem = ({ goal, index, checked, comment, onCheckedChanged, onCommentChanged }) => {
  const [_checked, _setChecked] = useState(checked);
  useEffect(() => {
    _setChecked(checked);
  }, [checked]);
  const [_comment, _setComment] = useState(comment);
  useEffect(() => {
    _setComment(comment);
  }, [comment]);

  return (
    <BasicCard completed={_checked}>
      <Pressable
        onPress={() => {
          const nextChecked = !_checked;
          _setChecked(nextChecked);
          onCheckedChanged?.({ checked: nextChecked, goal });
        }}
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      >
        <View style={[styles.contentContainer]}>
          <View className="flex-row items-start flex-1">
            <InputCheckbox
              containerStyle={{ marginVertical: 0, marginRight: 0, marginTop: 5 }}
              contentContainerStyle={{ paddingRight: 0 }}
              checked={_checked}
              onCheckedChanged={({ checked }) => {
                _setChecked(checked);
                onCheckedChanged?.({ checked, goal });
              }}
            />
            <View className="flex-row justify-between flex-1 items-start">
              <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>{goal.label}</Text>
              <View className="pt-1">
                <CheckMarkIcon color={_checked ? TW_COLORS.CNAM_PRIMARY_700 : "transparent"} />
              </View>
            </View>
          </View>
          <InputText
            fill
            preset="lighten"
            placeholder="Ajoutez une note sur cet objectif"
            containerStyle={{ marginTop: 16 }}
            value={_comment}
            onChangeText={(nextComment) => {
              _setComment(nextComment);
              onCommentChanged?.({ comment: nextComment, goal });
            }}
            multiline={true}
            textAlignVertical="top"
            className="p-0" // remove space that multiline adds
          />
        </View>
      </Pressable>
    </BasicCard>
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
  label: {
    fontSize: 16,
    fontFamily: "SourceSans3",
    fontWeight: "400",
    textAlign: "left",
    color: colors.BLUE,
    flexShrink: 1,
    marginLeft: 0,
    paddingTop: 3,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
  },
});
