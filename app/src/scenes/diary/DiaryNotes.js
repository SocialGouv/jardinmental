import React from "react";
import { StyleSheet, View } from "react-native";
import DiaryNote from "./DiaryNote";

const DiaryNotes = ({ diaryNote, date }) => {
  if (!diaryNote || !diaryNote?.values) return null;

  return (
    <View style={styles.container}>
      {diaryNote?.values
        ?.sort((a, b) => (a?.timestamp > b?.timestamp ? -1 : 1))
        ?.map((note) => note && <DiaryNote key={note.id} note={note} date={date} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingVertical: 10,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: "#00CEF7",
  },
});

export default DiaryNotes;
