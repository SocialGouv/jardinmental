import React, { useContext, useCallback, useState, forwardRef } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import Text from "../../components/MyText";
import { DiaryDataContext } from "../../context/diaryData";
import { colors } from "../../utils/colors";
import { formatDateThread } from "../../utils/date/helpers";
import StatusItem from "./status-item";
import { canEdit } from "./utils/index";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getGoalsData } from "../../utils/localStorage/goals";
import localStorage from "../../utils/localStorage";
import NewStatusItem from "./NewStatusItem";

export const DiaryList = forwardRef(({ ...props }, ref) => {
  const navigation = useNavigation();
  const [diaryData] = useContext(DiaryDataContext);
  const sortedData = Object.keys(diaryData).sort((a, b) => {
    a = a.split("/").reverse().join("");
    b = b.split("/").reverse().join("");
    return b.localeCompare(a);
  });

  const [indicateurs, setIndicateurs] = useState();
  const [goalsData, setGoalsData] = useState();
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIndicateurs(await localStorage.getIndicateurs());
        setGoalsData(await getGoalsData());
      })();
    }, [])
  );

  const renderItem = useCallback(
    ({ item: date }) => {
      return (
        <View>
          <NewStatusItem date={date} indicateurs={indicateurs} patientState={diaryData[date]} goalsData={goalsData} navigation={navigation} />
        </View>
      );
    },
    [diaryData, goalsData, indicateurs]
  );

  const keyExtractor = useCallback((date) => date);

  return <Animated.FlatList ref={ref} data={sortedData} renderItem={renderItem} keyExtractor={keyExtractor} {...props} />;
});
