import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, TextInput, Platform } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import Icon from "../../components/Icon";
import BasicCard from "@/components/BasicCard";
import { InputText } from "@/components/InputText";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Typography } from "@/components/Typography";

const Question = ({ question, explanation, isLast, onChangeUserComment, userComment, placeholder = "Message..." }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const toggleShowExplanation = async () => {
    setShowExplanation((prev) => !prev);
  };
  const [text, setText] = useState("");
  useEffect(() => {
    setText(userComment || "");
  }, [userComment]);

  return (
    <BasicCard>
      <TouchableOpacity onPress={toggleShowExplanation}>
        <View style={styles.questionHeader}>
          {explanation ? (
            <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} styleContainer={{ width: 25, height: 25 }} />
          ) : (
            <View />
          )}
          <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>{question.label}</Typography>
          {/* we put a view here because we'll add a item here later */}
          <View />
        </View>
        {explanation && showExplanation ? (
          <View style={styles.questionInfo}>
            <Typography>{explanation}</Typography>
          </View>
        ) : null}
      </TouchableOpacity>

      <View style={styles.answerContainer}>
        <InputText
          fill
          preset="iconWithHidePlaceholder"
          placeholder={placeholder}
          value={text}
          multiline={true}
          numberOfLines={Platform.OS === "ios" ? null : 3}
          minHeight={30 * 3}
          onChangeText={(v) => {
            setText(v);
            onChangeUserComment({ key: question.id, userComment: v });
          }}
          textAlignVertical={"top"}
          containerStyle={{ marginTop: 20 }}
        />
      </View>
    </BasicCard>
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
    fontFamily: "SourceSans3-Bold",
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
    fontFamily: "SourceSans3-Bold",
    textDecorationLine: "underline",
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
});

export default Question;
