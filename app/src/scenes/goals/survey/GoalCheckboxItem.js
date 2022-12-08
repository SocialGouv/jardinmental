import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, LayoutAnimation } from "react-native";
import Lottie from "lottie-react-native";
import { InputText } from "../../../components/InputText";

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: _checked ? "#F0FFF0" : "#F8F9FB",
          borderColor: _checked ? "#D0E8D0" : "#E7EAF1",
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
        <View style={[styles.contentContainer]}>
          <View style={[styles.topContainer]}>
            <View
              style={[
                styles.checkboxContainer,
                !_checked
                  ? {
                      borderColor: "#26387C",
                    }
                  : {
                      borderColor: "#1FC6D5",
                      backgroundColor: "#1FC6D5",
                    },
              ]}
            >
              {_checked && (
                <Lottie
                  source={require("../../../../assets/lottiefiles/checkmark.json")}
                  style={styles.lottieAnim}
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
            <Text style={[styles.label]}>{goal.label}</Text>
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
    fontFamily: "Karla",
    fontWeight: "400",
    textAlign: "left",
    color: "#26387C",
    flexShrink: 1,
    marginLeft: 8,
    paddingTop: 3,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
  },
});
