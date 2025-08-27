import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { beforeToday, formatDate, formatDay, formatRelativeDate } from "../../utils/date/helpers";
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
import {
  INDICATEURS_HUMEUR,
  NEW_INDICATORS_CATEGORIES,
  GENERIC_INDICATOR_SUBSTANCE,
  STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE,
  INDICATORS,
} from "@/utils/liste_indicateurs.1";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { HELP_FOR_CATEGORY, INDICATOR_CATEGORIES_DATA } from "../onboarding-v2/data/helperData";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import JMButton from "@/components/JMButton";
import { useBottomSheet } from "@/context/BottomSheetContext";
import HelpView from "@/components/HelpView";
import { INDICATORS_CATEGORIES } from "@/entities/IndicatorCategories";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import Pencil from "@assets/svg/Pencil";
import ArrowIcon from "@assets/svg/icon/Arrow";
import NavigationButtons from "@/components/onboarding/NavigationButtons";

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
  const { showBottomSheet } = useBottomSheet();

  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const groupedIndicators = useMemo(() => {
    return userIndicateurs.reduce<Record<NEW_INDICATORS_CATEGORIES, Indicator[]>>((acc, indicator) => {
      const category =
        INDICATORS.find((ind) => [indicator.uuid, indicator.baseIndicatorUuid, indicator.genericUuid].includes(ind.uuid))?.mainCategory ||
        NEW_INDICATORS_CATEGORIES.OTHER;

      if (!acc[category]) {
        acc[category] = [];
      }
      if (indicator.active && indicator.uuid !== INDICATEURS_HUMEUR.uuid) {
        acc[category].push(indicator);
      }
      return acc;
    }, {});
  }, [userIndicateurs]);
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

  const updateIndicators = async () => {
    const user_indicateurs = await localStorage.getIndicateurs();
    if (user_indicateurs) {
      setUserIndicateurs(user_indicateurs);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      updateIndicators();
    }, [])
  );

  useEffect(() => {
    // this hook inits the survey if there is already answers
    if (Object.keys(answers).length > 0) {
      // if answers as key it is already initialized
      return;
    }
    const initialAnswers = {};
    const surveyAnswers = initSurvey?.answers || {};
    if (!surveyAnswers || userIndicateurs.length === 0) {
      return;
    }
    Object.keys(surveyAnswers).forEach((key) => {
      const answer = surveyAnswers[key];
      if (!answer) return;
      // Handle special questions (CONTEXT)
      if (key === questionContext.id) {
        initialAnswers[key] = {
          ...answer,
          value: answer.value,
          userComment: answer.userComment,
        };
        return;
      }

      if (key === questionToxic.id) {
        initialAnswers[key] = {
          ...answer,
          value: answer.value,
          userComment: answer.userComment,
        };
      }

      let cleanedQuestionId = key.split("_")[0];
      // previous indicators where using '_', we cleaned it when editing it apparently
      const _indicateur = userIndicateurs.find(
        (i) =>
          getIndicatorKey(i) === cleanedQuestionId || (cleanedQuestionId === questionToxic.id && i.genericUuid === GENERIC_INDICATOR_SUBSTANCE.uuid)
      );
      if (_indicateur) {
        let value = answer.value;
        if (!["gauge", "boolean"].includes(_indicateur.type)) {
          // for retro caompatibility with certain types of indicators
          value = getScoreWithState({
            patientState: initSurvey?.answers,
            category: key,
          });
        }
        if (cleanedQuestionId === questionToxic.id) {
          // in case where cleanedQuestionId is TOXIC,
          // this happens only in edge case where value where registered as TOXIC and still editable
          // and the user do the upgrade and edit a survey
          // so in the overall data it can happen for only 7 days (the 7 days before the upgrade)
          cleanedQuestionId = _indicateur.uuid;
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
        [key]: {
          ...prev[key],
          value,
          _indicateur: userIndicateurs.find((i) => getIndicatorKey(i) === key),
        },
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
      answers: {
        ...prevCurrentSurvey.answers,
        ...answers,
      },
    };
    if (currentSurvey.answers[STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE]) {
      delete currentSurvey.answers[questionToxic.id];
    }
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

  const showHelpModal = (category: NEW_INDICATORS_CATEGORIES) => {
    return showBottomSheet(<HelpView title={HELP_FOR_CATEGORY[category].title} description={HELP_FOR_CATEGORY[category]?.description} />);
  };

  const editIndicators = () => {
    navigation.navigate("symptoms");
    logEvents.logSettingsSymptomsFromSurvey();
  };
  const answeredElementCount = Object.keys(answers).map((key) => answers[key].value !== undefined).length;
  const onValueChanged = ({ indicator, value }: { indicator: Indicator; value: string }) => toggleAnswer({ key: getIndicatorKey(indicator), value });
  const onCommentChanged = ({ indicator, comment }: { indicator: Indicator; comment?: string }) =>
    handleChangeUserComment({ key: getIndicatorKey(indicator), userComment: comment });

  return (
    <AnimatedHeaderScrollScreen
      headerRightComponent={<Pencil color={TW_COLORS.WHITE} width={16} height={16} />}
      headerRightAction={editIndicators}
      headerTitle={formatDate(initSurvey?.date)}
      handlePrevious={() => {
        navigation.goBack();
      }}
      bottomComponent={
        <NavigationButtons
          absolute={true}
          withArrow={false}
          onNext={() =>
            submitDay({
              redirectBack: false,
            })
          }
          headerContent={
            <View>
              <View className="my-2">
                <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 text-center")}>
                  {answeredElementCount} élément{answeredElementCount ? "s" : ""} observé{answeredElementCount ? "s" : ""}.
                </Text>
                <Text className={mergeClassNames(typography.textSmMedium, "text-gray-700 text-center")}>
                  Vous pourrez compléter votre observation plus tard
                </Text>
              </View>
            </View>
          }
          nextText="Valider mon observation"
        />
      }
      title={"Mon observation du jour"}
      navigation={navigation}
    >
      <View>
        {userIndicateurs
          .filter((ind) => ind.active === true && ind.uuid === INDICATEURS_HUMEUR.uuid)
          .map((ind) => {
            return (
              <View className="mb-2 border-b-2 border-gray-400 px-4 my-4">
                <IndicatorSurveyItem
                  key={ind?.uuid}
                  showComment={true}
                  indicator={ind}
                  index={0}
                  value={answers?.[getIndicatorKey(ind)]?.value}
                  onIndicatorChange={() => {
                    updateIndicators();
                  }}
                  onValueChanged={onValueChanged}
                  onCommentChanged={onCommentChanged}
                  comment={answers?.[getIndicatorKey(ind)]?.userComment}
                />
              </View>
            );
          })}
        <Text className={mergeClassNames(typography.textMdMedium, "text-gray-700 text-center my-6 px-8")}>
          Observez ce qui a été présent ou plus marqué aujourd’hui, un élément à la fois.
        </Text>
        {Object.keys(groupedIndicators).map((cat, index) => {
          const indicators = groupedIndicators[cat];
          if (!indicators.length) {
            return;
          }
          return (
            <View key={cat} className="mb-2 border-b-2 border-gray-400 px-4">
              <View className={`flex-row  p-4 px-0 pb-6 ${index === 0 ? "pt-4" : "pt-10"}`}>
                <View className="rounded-full border-[1.5px] border-cnam-primary-800 bg-white w-10 h-10 items-center justify-center">
                  {React.createElement(INDICATOR_CATEGORIES_DATA[cat].icon, { color: TW_COLORS.BRAND_900 })}
                </View>
                <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900 ml-2 flex-1")}>
                  {INDICATOR_CATEGORIES_DATA[cat].name}
                </Text>
                <JMButton
                  onPress={() => {
                    showHelpModal(cat);
                  }}
                  variant="text"
                  width="fixed"
                  icon={<CircleQuestionMark />}
                  className="ml-auto"
                />
              </View>
              {indicators.map((ind: Indicator) => {
                return (
                  <IndicatorSurveyItem
                    key={ind?.uuid}
                    showComment={true}
                    indicator={ind}
                    index={index}
                    onIndicatorChange={() => {
                      updateIndicators();
                    }}
                    value={answers?.[getIndicatorKey(ind)]?.value}
                    onValueChanged={onValueChanged}
                    onCommentChanged={onCommentChanged}
                    comment={answers?.[getIndicatorKey(ind)]?.userComment}
                  />
                );
              })}
            </View>
          );
        })}
        {/* <Card
          title="Personnaliser mes indicateurs"
          icon={{ icon: "ImportantSvg" }}
          onPress={() => {
            navigation.navigate("symptoms");
            logEvents.logSettingsSymptomsFromSurvey();
          }}
          className="my-2"
        /> */}
      </View>
      <GoalsDaySurvey date={initSurvey?.date} ref={goalsRef} scrollRef={scrollRef} route={route} />
      <View className="mb-2 px-4 my-4">
        <Text className={mergeClassNames(typography.displayXsBold, "text-left text-cnam-primary-900 ml-2 flex-1 mb-4")}>Note générale</Text>
        <InputQuestion
          question={questionContext}
          onPress={toggleAnswer}
          selected={answers[questionContext.id]?.value}
          explanation={questionContext.explanation}
          onChangeUserComment={handleChangeUserComment}
          userComment={answers[questionContext.id]?.userComment}
          placeholder="Contexte, évènements, comportement de l'entourage..."
        />
      </View>
      {/* <View className="mb-2 px-4 my-4">
        <QuestionYesNo
          question={questionToxic}
          onPress={toggleAnswer}
          selected={answers[questionToxic.id]?.value}
          explanation={questionToxic.explanation}
          isLast
          onChangeUserComment={handleChangeUserComment}
          userComment={answers[questionToxic.id]?.userComment}
        />
      </View> */}
    </AnimatedHeaderScrollScreen>
  );
};

export default DaySurvey;
