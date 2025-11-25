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
import { isToday, parseISO } from "date-fns";
import { Smiley } from "@/components/survey/Smiley";
import { Indicator } from "@/entities/Indicator";
import { INDICATEURS_HUMEUR } from "@/utils/liste_indicateurs.1";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import { DiaryDataAnswer } from "@/entities/DiaryData";
import { answers } from "../survey-v2/utils";
import { SquircleView } from "expo-squircle-view";
import { TW_COLORS } from "@/utils/constants";
import NewStatusItem from "./NewStatusItem";
import logEvents from "@/services/logEvents";

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
  const [customs, setCustoms] = useState([]);
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIndicateurs(await localStorage.getIndicateurs());
        setGoalsData(await getGoalsData());
        setCustoms(await localStorage.getCustomSymptoms());
      })();
    }, [])
  );

  const handlePressMood = ({ value, indicator }: { value: number; indicator: Indicator }) => {
    logEvents.logOpenDailyQuestionnaire("how_do_you_feel_today_widget");
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
      const moodIndicator = indicateurs?.find((ind) => ind.active && ind.uuid === INDICATEURS_HUMEUR.uuid);
      if (isToday(parseISO(date)) && !diaryData[date] && moodIndicator) {
        return (
          <SquircleView
            preserveSmoothing={true}
            cornerSmoothing={100}
            style={{
              borderRadius: 20,
              borderWidth: 1,
              borderColor: TW_COLORS.GRAY_500,
            }}
            className="flex-col my-4 p-6"
          >
            <View className="mb-4 flex-row justify-between">
              <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Comment vous sentez-vous aujourd'hui ?</Text>
            </View>
            <Smiley indicator={moodIndicator} value={undefined} onValueChanged={handlePressMood} />
          </SquircleView>
        );
      } else {
        return (
          <NewStatusItem
            date={date}
            indicateurs={indicateurs}
            patientState={diaryData[date]}
            goalsData={goalsData}
            navigation={navigation}
            customs={customs}
          />
        );
      }
    },
    [diaryData, goalsData, indicateurs, customs]
  );

  const keyExtractor = useCallback((date) => date);
  return (
    <Animated.FlatList
      ref={ref}
      data={sortedData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      {...props}
      initialNumToRender={6}
      maxToRenderPerBatch={5}
      windowSize={6}
      updateCellsBatchingPeriod={50}
    />
  );
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
