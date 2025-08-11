import React, { useEffect, useState, useContext, useRef } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "../../components/MyText";
import { beforeToday, formatDay, formatRelativeDate } from "../../utils/date/helpers";
import { isToday, isYesterday, parseISO } from "date-fns";
import { getScoreWithState } from "../../utils";
import InputQuestion from "./InputQuestion";
import QuestionYesNo from "./QuestionYesNo";
import logEvents from "../../services/logEvents";
import { DiaryDataContext } from "../../context/diaryData";
import { alertNoDataYesterday } from "./survey-data";
import localStorage from "../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import { GoalsDaySurvey } from "../goals/survey/GoalsDaySurvey";
import { Button2 } from "../../components/Button2";
import { Card } from "../../components/Card";
import { DiaryDataNewEntryInput } from "../../entities/DiaryData";
import { Indicator } from "../../entities/Indicator";
import { IndicatorSurveyItem } from "@/components/survey/IndicatorSurveyItem";

const DaySurvey = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params?: {
      currentSurvey: DiaryDataNewEntryInput;
      editingSurvey: boolean;
      redirect?: boolean;
    };
  };
}) => {
  const initSurvey: DiaryDataNewEntryInput = route?.params?.currentSurvey ?? {
    date: formatDay(beforeToday(0)),
    answers: {},
  };
  const initEditiingSurvey = route?.params?.editingSurvey ?? false;

  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);

  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const [answers, setAnswers] = useState<DiaryDataNewEntryInput["answers"]>({});

  const scrollRef = useRef<ScrollView | null>(null);

  const goalsRef = useRef<{ onSubmit?: () => Promise<void> }>(null);

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
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, [])
  );

  useEffect(() => {
    //init the survey if there is already answers
    const initialAnswers = {};
    const surveyAnswers = initSurvey?.answers || {};
    if (!surveyAnswers || userIndicateurs.length === 0) {
      return;
    }
    Object.keys(surveyAnswers).forEach((key) => {
      const answer = surveyAnswers[key];
      if (!answer) return;
      // Handle special questions (TOXIC, CONTEXT)
      if (key === questionToxic.id || key === questionContext.id) {
        initialAnswers[key] = {
          ...answer,
          value: answer.value,
          userComment: answer.userComment,
        };
        return;
      }
      const cleanedQuestionId = key.split("_")[0];
      // previous indicators where using '_', we cleaned it when editing it apparently
      const _indicateur = userIndicateurs.find((i) => i.name === cleanedQuestionId);
      if (_indicateur) {
        let value = answer.value;
        if (!["gauge", "boolean"].includes(_indicateur.type)) {
          // for retro caompatibility with certain types of indicators
          value = getScoreWithState({
            patientState: initSurvey?.answers,
            category: key,
          });
        }
        initialAnswers[cleanedQuestionId] = {
          value: answer.value,
          userComment: answer.userComment,
          _indicateur,
        };
      }
    });
    setAnswers(initialAnswers);
  }, [initSurvey?.answers, questionToxic.id, questionContext?.id, userIndicateurs]);

  const toggleAnswer = async ({ key, value }) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], value, _indicateur: userIndicateurs.find((i) => i.name === key) },
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
    const prevCurrentSurvey = initSurvey;
    const currentSurvey: DiaryDataNewEntryInput = {
      date: prevCurrentSurvey.date,
      answers: { ...prevCurrentSurvey.answers, ...answers },
    };
    addNewEntryToDiaryData(currentSurvey);
    if (goalsRef.current && typeof goalsRef.current.onSubmit === "function") {
      await goalsRef.current.onSubmit();
    }
    logEvents.logFeelingAdd();
    logEvents.logFeelingSubmitSurvey(userIndicateurs.filter((i) => i.active).length);
    logEvents.logFeelingAddComment(
      Object.keys(answers).filter((key) => ![questionToxic.id, questionContext.id].includes(key) && answers[key].userComment)?.length
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
      if (navigation.canGoBack()) return navigation.goBack();
      else navigation.navigate("tabs");
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
      editingSurvey: initEditiingSurvey,
    });
  };

  const renderQuestion = () => {
    if (isYesterday(parseISO(initSurvey?.date))) return "Comment s'est passée la journée d'hier ?";
    if (isToday(parseISO(initSurvey?.date))) return "Comment s'est passée votre journée ?";
    let relativeDate = formatRelativeDate(initSurvey?.date);
    relativeDate = `le ${relativeDate}`;
    return `Comment s'est passé ${relativeDate} ?`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // adjust to your header height
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-5 bg-white/90 z-50">
          {navigation.canGoBack() && (
            <Button2
              preset=""
              type="outline"
              circle
              size="normal"
              icon="ArrowUpSvg"
              iconStyle={{ transform: [{ rotate: "270deg" }] }}
              onPress={() => navigation.goBack()}
            />
          )}
          <Text className="flex-1 text-lg font-bold text-center px-1">Mon questionnaire</Text>
          <View className="w-[45px]" />
        </View>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode="interactive"
          className="grow"
          contentContainerStyle={{
            paddingTop: 80,
            paddingHorizontal: 16,
            paddingBottom: 80,
          }}
        >
          <View>
            <View className="mb-2">
              <Card
                preset="lighten"
                title={renderQuestion()}
                image={{ source: require("./../../../assets/imgs/indicateur.png") }}
                containerStyle={{ marginBottom: 16 }}
              />
              {userIndicateurs
                .filter((ind) => ind.active)
                .map((ind, index) => (
                  <IndicatorSurveyItem
                    key={ind?.uuid}
                    showComment={true}
                    indicator={ind}
                    index={index}
                    value={answers?.[ind?.name]?.value}
                    onValueChanged={({ indicator, value }) => toggleAnswer({ key: indicator?.name, value })}
                    onCommentChanged={({ indicator, comment }) => handleChangeUserComment({ key: indicator?.name, userComment: comment })}
                    comment={answers?.[ind?.name]?.userComment}
                  />
                ))}
              <Card
                title="Personnaliser mes indicateurs"
                icon={{ icon: "ImportantSvg" }}
                onPress={() => {
                  navigation.navigate("symptoms");
                  logEvents.logSettingsSymptomsFromSurvey();
                }}
                className="my-2"
              />
            </View>
          </View>
          <GoalsDaySurvey date={initSurvey?.date} ref={goalsRef} scrollRef={scrollRef} route={route} />
          <InputQuestion
            question={questionContext}
            onPress={toggleAnswer}
            selected={answers[questionContext.id]?.value}
            explanation={questionContext.explanation}
            onChangeUserComment={handleChangeUserComment}
            userComment={answers[questionContext.id]?.userComment}
            placeholder="Contexte, évènements, comportement de l'entourage..."
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
          <View className="h-[1px] bg-neutral-200 mx-5 my-2.5 w-full self-center" />
          <Text className="flex-1 text-black text-sm font-normal text-center">Retrouvez toutes vos notes dans l'onglet "Mon&nbsp;journal"</Text>
        </ScrollView>
        <View className={`absolute bottom-0 left-0 right-0 p-4 bg-white z-50 ${Platform.OS === "android" ? "pb-4" : "pb-0"}`}>
          <Button2 fill title="Valider" onPress={submitDay} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DaySurvey;
