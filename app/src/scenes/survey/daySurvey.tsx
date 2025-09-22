import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { ScrollView, View, Text } from "react-native";
import { beforeToday, formatDate, formatDay } from "../../utils/date/helpers";
import { getScoreWithState } from "../../utils";
import InputQuestion from "./InputQuestion";
import logEvents from "../../services/logEvents";
import { DiaryDataContext } from "../../context/diaryData";
import { alertNoDataYesterday } from "./survey-data";
import localStorage from "../../utils/localStorage";
import { useFocusEffect } from "@react-navigation/native";
import { GoalsDaySurvey } from "../goals/survey/GoalsDaySurvey";
import { DiaryDataNewEntryInput } from "../../entities/DiaryData";
import { Indicator } from "../../entities/Indicator";
import { IndicatorSurveyItem } from "@/components/survey/IndicatorSurveyItem";
import { DrugsBottomSheet } from "@/components/DrugsBottomSheet";
import { moodBackgroundColors, MoodEmoji, moodEmojis } from "@/utils/mood";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import {
  INDICATEURS_HUMEUR,
  NEW_INDICATORS_CATEGORIES,
  GENERIC_INDICATOR_SUBSTANCE,
  STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE,
  INDICATORS,
} from "@/utils/liste_indicateurs.1";
import { HELP_FOR_CATEGORY, INDICATOR_CATEGORIES_DATA } from "../onboarding-v2/data/helperData";
import CircleQuestionMark from "@assets/svg/icon/CircleQuestionMark";
import JMButton from "@/components/JMButton";
import { useBottomSheet } from "@/context/BottomSheetContext";
import HelpView from "@/components/HelpView";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import ChevronIcon from "@assets/svg/icon/chevron";
import { useStatusBar } from "@/context/StatusBarContext";
import PencilIcon from "@assets/svg/icon/Pencil";

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
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const { setCustomColor } = useStatusBar();
  const animatedBackgroundColor = useSharedValue(TW_COLORS.PRIMARY);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(null);

  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);

  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const [treatment, setTreatment] = useState<any[] | undefined>();

  const groupedIndicators = useMemo(() => {
    return userIndicateurs.reduce<Record<NEW_INDICATORS_CATEGORIES, Indicator[]>>((acc, indicator) => {
      const category =
        // for indicators existing in previous version (but uuid has not changed) we search for category in hardcoded predefinedIndicators
        INDICATORS.find((ind) => [indicator.uuid, indicator.baseIndicatorUuid, indicator.genericUuid].includes(ind.uuid))?.mainCategory ||
        // otherwise we default to mainCategory
        indicator.mainCategory ||
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
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
        const _treatment = await localStorage.getMedicalTreatment();
        if (_treatment) {
          setTreatment(_treatment);
        }
      })();
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
    setSelectedMoodIndex(initialAnswers?.[INDICATEURS_HUMEUR.uuid]?.value || null);
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
    logEvents.logValidateDailyQuestionnaire();
    logEvents._deprecatedLogFeelingAdd();
    logEvents._deprecatedLogFeelingSubmitSurvey(userIndicateurs.filter((i) => i.active).length);
    logEvents._deprecatedLogFeelingAddComment(
      Object.keys(answers).filter((key) => ![questionToxic.id, questionContext.id].includes(key) && answers[key].userComment)?.length
    );
    logEvents._deprecatedLogFeelingAddContext(answers[questionContext.id]?.userComment ? 1 : 0);
    logEvents._deprecatedLogFeelingResponseToxic(answers[questionToxic.id]?.value ? 1 : 0);

    // Log each indicator in the questionnaire (FEELING_ADD_LIST)
    for (const indicator of userIndicateurs.filter((i) => i.active)) {
      if (indicator.matomoId) {
        logEvents._deprecatedLogFeelingAddList(indicator.matomoId);
      }
    }

    // Log each indicator that has been answered (FEELING_ADD_LIST_COMPLETED)
    for (const key of Object.keys(answers)) {
      // Skip special questions (TOXIC and CONTEXT)
      if ([questionToxic.id, questionContext.id].includes(key)) continue;

      const answer = answers[key];
      if (answer?.value !== undefined && answer._indicateur?.matomoId) {
        logEvents._deprecatedLogFeelingAddListCompleted(answer._indicateur.matomoId);
      }
    }

    if (route.params?.redirect) {
      return navigation.navigate("survey-success", {
        onComplete: () => {
          navigation.navigate("tabs");
          alertNoDataYesterday({
            date: prevCurrentSurvey?.date,
            diaryData,
            navigation,
          });
        },
      });
    }

    if (redirectBack) {
      if (navigation.canGoBack()) return navigation.goBack();
      else navigation.navigate("tabs");
    }

    if (treatment && treatment?.length === 0) {
      // treatment is filled with an empty array = user a set "no treatment"

      return navigation.navigate("survey-success", {
        onComplete: () => {
          navigation.navigate("tabs");
          alertNoDataYesterday({
            date: prevCurrentSurvey?.date,
            diaryData,
            navigation,
          });
        },
      });
    } else if (treatment?.length) {
      // user has a treatment
      navigation.navigate("drugs-survey", { treatment, currentSurvey });
    } else {
      // use hasn't answered yet
      showBottomSheet(
        <DrugsBottomSheet
          onClose={(treatment) => {
            closeBottomSheet();
            if (treatment?.length) {
              navigation.navigate("drugs-survey", { treatment, currentSurvey });
            } else {
              navigation.navigate("survey-success", {
                onComplete: () => {
                  navigation.navigate("tabs");
                  alertNoDataYesterday({
                    date: prevCurrentSurvey?.date,
                    diaryData,
                    navigation,
                  });
                },
              });
            }
          }}
        />
      );
    }
    //
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

  const animatedStatusBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedBackgroundColor.value,
    };
  });

  // Update animatedBackgroundColor when selectedMoodIndex changes
  React.useEffect(() => {
    if (selectedMoodIndex !== null) {
      animatedBackgroundColor.value = withSpring(moodBackgroundColors[selectedMoodIndex - 1]);
      setCustomColor(moodBackgroundColors[selectedMoodIndex - 1]);
    }
  }, [selectedMoodIndex]);

  const animatedTextColor = useAnimatedStyle(() => {
    return {
      color: selectedMoodIndex !== null ? TW_COLORS.CNAM_PRIMARY_900 : TW_COLORS.WHITE,
      backgroundColor: "transparent",
    };
  });

  return (
    <AnimatedHeaderScrollScreen
      headerRightComponent={<PencilIcon color={selectedMoodIndex === null ? TW_COLORS.WHITE : TW_COLORS.CNAM_PRIMARY_900} width={16} height={16} />}
      headerRightAction={editIndicators}
      headerTitle={formatDate(initSurvey?.date)}
      handlePrevious={() => {
        navigation.goBack();
      }}
      headerLeftComponent={<ChevronIcon color={selectedMoodIndex === null ? TW_COLORS.WHITE : TW_COLORS.CNAM_PRIMARY_900} />}
      animatedStatusBarColor={animatedStatusBarColor}
      animatedTextColor={animatedTextColor}
      smallHeader={true}
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
                  {answeredElementCount} élément{answeredElementCount > 1 ? "s" : ""} observé{answeredElementCount > 1 ? "s" : ""}.
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
              <View className="mb-2 border-b border-gray-400 px-4 my-4 pb-4" key={ind?.uuid}>
                <IndicatorSurveyItem
                  showComment={true}
                  indicator={ind}
                  index={0}
                  value={answers?.[getIndicatorKey(ind)]?.value}
                  onIndicatorChange={() => {
                    updateIndicators();
                  }}
                  onValueChanged={(value) => {
                    onValueChanged(value);
                    setSelectedMoodIndex(value.value);
                  }}
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
            <View key={cat} className="mb-4 pb-6 border-b border-gray-400 px-4">
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
      <View className="mb-2 px-4 pt-6 my-4">
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
