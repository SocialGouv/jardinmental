import React from "react";
import { TouchableOpacity, StyleSheet, View, Animated } from "react-native";
import { subDays } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";

import { beforeToday, formatDay, getFirst3LetterWeekDay } from "../../utils/date/helpers";
import { colors } from "../../utils/colors";
import { firstLetterUppercase } from "../../utils/string-util";
import { DiaryDataContext } from "../../context/diaryData";
import RoundButtonIcon from "../../components/RoundButtonIcon";
import Text from "../../components/MyText";

const RecapCompletion = ({ navigation }) => {
  const positionLabelTreshold = 25;
  const now = new Date(Date.now());
  const [diaryData] = React.useContext(DiaryDataContext);
  const [width, setWidth] = React.useState(100);

  const startSurvey = (offset) => {
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
      const total = 30;
      const aujourdhui = new Date(Date.now());
      const p = [...Array(total)].reduce((prev, current, i) => {
        const value = formatDay(subDays(aujourdhui, i));
        const blackListKeys = ["becks", "NOTES"];
        const filtered = Object.keys(diaryData[value] || [])
          .filter((key) => !blackListKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = diaryData[value][key];
            return obj;
          }, {});

        const dayIsDone = Object.keys(filtered).length !== 0;
        if (dayIsDone) {
          return prev + 1;
        }
        return prev;
      }, 0);
      setWidth(Math.round((p / total) * 100));
    }, [diaryData])
  );

  return (
    <View style={styles.safe}>
      <Text style={[styles.title, styles.separatorBottom]}>
        Complétez votre semaine pour un meilleur suivi
      </Text>
      <View style={styles.buttonsContainer}>
        {[...Array(7)].map((_, i) => {
          const value = formatDay(subDays(now, i));
          let label = firstLetterUppercase(getFirst3LetterWeekDay(value));
          const blackListKeys = ["becks", "NOTES"];
          const filtered = Object.keys(diaryData[value] || [])
            .filter((key) => !blackListKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = diaryData[value][key];
              return obj;
            }, {});

          const dayIsDone = Object.keys(filtered).length !== 0;

          return (
            <TouchableOpacity key={i} onPress={() => startSurvey(i)}>
              <View style={[styles.answer, dayIsDone ? styles.answerDone : styles.answerNotDone]}>
                <View style={styles.answerLabel}>
                  {dayIsDone ? (
                    // <RoundButtonIcon
                    //   backgroundColor="#EFFDEF"
                    //   iconColor="#5DEE5A"
                    //   borderWidth={0.5}
                    //   borderColor="#5DEE5A"
                    //   icon="validate"
                    //   visible={true}
                    // />
                    <RoundButtonIcon
                      backgroundColor="#5DEE5A"
                      iconColor="#fff"
                      borderWidth={0.5}
                      borderColor="#5DEE5A"
                      icon="validate"
                      visible={true}
                      medium
                    />
                  ) : (
                    <RoundButtonIcon
                      backgroundColor="#E7F6F8"
                      iconColor={colors.LIGHT_BLUE}
                      borderWidth={0.5}
                      borderColor={colors.LIGHT_BLUE}
                      icon="plus"
                      visible={true}
                      medium
                    />
                  )}
                  <Text style={styles.dayLabel}>{label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.title, styles.separatorBottom, styles.separatorTop]}>
        Remplissage des 30 derniers jours
      </Text>
      <View style={styles.progressBar}>
        <View
          style={
            ([StyleSheet.absoluteFill],
            {
              backgroundColor: colors.LIGHT_BLUE,
              width: `${width}%`,
              borderRadius: 999,
              textAlign: "center",
            })
          }
        >
          {width > positionLabelTreshold ? <Text style={[styles.labelPourcentage]}>{width}%</Text> : null}
        </View>
        {width <= positionLabelTreshold ? (
          <Text style={[styles.labelPourcentage, styles.labelPourcentageOut]}>{width}%</Text>
        ) : null}
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
    marginTop: 6,
    fontSize: 10,
    color: "#000",
  },
  labelPourcentage: {
    paddingVertical: 5,
    color: "#fff",
    textAlign: "center",
  },
  labelPourcentageOut: {
    marginLeft: 5,
    color: colors.BLUE,
  },
  progressBar: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#E7F6F8",
    borderColor: colors.LIGHT_BLUE,
    borderRadius: 999,
    overflow: "hidden",
  },
  safe: {
    backgroundColor: "white",
  },
  separatorBottom: {
    marginBottom: 10,
  },
  separatorTop: {
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 12,
    color: colors.BLUE,
    fontWeight: "bold",
  },
});

export default RecapCompletion;
