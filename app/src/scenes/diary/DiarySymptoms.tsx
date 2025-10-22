import React from "react";
import { StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import DiarySymptom from "./DiarySymptom";
import { Indicator } from "@/entities/Indicator";
import { useNavigation } from "@react-navigation/native";

const DiarySymptoms = ({ values, date, userIndicators }: { values: { id: string; value: string }[]; date: Date; userIndicators: Indicator[] }) => {
  if (!values || !values?.length) return null;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("day-survey-detail", {
          day: date,
        });
      }}
    >
      {values?.map(
        (userComment) => userComment && <DiarySymptom userIndicators={userIndicators} key={userComment.id} userComment={userComment} date={date} />
      )}
    </TouchableOpacity>
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

export default DiarySymptoms;
