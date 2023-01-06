import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, TextInput, Platform } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";

const Question = ({
  question,
  explanation,
  isLast,
  onChangeUserComment,
  userComment,
  placeholder = "Message...",
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const toggleShowExplanation = async () => {
    setShowExplanation((prev) => !prev);
  };
  const [text, setText] = useState("");
  useEffect(() => {
    setText(userComment || "");
  }, [userComment]);

  return (
    <View
      style={[
        styles.questionContainer,
        {
          backgroundColor: text !== undefined && text?.length > 0 ? "#F0FFF0" : "#F8F9FB",
          borderColor: text !== undefined && text?.length > 0 ? "#D0E8D0" : "#E7EAF1",
        },
      ]}
    >
      <TouchableOpacity onPress={toggleShowExplanation}>
        <View style={styles.questionHeader}>
          {explanation ? (
            <Icon
              icon="InfoSvg"
              width={25}
              height={25}
              color={colors.LIGHT_BLUE}
              styleContainer={{ width: 25, height: 25 }}
            />
          ) : (
            <View />
          )}
          <Text style={styles.questionTitle}>{question.label}</Text>
          {/* we put a view here because we'll add a item here later */}
          <View />
        </View>
        {explanation && showExplanation ? (
          <View style={styles.questionInfo}>
            <Text>{explanation}</Text>
          </View>
        ) : null}
      </TouchableOpacity>

      <View style={styles.answerContainer}>
        <TextInput
          multiline={true}
          numberOfLines={Platform.OS === "ios" ? null : 3}
          minHeight={Platform.OS === "ios" ? 30 * 3 : null}
          onChangeText={(v) => {
            setText(v);
            onChangeUserComment({ key: question.id, userComment: v });
          }}
          value={text}
          placeholder={placeholder}
          style={styles.textArea}
          textAlignVertical={"top"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: "#fff",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  questionContainer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
  },

  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  questionInfo: {
    marginTop: 15,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  answerContainer: {
    paddingTop: 10,
  },
  leftFileAriane: {
    borderLeftColor: "#DEF4F5",
    borderLeftWidth: 2,
  },
  backButton: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
});

export default Question;
