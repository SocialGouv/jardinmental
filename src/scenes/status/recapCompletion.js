import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { subDays } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday, formatDay, getFirst3LetterWeekDay } from "../../utils/date/helpers";
import { colors } from "../../utils/colors";
import { firstLetterUppercase } from "../../utils/string-util";
import { DiaryDataContext } from "../../context/diaryData";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import Text from "../../components/MyText";
import logEvents from "../../services/logEvents";

const RecapCompletion = ({ navigation }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [startDay, setStartDay] = React.useState(new Date(Date.now()));

  const startSurvey = (offset) => {
    logEvents.logFeelingStartFromRecap(offset);
    const date = formatDay(beforeToday(offset));

    const blackListKeys = ["becks", "NOTES"];
    const filtered = Object.keys(diaryData[date] || [])
      .filter((key) => !blackListKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = diaryData[date][key];
        return obj;
      }, {});

    const dayIsDone = Object.keys(filtered).length !== 0;

    const answers = diaryData[date] || {};
    const currentSurvey = { date, answers };
    return navigation.navigate("day-survey", {
      currentSurvey,
      editingSurvey: dayIsDone,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setStartDay(new Date(Date.now()));
    }, [])
  );

  return (
    <View style={styles.safe}>
      <Text style={[styles.title, styles.separatorBottom]}>
        Complétez les 7 derniers jours pour un meilleur suivi
      </Text>
      <View style={styles.fil} />
      <View style={styles.buttonsContainer}>
        {[...Array(7)].map((_, i) => {
          const value = formatDay(subDays(startDay, i));
          let label = firstLetterUppercase(getFirst3LetterWeekDay(value));
          const blackListKeys = ["becks", "NOTES"];
          const filtered = Object.keys(diaryData[value] || [])
            .filter((key) => !blackListKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = diaryData[value][key];
              return obj;
            }, {});

          const dayIsDone = Object.keys(filtered).length !== 0;
          const isToday = i === 0;

          return (
            <TouchableOpacity key={i} onPress={() => startSurvey(i)}>
              <View style={styles.answer}>
                <View style={styles.answerLabel}>
                  {dayIsDone ? (
                    <RoundButtonIcon
                      backgroundColor="#5DEE5A"
                      iconColor="#fff"
                      borderWidth={0.5}
                      borderColor="#5DEE5A"
                      icon="validate"
                      visible={true}
                      medium
                      styleContainer={{ marginHorizontal: 0 }}
                    />
                  ) : (
                    <RoundButtonIcon
                      backgroundColor="#E7F6F8"
                      iconColor={colors.LIGHT_BLUE}
                      borderWidth={0.5}
                      borderColor={colors.LIGHT_BLUE}
                      icon="small-plus"
                      visible={true}
                      medium
                      styleContainer={{ marginHorizontal: 0 }}
                    />
                  )}
                  <View style={isToday ? styles.dayLabelTodayContainer : styles.dayLabelContainer}>
                    <Text style={isToday ? styles.dayLabelToday : styles.dayLabel}>{label}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  answer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  dayLabel: {
    fontSize: 10,
    color: "#000",
  },
  dayLabelContainer: {
    marginTop: 6,
    paddingHorizontal: 3,
    paddingVertical: 2,
    backgroundColor: "transparent",
  },
  dayLabelToday: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  dayLabelTodayContainer: {
    borderRadius: 99,
    marginTop: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: colors.LIGHT_BLUE,
  },
  fil: {
    marginLeft: -50,
    height: 1,
    backgroundColor: colors.LIGHT_BLUE,
    top: 16,
  },
  safe: {
    backgroundColor: "white",
  },
  separatorBottom: {
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 12,
    color: colors.BLUE,
    fontWeight: "bold",
  },
});

export default RecapCompletion;
