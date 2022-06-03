import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import { getArrayOfDatesFromTo, formatDateThread } from "../../../utils/date/helpers";

const EVENTS = [
  { label: "Contexte de la journée", value: "CONTEXT" },
  { label: "Précisions élément", value: "USER_COMMENT" },
  { label: "Traitements", value: "POSOLOGY" },
  { label: "Substances", value: "TOXIC" },
];

const Card = ({ date, context, userComment, event }) => {
  if (!date) return null;

  const getVariableByEvent = (e) => {
    switch (e) {
      case "CONTEXT":
        return context;
      case "USER_COMMENT":
        return userComment;
    }
  };

  const canDisplay = (e, v) => {
    return v && (e === event || event === "ALL");
  };

  // on vérifie si on a quelque chose a afficher si on a un event en particuler de précisé
  if (event !== "ALL" && !EVENTS.some((e) => canDisplay(e.value, getVariableByEvent(e.value)))) return null;

  return (
    <View>
      <Text style={styles.title}>{formatDateThread(date)}</Text>
      <View style={styles.container}>
        {canDisplay("CONTEXT", context) ? (
          <View style={styles.item}>
            <Text style={styles.sectionTitle}>Contexte de la journée</Text>
            <Text style={styles.message}>{context}</Text>
          </View>
        ) : null}
        {canDisplay("USER_COMMENT", userComment) ? (
          <View style={styles.item}>
            <Text style={styles.sectionTitle}>Précisions sur l'élément</Text>
            <Text style={styles.message}>{userComment}</Text>
          </View>
        ) : null}
        {!canDisplay("CONTEXT", context) && !canDisplay("USER_COMMENT", userComment) ? (
          <View style={styles.item}>
            <Text style={[styles.message, styles.italic]}>Vous n'avez rien précisé pour ce jour-là</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F6F6",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  item: {
    marginVertical: 15,
  },
  title: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    fontWeight: "bold",
    color: colors.BLUE,
    fontSize: 13,
  },
  sectionTitle: {
    marginBottom: 10,
    color: colors.BLUE,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  message: {
    color: "#111",
    fontSize: 13,
  },
  italic: {
    fontStyle: "italic",
  },
  muted: {
    fontSize: 13,
    fontStyle: "italic",
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default Card;
