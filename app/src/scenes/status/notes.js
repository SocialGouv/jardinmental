import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import Icon from "../../components/Icon";
import { canEdit } from "./utils/index.js";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";

const Notes = ({ notes, date, onPress }) => {
  if (
    !notes ||
    (typeof notes === "string" && !notes) || //retro compatibility
    (typeof notes === "object" && !notes?.notesEvents && !notes?.notesSymptoms && !notes?.notesToxic)
  ) {
    return null;
  }

  const Note = ({ title, text }) => {
    if (!text) return null;

    return (
      <Text>
        <Text style={styles.boldText}>{title} : </Text>
        <Text style={styles.italic}>{text}</Text>
      </Text>
    );
  };

  return (
    <>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[
          styles.container,
          canEdit(date) && {
            borderRadius: 10,
          },
        ]}
        onPress={onPress}
        disabled={!canEdit(date)}
      >
        <Icon icon="NotesSvg" color="#58C8D2" width={20} height={20} styleContainer={styles.icon} />
        {typeof notes === String ? (
          //Retro compatibility
          <Text style={styles.text}>{notes}</Text>
        ) : (
          <View style={styles.textContainer}>
            <Note title="Contexte" text={notes.notesEvents} />
            <Note title="Ressentis" text={notes.notesSymptoms} />
            <Note title="Toxique" text={notes.notesToxic} />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  icon: { marginRight: 5 },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { width: "100%" },
  boldText: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  divider: {
    height: 1,
    backgroundColor: "#6BD1F3",
    marginVertical: 10,
    width: "60%",
    alignSelf: "center",
  },
});

export default Notes;
