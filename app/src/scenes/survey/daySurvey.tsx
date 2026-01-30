import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
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
import { moodBackgroundColors } from "@/utils/mood";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { TW_COLORS } from "@/utils/constants";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import {
  INDICATEURS_HUMEUR,
  GENERIC_INDICATOR_SUBSTANCE,
  STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE,
} from "@/utils/liste_indicateurs.1";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import NavigationButtons from "@/components/onboarding/NavigationButtons";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import ChevronIcon from "@assets/svg/icon/chevron";
import { useStatusBar } from "@/context/StatusBarContext";
import PencilIcon from "@assets/svg/icon/Pencil";
import { getGoalsDailyRecords, getGoalsTracked } from "@/utils/localStorage/goals";
import { Goal } from "@/entities/Goal";
import DaySurveyCustomBottomSheet from "./DaySurveyCustomBottomSheet";
import * as Sentry from "@sentry/react-native";
import { Typography } from "@/components/Typography";

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
  const [surveyStartTime, setSurveyStartTime] = useState<number | null>(null);

  const [diaryData, addNewEntryToDiaryData] = useContext(DiaryDataContext);

  const [userIndicateurs, setUserIndicateurs] = useState<Indicator[]>([]);
  const [treatment, setTreatment] = useState<any[] | undefined>();
  const [goals, setGoals] = useState<Goal[]>([]);

  const [answers, setAnswers] = useState<DiaryDataNewEntryInput["answers"]>({});

  const scrollRef = useRef<ScrollView | null>(null);

  const goalsRef = useRef<{ onSubmit?: () => Promise<void> }>(null);

  const questionToxic = {
    id: "TOXIC",
    label: "Avez-vous consommé des substances aujourd'hui ?",
  };
  const questionContext = {
    id: "CONTEXT",
    label: "Rédigez une note générale sur votre journée",
  };

  const updateIndicators = async () => {
    const user_indicateurs = await localStorage.getIndicateurs();
    if (user_indicateurs) {
      setUserIndicateurs(user_indicateurs);
    }
  };

  const calculateDayOffset = (surveyDate: string) => {
    const today = new Date();
    const survey = new Date(surveyDate);

    // Reset time to midnight for accurate day calculation
    today.setHours(0, 0, 0, 0);
    survey.setHours(0, 0, 0, 0);

    const diffTime = survey.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
        const _goals = await getGoalsTracked({ date: initSurvey?.date });
        setGoals(_goals);
        const _treatment = await localStorage.getMedicalTreatment();
        if (_treatment) {
          setTreatment(_treatment);
        }
      })();
      updateIndicators();

      // Initialize timer only if not already started
      if (!surveyStartTime) {
        setSurveyStartTime(Date.now());
      }

      // Log DAY_DAILY_QUESTIONNAIRE when opening the screen
      const dayOffset = calculateDayOffset(initSurvey?.date);
      logEvents.logDayDailyQuestionnaire(dayOffset);
    }, [surveyStartTime, initSurvey?.date])
  );

  useEffect(() => {
    // this hook inits the survey if there is already answers
    if (Object.keys(answers).length > 0) {
      // if answers as key it is already initialized
      return;
    }
    const initialAnswers = {};
    let surveyAnswers = initSurvey?.answers || {};
    if (!surveyAnswers || userIndicateurs.length === 0) {
      return;
    }
    // if there is already data in the diarydata use the diarydata
    surveyAnswers = Object.keys(surveyAnswers).length === 0 ? diaryData[initSurvey.date] || {} : surveyAnswers;

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
      try {
        await goalsRef.current.onSubmit();
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des goals:", error);
        Sentry.captureException(error, {
          tags: { context: "day_survey_goals_submit" },
          extra: { date: initSurvey.date },
        });
        // Informer l'utilisateur de l'erreur
        Alert.alert("Erreur de sauvegarde", "Vos objectifs n'ont pas pu être sauvegardés complètement. Vos observations ont bien été enregistrées.", [
          { text: "OK" },
        ]);
        // Continue quand même avec la validation du questionnaire
      }
    }
    // Log time spent on survey
    if (surveyStartTime) {
      const timeSpentMs = Date.now() - surveyStartTime;
      const timeSpentSeconds = Math.round(timeSpentMs / 1000);
      logEvents.logTimeSpentDailyQuestionnaire(timeSpentSeconds);
    }

    logEvents.logValidateDailyQuestionnaire();
    logEvents.logIndicatorsDailyQuestionnaire(userIndicateurs.filter((i) => i.active).length);
    logEvents.logObjectivesDailyQuestionnaire(goals.length);
    const answeredElementCount = Object.keys(answers).filter((key) => userIndicateurs.map(getIndicatorKey).includes(key))?.length;
    logEvents.logCompletionIndicatorsDailyQuestionnaire(answeredElementCount / userIndicateurs.length);

    const records = await getGoalsDailyRecords({ date: initSurvey.date });
    const _goalsRecords = {};
    for (const record of records) {
      _goalsRecords[record.goalId] = record;
    }
    if (goals.length) {
      const goalsWithValueTrueOrComment = records.filter((g) => g.value || g.comment);
      logEvents.logCompletionObjectivesDailyQuestionnaire(goalsWithValueTrueOrComment.length / goals.length);
    }

    // Log if notes were added
    const hasNotes = answers[questionContext.id]?.userComment ? 1 : 0;
    logEvents.logCompletionNotesDailyQuestionnaire(hasNotes);

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

  const editIndicators = () => {
    showBottomSheet(<DaySurveyCustomBottomSheet navigation={navigation} />);
    // navigation.navigate("symptoms");
    // logEvents._deprecatedLogSettingsSymptomsFromSurvey();
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
      headerRightComponent={
        <Typography className={mergeClassNames(selectedMoodIndex === null ? "text-white" : "text-cnam-primary-950")}>
          Personnaliser mon suivi
        </Typography>
      }
      headerRightAction={editIndicators}
      // headerTitle={formatDate(initSurvey?.date)}
      handlePrevious={() => {
        navigation.goBack();
      }}
      subtitle={formatDate(initSurvey?.date)}
      dynamicTitle=" "
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
                <Typography className={mergeClassNames(typography.textSmMedium, "text-gray-700 text-center")}>
                  {answeredElementCount} élément{answeredElementCount > 1 ? "s" : ""} observé{answeredElementCount > 1 ? "s" : ""}.
                </Typography>
                <Typography className={mergeClassNames(typography.textSmMedium, "text-gray-700 text-center")}>
                  Vous pourrez compléter votre observation plus tard
                </Typography>
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
        <Typography className={mergeClassNames(typography.textMdMedium, "text-gray-700 text-left mb-6 mt-4 px-5")}>
          Observez ce qui a été présent ou plus marqué aujourd’hui, un élément à la fois.
        </Typography>
        <View className="mb-0 px-4">
          {userIndicateurs
            .filter((ind) => ind.active === true)
            .map((ind: Indicator, index: number) => {
              return (
                <IndicatorSurveyItem
                  key={ind?.uuid || ind.name}
                  showComment={true}
                  indicator={ind}
                  index={index}
                  onIndicatorChange={() => {
                    updateIndicators();
                  }}
                  value={answers?.[getIndicatorKey(ind)]?.value}
                  onValueChanged={(value) => {
                    onValueChanged(value);
                    if (ind.uuid === INDICATEURS_HUMEUR.uuid) {
                      setSelectedMoodIndex(value.value);
                    }
                  }}
                  onCommentChanged={onCommentChanged}
                  comment={answers?.[getIndicatorKey(ind)]?.userComment}
                />
              );
            })}
        </View>
      </View>
      <GoalsDaySurvey date={initSurvey?.date} ref={goalsRef} scrollRef={scrollRef} route={route} />
      <View className="mb-2 px-4 my-4">
        <InputQuestion
          question={questionContext}
          onPress={toggleAnswer}
          selected={answers[questionContext.id]?.value}
          explanation={questionContext.explanation}
          onChangeUserComment={handleChangeUserComment}
          userComment={answers[questionContext.id]?.userComment}
          placeholder="Rédiger une note générale : contexte, évènements, comportement de l'entourage..."
        />
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default DaySurvey;
