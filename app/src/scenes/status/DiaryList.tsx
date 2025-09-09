import React, { useContext, useCallback, useState, forwardRef } from "react";
import { StyleSheet, View, TouchableOpacity, Animated, Text } from "react-native";
import { DiaryDataContext } from "../../context/diaryData";
import { colors } from "../../utils/colors";
import { beforeToday, formatDateThread, formatDay } from "../../utils/date/helpers";
import StatusItem from "./status-item";
import { canEdit } from "./utils/index";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getGoalsData } from "../../utils/localStorage/goals";
import localStorage from "../../utils/localStorage";
import dayjs from "dayjs";
import { isToday, isYesterday, parseISO } from "date-fns";
import { Smiley } from "@/components/survey/Smiley";
import { Indicator } from "@/entities/Indicator";
import { INDICATEURS_HUMEUR } from "@/utils/liste_indicateurs.1";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { DiaryDataAnswer } from "@/entities/DiaryData";
import { answers } from "../survey-v2/utils";

export const DiaryList = forwardRef(({ ...props }, ref) => {
  const navigation = useNavigation();
  const [diaryData] = useContext(DiaryDataContext);
  const sortedData = Object.keys(diaryData).sort((a, b) => {
    a = a.split("/").reverse().join("");
    b = b.split("/").reverse().join("");
    return b.localeCompare(a);
  });

  const [indicateurs, setIndicateurs] = useState<Indicator[] | undefined>();
  const [goalsData, setGoalsData] = useState();
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIndicateurs(await localStorage.getIndicateurs());
        setGoalsData(await getGoalsData());
      })();
    }, [])
  );

  const handlePressMood = ({ value, indicator }: { value: number; indicator: Indicator[] }) => {
    return navigation.navigate("day-survey", {
      currentSurvey: {
        date: formatDay(beforeToday(0)),
        answers: {
          [INDICATEURS_HUMEUR.uuid]: {
            value: value,
            _indicateur: indicator,
          },
        },
      },
      editingSurvey: true,
    });
  };

  const renderItem = useCallback(
    ({ item: date }) => {
      const moodIndicator = indicateurs?.find((ind) => ind.uuid === INDICATEURS_HUMEUR.uuid);
      console.log(isToday(parseISO(date)), !diaryData[date], moodIndicator);
      if (isToday(parseISO(date)) && !diaryData[date] && moodIndicator) {
        return (
          <View className="rounded-2xl border border-gray-500 flex-col my-4 p-6">
            <View className="mb-4 flex-row justify-between">
              <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Comment vous sentez-vous aujourd'hui ?</Text>
            </View>
            <Smiley indicator={moodIndicator} value={undefined} onValueChanged={handlePressMood} />
          </View>
        );
      } else {
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
            <StatusItem date={date} indicateurs={indicateurs} patientState={diaryData[date]} goalsData={goalsData} navigation={navigation} />
          </View>
        );
      }
    },
    [diaryData, goalsData, indicateurs]
  );

  const keyExtractor = useCallback((date) => date);

  return <Animated.FlatList ref={ref} data={sortedData} renderItem={renderItem} keyExtractor={keyExtractor} {...props} />;
});

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
