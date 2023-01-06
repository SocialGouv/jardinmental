import React, { useEffect } from "react";
import ScorePicker from "../ScorePicker";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "../../../components/Icon";
import logEvents from "../../../services/logEvents";
import { colors } from "../../../utils/colors";

export const FriseFilterBar = ({
  hasTreatment,
  onShowInfo,
  onShowTreatmentChanged,
  onFocusedScoresChanged,
}) => {
  const [focusedScores, setFocusedScores] = React.useState([]);
  useEffect(() => {
    onFocusedScoresChanged?.(focusedScores);
  }, [focusedScores]);
  const [showTreatment, setShowTreatment] = React.useState(true);
  useEffect(() => {
    onShowTreatmentChanged?.(showTreatment);
  }, [showTreatment]);

  return (
    <View style={styles.container}>
      <ScorePicker
        showIcon={false}
        focusedScores={focusedScores}
        onPress={(i) => {
          if (focusedScores.includes(i)) {
            setFocusedScores((e) => e.filter((x) => x !== i));
          } else {
            setFocusedScores((e) => [...e, i]);
          }
          //events
          logEvents.logSuiviEditScoreFrise(i);
        }}
        containerStyle={styles.scorePickerContainer}
        itemStyle={styles.item}
      >
        <View style={[styles.treatmentContainer, styles.item]}>
          <TouchableOpacity
            onPress={() => {
              if (hasTreatment) {
                setShowTreatment((e) => !e);
                logEvents.logSuiviShowPriseDeTraitement(showTreatment ? 0 : 1); // 0 = masquer, 1 = afficher
              } else {
                onShowInfo?.();
              }
            }}
          >
            <View
              style={[
                styles.selectionContainer,
                !hasTreatment && styles.noTraitementSelectionContainer,
                showTreatment && styles.activeSelectionContainer,
              ]}
            >
              <Icon
                icon="DrugsSvg"
                color={!hasTreatment || showTreatment ? "#FFFFFF" : "#58C8D2"}
                width={20}
                height={20}
                styleContainer={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScorePicker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 30,
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    paddingHorizontal: 10,
    maxWidth: "100%",
    marginTop: 10,
  },
  scorePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    flex: 0,
    marginVertical: 0,
  },
  treatmentContainer: {},
  item: {
    margin: 5,
  },
  infoHintContainer: {
    width: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: 15,
    marginLeft: 10,
  },
  infoHintText: {
    color: colors.LIGHT_BLUE,
  },
  icon: {
    width: 30,
    height: 30,
  },
  selectionContainer: {
    padding: 4,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  noTraitementSelectionContainer: {
    backgroundColor: "#E9E9E9",
    borderColor: "#DADADA",
  },
});
