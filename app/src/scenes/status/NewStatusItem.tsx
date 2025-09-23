import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import PatientStateItem from "./patient-state-item";
import { displayedCategories, TW_COLORS } from "../../utils/constants";
import Notes from "./notes";
import localStorage from "../../utils/localStorage";
import Posology from "./posology";
import { canEdit } from "./utils/index.js";
import Context from "./context";
import logEvents from "../../services/logEvents";
import {
  GENERIC_INDICATOR_SUBSTANCE,
  INDICATEURS_HUMEUR,
  INDICATEURS_LIST,
  STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE,
} from "../../utils/liste_indicateurs.1";
import { GoalsStatus } from "../goals/status/GoalsStatus";
import { Card } from "../../components/Card";
import { GoalsStatusNoData } from "../goals/status/GoalsStatusNoData";
import { generateIndicatorFromPredefinedIndicator, Indicator } from "@/entities/Indicator";
import { DiaryDataAnswer, DiaryEntry } from "@/entities/DiaryData";
import { GoalRecordsData, GoalsData } from "@/entities/Goal";
import { BasicIcon } from "@/components/CircledIcon";
import { answers as emojis } from "../survey-v2/utils";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { formatDateThread, formatRelativeDate } from "@/utils/date/helpers";
import ArrowIcon from "@assets/svg/icon/Arrow";
import { colors } from "@/utils/colors";
import { SquircleButton } from "expo-squircle-view";

export default ({
  navigation,
  indicateurs = [],
  patientState,
  goalsData,
  date,
}: {
  navigation: any;
  indicateurs: Indicator[];
  patientState: DiaryEntry;
  goalsData: GoalsData;
  date: Date;
}) => {
  const [customs, setCustoms] = useState([]);
  const [oldCustoms, setOldCustoms] = useState([]);
  let mounted = useRef(true);

  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      if (c && mounted) setCustoms(c);

      //retrocompatibility
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t && mounted) setOldCustoms(t);
      return;
    })();
    return () => (mounted = false);
  }, [patientState]);

  const handleEdit = (tab, editingSurvey = false, toGoals) => {
    if (!canEdit(date)) return;
    logEvents.logOpenDailyQuestionnaire("how_do_you_feel_card");
    const currentSurvey = {
      date,
      answers: patientState,
    };
    navigation.navigate(tab, {
      currentSurvey,
      editingSurvey,
      toGoals,
    });
  };

  const hasAnswerSurvey = () =>
    patientStateRecordKeys.some((key) => patientState[key]?.value !== undefined) || goalsData?.records?.byDate?.[date]?.length > 0;

  const handlePressItem = ({ editingSurvey, toGoals } = {}) => {
    if (!canEdit(date)) return navigation.navigate("too-late", { date });
    logEvents._deprecatedLogFeelingEditButtonClick();
    handleEdit("day-survey", editingSurvey, toGoals);
  };

  // DiaryDataAnswer;
  const patientStateRecordKeys = patientState
    ? Object.keys(patientState)
        .filter((key) => {
          return !["CONTEXT", "POSOLOGY", "NOTES", "PRISE_DE_TRAITEMENT", "PRISE_DE_TRAITEMENT_SI_BESOIN", "becks"].includes(key);
        })
        .filter((key) => !!patientState[key])
        .filter((key) => key)
        .sort((_a, _b) => {
          const a = patientState[_a];
          const b = patientState[_b];
          const aIndex = indicateurs?.findIndex?.((indicateur) => indicateur?.uuid === a?._indicateur?.uuid) || 0;
          const bIndex = indicateurs?.findIndex?.((indicateur) => indicateur?.uuid === b?._indicateur?.uuid) || 0;
          return aIndex - bIndex;
        })
    : [];

  if (hasAnswerSurvey()) {
    const emotion = Object.keys(patientState).find(
      (key) => (key === INDICATEURS_HUMEUR.uuid || key === INDICATEURS_HUMEUR.name) && patientState[key].value !== undefined
    );
    let emotionValue;
    if (emotion) {
      emotionValue = patientState[emotion].value;
    }
    return (
      <SquircleButton
        preserveSmoothing={true}
        cornerSmoothing={100}
        className="flex-col my-4 p-6"
        style={{
          borderColor: TW_COLORS.GRAY_500,
          borderRadius: 20,
          borderWidth: 1,
        }}
        onPress={() => handlePressItem({ editingSurvey: true })}
      >
        <View className="mb-4 flex-row justify-between">
          <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-950 capitalize")}>{formatRelativeDate(date)}</Text>
          {canEdit(date) && <ArrowIcon />}
        </View>
        <View>
          <View>
            {patientStateRecordKeys.map((key) => {
              let patientStateRecord = patientState[key];
              if (!patientStateRecord || patientStateRecord?.value === null || patientStateRecord.value === undefined) {
                return;
              }
              let [categoryName] = key.split("_");
              if (categoryName === "TOXIC") {
                // for user with historic value in 'TOXIC', we replace category name by uuid for indicator substance
                key = STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE;
                patientStateRecord = {
                  ...patientStateRecord,
                  _indicateur: {
                    ...generateIndicatorFromPredefinedIndicator(GENERIC_INDICATOR_SUBSTANCE),
                    uuid: key,
                  },
                };
              }
              const indicator = indicateurs.find((i) => i.genericUuid === key) || indicateurs.find((i) => i.uuid === key);
              return (
                <PatientStateItem
                  key={key}
                  category={key}
                  patientStateRecord={patientStateRecord}
                  label={
                    indicator?.name ||
                    patientStateRecord?._indicateur?.name ||
                    INDICATEURS_LIST[key] ||
                    displayedCategories[key] ||
                    categoryName ||
                    "Unknown Indicator"
                  }
                />
              );
            })}

            <GoalsStatus goalsData={goalsData} date={date} withSeparator={patientStateRecordKeys?.length > 0} />
            <Context data={patientState?.CONTEXT} />
            <Posology posology={patientState?.POSOLOGY} patientState={patientState} date={date} onPress={() => handleEdit("drugs")} />
            <Notes notes={patientState?.NOTES} date={date} onPress={() => handleEdit("notes")} />
          </View>
        </View>
      </SquircleButton>
    );
  } else {
    return (
      <>
        {canEdit(date) && (
          <SquircleButton
            preserveSmoothing={true}
            cornerSmoothing={100}
            style={{
              borderColor: TW_COLORS.GRAY_500,
              borderRadius: 20,
              borderWidth: 1,
            }}
            className="flex-col my-4 p-6"
            onPress={() => handlePressItem({ editingSurvey: true })}
          >
            <View className="mb-4 flex-row justify-between">
              <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-950 capitalize")}>{formatRelativeDate(date)}</Text>
              <ArrowIcon />
            </View>
            <View className="flex-row items-center">
              <BasicIcon
                color={TW_COLORS.CNAM_CYAN_50_LIGHTEN_90}
                borderColor={TW_COLORS.CNAM_PRIMARY_500}
                iconColor={TW_COLORS.GRAY_950}
                icon={"Plus"}
                borderWidth={1}
                iconContainerStyle={{ marginRight: 0 }}
                iconWidth={32}
                iconHeight={32}
              />
              <View className="ml-2 p-2 flex-1">
                <Text className={mergeClassNames(typography.textSmMedium, "text-cnam-primary-950")}>Complétez l'observation</Text>
              </View>
            </View>
          </SquircleButton>
        )}
        {!canEdit(date) && (
          <View>
            <View style={styles.dateContainer}>
              <View style={styles.dateDot} />
              <TouchableOpacity onPress={() => navigation.navigate("too-late", { date })}>
                <Text style={styles.dateLabel}>{formatDateThread(date)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <View style={styles.emptyItem} />
            </View>
          </View>
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  emptyItem: {
    marginVertical: 15,
  },
  itemWithSpaceAbove: {
    marginTop: 25,
    paddingTop: 20,
  },
  container: {
    paddingLeft: 15,
    marginLeft: 4,
    borderLeftWidth: 0.4,
    borderColor: "#00CEF7",
  },
  noDataContainer: {
    marginVertical: 5,
    paddingTop: 12,
    paddingBottom: 39,
  },
  dateLabel: {
    color: "#000",
    fontSize: 13,
    textAlign: "left",
    paddingLeft: 10,
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.LIGHT_BLUE,
  },
});
