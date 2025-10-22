import React, { useState, useContext, useRef, useEffect } from "react";
import { StyleSheet, View, TextInput, Alert, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import { makeSureDate } from "../../utils/date/helpers";
import Button from "../../components/RoundButtonIcon";
import { DiaryNotesContext } from "../../context/diaryNotes";
import logEvents from "../../services/logEvents";

const MAX_SIZE = 80;

const DiaryNote = ({ note, date }) => {
  const [diaryNotes, setDiaryNotes, updateDiaryNote] = useContext(DiaryNotesContext);
  const inputRef = useRef();
  const [toggled, setToggled] = useState(false);
  const [buffer, setBuffer] = useState(note?.value);
  const [currentValue, setCurrentValue] = useState(note?.value);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (editMode) inputRef.current.focus();

    let v = note?.value;
    if (editMode) v = buffer;
    else if (!toggled)
      v = note?.value
        ?.substring(0, MAX_SIZE)
        ?.split(/\r\n|\r|\n/)
        ?.slice(0, 3)
        ?.join("\n")
        ?.concat(textIsLong ? "..." : "");

    setCurrentValue(v);
  }, [buffer, editMode, currentValue, note?.value, textIsLong, toggled]);

  if (!note || !note?.value) return null;

  const lines = note?.value?.split(/\r\n|\r|\n/);
  const textIsLong = note?.value.length > MAX_SIZE || lines.length >= 3;

  const saveNoteInContext = () => {
    updateDiaryNote({
      id: note.id,
      date,
      value: { ...note, value: buffer },
    });
  };

  const pressDelete = () => {
    Alert.alert("Supprimer la note ?", "Cette action est définitive", [
      {
        text: "Confirmer la suppression",
        onPress: deleteNoteInContext,
        style: "default",
      },
      {
        text: "Annuler",
        style: "cancel",
      },
    ]);
  };
  const deleteNoteInContext = () => {
    updateDiaryNote({
      id: note.id,
      date,
      value: null,
    });
    logEvents.logDeleteNoteDiary();
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("day-survey-detail", {
          day: chartDates[dayIndex],
          indicateur,
          dayIndex,
        });
      }}
    >
      <View key={note.id} style={[styles.item, editMode ? { backgroundColor: "#F4FCFD" } : {}]}>
        <View style={styles.container}>
          <TextInput
            ref={inputRef}
            blurOnSubmit={false}
            multiline={true}
            onChangeText={(e) => {
              setBuffer(e);
            }}
            value={currentValue}
            placeholder="Saisir ma nouvelle note"
            style={styles.label}
            textAlignVertical={"top"}
            editable={editMode}
            onBlur={() => {
              setBuffer(note?.value);
              setEditMode(false);
              setToggled(false);
            }}
          />
          <Text style={styles.timestamp}>{makeSureDate(note?.timestamp).getLocaleTime("fr")}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          icon="pencil"
          visible={!editMode}
          // autofocus input and show keyboard
          onPress={() => {
            if (textIsLong && !toggled) setToggled(true);
            setEditMode(true);
            logEvents.logEditNoteDiary();
          }}
        />
        <Button icon="toggle" visible={textIsLong && !editMode} onPress={() => setToggled((e) => !e)} isToggled={toggled} />
      </View>
      <View style={styles.bottomButtonsContainer}>
        <Button icon="bin" iconColor="#D9605C" borderColor="#D9605C" backgroundColor="#ffe1e0" visible={editMode} onPress={pressDelete} />
        <Button
          icon="validate"
          visible={editMode}
          onPress={() => {
            setCurrentValue(buffer);
            saveNoteInContext();
            setEditMode(false);
            setToggled(false);
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    display: "flex",
    position: "absolute",
    right: 0,
    bottom: -4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  item: {
    marginVertical: 10,
    backgroundColor: "rgba(38, 56, 124, 0.03)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(38, 56, 124, 0.08)",
    paddingVertical: 10,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  label: {
    color: colors.DARK_BLUE,
    flex: 1,
    fontSize: 15,
  },
  timestamp: {
    marginTop: -8,
    fontSize: 11,
    color: colors.DARK_BLUE,
    fontStyle: "italic",
  },
});

export default DiaryNote;
