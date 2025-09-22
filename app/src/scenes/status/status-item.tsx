import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import PatientStateItem from "./patient-state-item";
import { displayedCategories } from "../../utils/constants";
import Notes from "./notes";
import localStorage from "../../utils/localStorage";
import Posology from "./posology";
import { canEdit } from "./utils/index.js";
import Button from "../../components/RoundButtonIcon";
import Toxic from "./toxic";
import Context from "./context";
import logEvents from "../../services/logEvents";
import {
  GENERIC_INDICATOR_SUBSTANCE,
  INDICATEURS_LIST,
  STATIC_UUID_FOR_INSTANCE_OF_GENERIC_INDICATOR_SUBSTANCE,
} from "../../utils/liste_indicateurs.1";
import { GoalsStatus } from "../goals/status/GoalsStatus";
import { Card } from "../../components/Card";
import { GoalsStatusNoData } from "../goals/status/GoalsStatusNoData";
import { generateIndicatorFromPredefinedIndicator, Indicator } from "@/entities/Indicator";
import { DiaryDataAnswer, DiaryEntry } from "@/entities/DiaryData";
import { GoalRecordsData, GoalsData } from "@/entities/Goal";

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
    logEvents.logOpenDailyQuestionnaire("how_do_you_feel_card");
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
    return (
      <View style={styles.container}>
        <View style={[styles.item, styles.itemWithSpaceAbove]}>
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
                console.log("LCS TOTO", patientStateRecord);
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
        {canEdit(date) ? (
          <View style={styles.buttonsContainer}>
            <Button icon="pencil" visible={true} onPress={() => handlePressItem({ editingSurvey: true })} />
          </View>
        ) : null}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {canEdit(date) ? (
          <View style={styles.noDataContainer}>
            <Card
              preset="grey"
              title={canEdit(date) ? "Renseigner mon état pour ce jour-là" : "Je ne peux plus saisir mon questionnaire pour ce jour"}
              image={{ source: require("./../../../assets/imgs/indicateur.png") }}
              onPress={handlePressItem}
            />
            <GoalsStatusNoData goalsData={goalsData} date={date} onPress={handlePressItem} />
          </View>
        ) : (
          <View style={styles.emptyItem} />
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  buttonsContainer: {
    width: "100%",
    display: "flex",
    position: "absolute",
    top: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  item: {
    marginVertical: 20,
    backgroundColor: "rgba(38, 56, 124, 0.03)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(38, 56, 124, 0.08)",
    paddingVertical: 15,
  },
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
    marginVertical: -5,
    borderLeftWidth: 0.4,
    borderColor: "#00CEF7",
  },
  noDataContainer: {
    marginVertical: 5,
    paddingTop: 12,
    paddingBottom: 39,
  },
});
