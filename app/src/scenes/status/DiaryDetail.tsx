import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { DiaryDataContext } from "../../context/diaryData";
import DiaryItem from "./status-item";
import DayTitle from "../variation/day-title";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { formatDateThread } from "../../utils/date/helpers";
import NewStatusItem from "./NewStatusItem";

const DiaryDetail = ({
  route: {
    params: { day, indicateur, dayIndex },
  },
  navigation,
}) => {
  const [diaryDay, setDiaryDay] = useState(day);
  const [diaryData] = useContext(DiaryDataContext);

  const patientState = diaryData[diaryDay];

  if (!patientState) {
    return (
      <AnimatedHeaderScrollScreen
        title={formatDateThread(diaryDay)}
        navigation={navigation}
        handlePrevious={navigation.goBack}
        showBottomButton={false}
        smallHeader={true}
        noPadding={false}
      >
        {/* Pas de données pour ce jour */}
      </AnimatedHeaderScrollScreen>
    );
  }

  return (
    <AnimatedHeaderScrollScreen
      title={"Mon observation"}
      navigation={navigation}
      handlePrevious={navigation.goBack}
      showBottomButton={false}
      smallHeader={true}
      noPadding={false}
    >
      <View className="px-2">
        <NewStatusItem date={diaryDay} patientState={patientState} navigation={navigation} />
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

const styles = StyleSheet.create({});

export default DiaryDetail;
