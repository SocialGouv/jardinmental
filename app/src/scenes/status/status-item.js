import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import PatientStateItem from "./patient-state-item";
import { displayedCategories } from "../../utils/constants";
import NoDataDiaryItem from "./no-data-status-item";
import Notes from "./notes";
import localStorage from "../../utils/localStorage";
import Posology from "./posology";
import { canEdit } from "./utils/index.js";
import Button from "../../components/RoundButtonIcon";
import Toxic from "./toxic";
import Context from "./context";
import logEvents from "../../services/logEvents";
import { INDICATEURS_LISTE, INDICATEURS } from "../../utils/liste_indicateurs";

export default ({ navigation, patientState, date }) => {
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

  const handleEdit = (tab, editingSurvey = false) => {
    if (!canEdit(date)) return;
    const currentSurvey = {
      date,
      answers: patientState,
    };
    navigation.navigate(tab, {
      currentSurvey,
      editingSurvey,
    });
  };
  const hasAnswerSurvey = () =>
    Object.keys(displayedCategories)
      .concat(customs)
      .concat(INDICATEURS_LISTE)
      .filter((key) => {
        return patientState && patientState[key];
      }).length;

  const handlePressItem = ({ editingSurvey }) => {
    if (!canEdit(date)) return navigation.navigate("too-late", { date });
    logEvents.logFeelingEditButtonClick();
    handleEdit("day-survey", editingSurvey);
  };

  if (hasAnswerSurvey()) {
    return (
      <View style={styles.container}>
        <View style={[styles.item, styles.itemWithSpaceAbove]}>
          <View>
            {Object.entries(patientState)
              .filter(([key, value]) => {
                return ![
                  "CONTEXT",
                  "POSOLOGY",
                  "TOXIC",
                  "NOTES",
                  "PRISE_DE_TRAITEMENT",
                  "PRISE_DE_TRAITEMENT_SI_BESOIN",
                  "becks",
                ].includes(key);
              })
              .map(([key, value]) => {
                if (!value) {
                  return;
                }
                const [categoryName] = key.split("_");
                return (
                  <PatientStateItem
                    key={key}
                    category={key}
                    patientState={patientState}
                    label={
                      patientState?._indicateur?.name ||
                      INDICATEURS[key] ||
                      displayedCategories[key] ||
                      categoryName
                    }
                  />
                );
              })}
            <Context data={patientState?.CONTEXT} />
            <Posology
              posology={patientState?.POSOLOGY}
              patientState={patientState}
              date={date}
              onPress={() => handleEdit("drugs")}
            />
            <Toxic data={patientState?.TOXIC} />
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
          <TouchableOpacity style={styles.item} onPress={handlePressItem}>
            <NoDataDiaryItem date={date} />
          </TouchableOpacity>
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
});
