import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import { buildSurveyData } from "./survey-data";
import { formatRelativeDate } from "../../utils/date/helpers";
import { isToday, isYesterday, parseISO } from "date-fns";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import { getScoreWithState } from "../../utils";
import Question from "./Question";
import InputQuestion from "./InputQuestion";
import QuestionYesNo from "./QuestionYesNo";
import logEvents from "../../services/logEvents";
import { DiaryDataContext } from "../../context/diaryData";
import { alertNoDataYesterday } from "./survey-data";
import localStorage from "../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import ArrowUpSvg from "../../../assets/svg/arrow-up.svg";

const DaySurvey = ({ navigation, route }) => {
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const questionToxic = {
    id: "TOXIC",
    label: "Avez-vous consommé des substances aujourd'hui ?",
  };
  const questionContext = {
    id: "CONTEXT",
    label: "Ajoutez une note générale sur votre journée",
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const q = await buildSurveyData();
        if (q) {
          setQuestions(q);
        }
      })();
    }, [])
  );

  useEffect(() => {
    //init the survey if there is already answers
    Object.keys(route?.params?.currentSurvey?.answers || {})?.forEach((key) => {
      const score = getScoreWithState({
        patientState: route?.params?.currentSurvey?.answers,
        category: key,
      });
      const cleanedQuestionId = key.split("_")[0];
      if (questions.find((q) => q.id === cleanedQuestionId)) {
        toggleAnswer({ key: cleanedQuestionId, value: score });
        handleChangeUserComment({
          key: cleanedQuestionId,
          userComment: route?.params?.currentSurvey?.answers[cleanedQuestionId]?.userComment,
        });
      }
    });
    if ((route?.params?.currentSurvey?.answers || {})[questionToxic.id]) {
      toggleAnswer({
        key: questionToxic.id,
        value: route?.params?.currentSurvey?.answers[questionToxic?.id]?.value,
      });
      handleChangeUserComment({
        key: questionToxic.id,
        userComment: route?.params?.currentSurvey?.answers[questionToxic?.id]?.userComment,
      });
    }
    if ((route?.params?.currentSurvey?.answers || {})[questionContext.id]) {
      handleChangeUserComment({
        key: questionContext.id,
        userComment: route?.params?.currentSurvey?.answers[questionContext?.id]?.userComment,
      });
    }
  }, [route?.params?.currentSurvey?.answers, questions, questionToxic.id, questionContext?.id]);

  const toggleAnswer = async ({ key, value }) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], value },
      };
    });
  };

  const handleChangeUserComment = ({ key, userComment }) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], userComment },
      };
    });
  };

  const submitDay = async ({ redirectBack = false }) => {
    const prevCurrentSurvey = route.params?.currentSurvey;
    const currentSurvey = {
      date: prevCurrentSurvey?.date,
      answers: { ...prevCurrentSurvey.answers, ...answers },
    };
    setDiaryData(currentSurvey);
    logEvents.logFeelingAdd();
    logEvents.logFeelingAddComment(
      Object.keys(answers).filter(
        (key) => ![questionToxic.id, questionContext.id].includes(key) && answers[key].userComment
      )?.length
    );
    logEvents.logFeelingAddContext(answers[questionContext.id]?.userComment ? 1 : 0);
    logEvents.logFeelingResponseToxic(answers[questionToxic.id]?.value ? 1 : 0);

    if (route.params?.redirect) {
      alertNoDataYesterday({
        date: prevCurrentSurvey?.date,
        diaryData,
        navigation,
      });
      return navigation.navigate("tabs");
    }

    if (redirectBack) {
      return navigation.goBack();
    }

    const medicalTreatmentStorage = await localStorage.getMedicalTreatment();
    if (medicalTreatmentStorage?.length === 0) {
      alertNoDataYesterday({
        date: prevCurrentSurvey?.date,
        diaryData,
        navigation,
      });
      return navigation.navigate("tabs");
    }

    navigation.navigate("drugs", {
      currentSurvey,
      editingSurvey: route.params?.editingSurvey,
    });
  };

  const renderQuestion = () => {
    if (isYesterday(parseISO(route.params?.currentSurvey?.date)))
      return "Comment s'est passée la journée d'hier ?";
    if (isToday(parseISO(route.params?.currentSurvey?.date))) return "Comment s'est passée votre journée ?";
    let relativeDate = formatRelativeDate(route.params?.currentSurvey?.date);
    relativeDate = `le ${relativeDate}`;
    return `Comment s'est passé ${relativeDate} ?`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={() => submitDay({ redirectBack: true })} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "height"} style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("symptoms");
              logEvents.logSettingsSymptomsFromSurvey();
            }}
          >
            <View style={styles.linkContainer}>
              <Text style={styles.link}>Ajouter ou retirer des éléments de mon questionnaire</Text>
              <View style={styles.linkButtonContainer}>
                <ArrowUpSvg color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.question}>{renderQuestion()}</Text>
          {questions.map((q, i) => (
            <Question
              key={i}
              question={q}
              onPress={toggleAnswer}
              selected={answers[q.id]?.value}
              explanation={q.explanation}
              onChangeUserComment={handleChangeUserComment}
              userComment={answers[q.id]?.userComment}
            />
          ))}
          <InputQuestion
            question={questionContext}
            onPress={toggleAnswer}
            selected={answers[questionContext.id]?.value}
            explanation={questionContext.explanation}
            onChangeUserComment={handleChangeUserComment}
            userComment={answers[questionContext.id]?.userComment}
            placeholder="Contexte, évènements, mes comportements ..."
          />
          <QuestionYesNo
            question={questionToxic}
            onPress={toggleAnswer}
            selected={answers[questionToxic.id]?.value}
            explanation={questionToxic.explanation}
            isLast
            onChangeUserComment={handleChangeUserComment}
            userComment={answers[questionToxic.id]?.userComment}
          />
          <View style={styles.divider} />
          <View style={styles.buttonWrapper}>
            <Button onPress={submitDay} title="Valider" />
          </View>
          <Text style={styles.subtitle}>
            Retrouvez toutes vos notes dans l'onglet &quot;Mon&nbsp;journal&quot;
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: "#F4FCFD",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 15,
  },
  selectionContainer: {
    padding: 3,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
  },
  selectionYesNoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 99999,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  arrowDown: {
    transform: [{ rotate: "180deg" }],
  },
  arrowUp: {
    transform: [{ rotate: "0deg" }],
  },

  buttonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,183,200, .09)",
    marginVertical: 10,
    width: "65%",
    alignSelf: "center",
  },

  questionContainer: {
    display: "flex",
  },
  questionHeaderContainer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  questionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionInfo: {
    marginTop: 15,
  },
  questionPoint: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: colors.LIGHT_BLUE,
  },
  questionTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  answerContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    marginLeft: 18, // padding of the header question container + half of the dot size => 10 + 8 = 18
    display: "flex",
    justifyContent: "space-around",
  },
  answersContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 15,
  },
  leftFileAriane: {
    borderLeftColor: "#DEF4F5",
    borderLeftWidth: 2,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  question: {
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 25,
  },
  linkContainer: {
    backgroundColor: "#D2F4F7",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 0.5,
    borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  link: {
    color: colors.BLUE,
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  linkButtonContainer: {
    borderRadius: 20,
    backgroundColor: colors.LIGHT_BLUE,
    height: 40,
    width: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    transform: [{ rotate: "90deg" }],
    margin: 7,
  },
  subtitleTop: {
    flex: 1,
    color: colors.LIGHT_BLUE,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
    textAlign: "center",
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
    textAlign: "center",
  },
  answer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#D4F0F2",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "600",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 19,
  },
  textInput: {
    fontSize: 20,
  },
  bottom: {
    justifyContent: "flex-end",
    marginBottom: 36,
  },
});

export default DaySurvey;
