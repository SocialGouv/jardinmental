import React, { useContext, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import Text from "../../components/MyText";
import { DiaryDataContext } from "../../context/diaryData";
import { colors } from "../../utils/colors";
import { formatDateThread } from "../../utils/date/helpers";
import StatusItem from "./status-item";
import { canEdit } from "./utils/index";
import { useNavigation } from "@react-navigation/native";

export const DiaryList = ({ ...props }) => {
  const navigation = useNavigation();
  const [diaryData] = useContext(DiaryDataContext);
  const sortedData = Object.keys(diaryData).sort((a, b) => {
    a = a.split("/").reverse().join("");
    b = b.split("/").reverse().join("");
    return b.localeCompare(a);
  });

  const renderItem = useCallback(
    ({ item: date }) => {
      return (
        <View>
          <View style={styles.dateContainer}>
            <View style={styles.dateDot} />
            {canEdit(date) ? (
              <Text style={styles.dateLabel}>{formatDateThread(date)}</Text>
            ) : (
              <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("too-late", { date })}>
                <Text style={styles.dateLabel}>{formatDateThread(date)}</Text>
              </TouchableOpacity>
            )}
          </View>
          <StatusItem date={date} patientState={diaryData[date]} navigation={navigation} />
        </View>
      );
    },
    [diaryData]
  );

  const keyExtractor = useCallback((date) => date);

  return (
    <Animated.FlatList data={sortedData} renderItem={renderItem} keyExtractor={keyExtractor} {...props} />
  );
};

const styles = StyleSheet.create({
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
  dateLabel: {
    color: "#000",
    fontSize: 13,
    textAlign: "left",
    paddingLeft: 10,
    fontWeight: "600",
  },
});
