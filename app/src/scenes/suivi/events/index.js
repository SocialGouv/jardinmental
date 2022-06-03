import React from "react";
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { isToday, isYesterday, parseISO } from "date-fns";
import { getArrayOfDatesFromTo, formatDay, formatRelativeDate } from "../../../utils/date/helpers";
import { DiaryDataContext } from "../../../context/diaryData";
import Text from "../../../components/MyText";
import { displayedCategories, scoresMapIcon } from "../../../utils/constants";
import { colors } from "../../../utils/colors";
import { buildSurveyData } from "../../survey/survey-data";
import Icon from "../../../components/Icon";
import localStorage from "../../../utils/localStorage";
import logEvents from "../../../services/logEvents";
import Button from "../../../components/Button";
import ScorePicker from "../ScorePicker";
import Card from "./Card";

const Events = ({ navigation, fromDate, toDate, focusedScores }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState();
  const [isEmpty, setIsEmpty] = React.useState();
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });
  const [symptom, setSymptom] = React.useState("ANXIETY");
  const [event, setEvent] = React.useState("ALL");
  const [score, setScore] = React.useState([5]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const q = await buildSurveyData();
        if (q) {
          setActiveCategories(q.map((e) => e.id));
          setSymptom(q[0].id);
        }
      })();
    }, [])
  );

  // React.useEffect(() => {
  //   console.log("✍️ ~ symptom", symptom);
  // }, [symptom]);

  const memoizedCallback = React.useCallback(() => {
    if (!symptom) return [];
    // console.log("SYMPTOME", symptom);
    if (!score || !score.length) return [];
    const targetScore = score[0];
    // console.log("score", score);
    if (!event) return [];
    // console.log("event", event);
    return chartDates.map((date) => {
      let infoDate = { date };
      // console.log("✍️ ~ date", date);
      const dayData = diaryData[date];
      if (!dayData) {
        // console.log("no dayData");
        return {};
      }
      const categoryState = diaryData[date][symptom];
      // console.log("✍️ ~ categoryState", categoryState);
      if (!categoryState) {
        // console.log("categoryState");
        return {};
      }
      if (diaryData[date][symptom]?.value !== targetScore) {
        return {};
      }

      // { label: "Tous les évènement", value: "ALL" },
      // { label: "Contexte de la journée", value: "CONTEXT" },
      // { label: "Précisions élément", value: "USER_COMMENT" },
      // { label: "Traitements", value: "POSOLOGY" },
      // { label: "Substances", value: "TOXIC" },

      if (dayData?.CONTEXT?.userComment) infoDate = { ...infoDate, CONTEXT: dayData?.CONTEXT?.userComment };
      if (categoryState?.userComment) infoDate = { ...infoDate, USER_COMMENT: categoryState?.userComment };

      // console.log("✍️ ~ infoDate", infoDate);

      return infoDate;

      // -------
      // the following code is for the retrocompatibility
      // -------

      // get the name and the suffix of the category
      // const [categoryName, suffix] = symptom.split("_");
      // let categoryStateIntensity = null;
      // if (suffix && suffix === "FREQUENCE") {
      //   // if it's one category with the suffix 'FREQUENCE' :
      //   // add the intensity (default level is 3 - for the frequence 'never')
      //   categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
      //   return { value: categoryState.level + categoryStateIntensity.level - 2 };
      // }
      // return { value: categoryState.level - 1 };
    });
  }, [symptom, score, event, chartDates, diaryData]);

  const startSurvey = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents.logFeelingStart();
    if (!symptoms) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day");
    }
  };

  const renderDate = (d) => {
    if (isYesterday(parseISO(d))) return "hier";
    if (isToday(parseISO(d))) return "aujourd'hui";
    let relativeDate = formatRelativeDate(d);
    return `le ${relativeDate}`;
  };

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.subtitleContainer}>
          <Icon icon="InfoSvg" width={25} height={25} color={colors.LIGHT_BLUE} />
          <Text style={styles.subtitle}>
            Des <Text style={styles.bold}>Évènements</Text> apparaîtront au fur et à mesure de vos saisies
            quotidiennes.
          </Text>
        </View>
        <Button title="Commencer à saisir" onPress={startSurvey} />
      </View>
    );
  }
  return (
    <>
      <View style={styles.filterContainer}>
        <View style={styles.filterItemContainer}>
          <Text style={styles.text}>Afficher tous les évènements associés à</Text>
          {/* <SelectEvent
            options={activeCategories}
            onChange={setEvent}
            placeholder="Choisir évènement"
            value={event}
          /> */}
        </View>
        <View style={styles.filterItemContainer}>
          {/* <Text>associé(s)&nbsp;à</Text> */}
          <SelectSymptom
            options={activeCategories}
            onChange={setSymptom}
            onOpen={logEvents.logSuiviEditSymptom}
            placeholder="Sélectionner un élément"
            value={symptom}
          />
        </View>
        <View style={styles.containerScorePickerFrise}>
          <ScorePicker
            focusedScores={score}
            onPress={(i) => {
              setScore([i]);
              logEvents.logSuiviEditScoreEvents(i);
            }}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        {memoizedCallback()?.filter((x) => x.date)?.length === 0 && (
          <Text style={styles.noDataMessage}>
            Aucun évènement à afficher entre {renderDate(formatDay(fromDate))} et{" "}
            {renderDate(formatDay(toDate))}.
          </Text>
        )}
        {memoizedCallback()
          ?.filter((x) => x.date)
          ?.sort((a, b) => {
            const ad = a.date.split("/").reverse().join("");
            const bd = b.date.split("/").reverse().join("");
            return bd.localeCompare(ad);
          })
          ?.map((d) => {
            return (
              <Card
                key={d.date}
                event={event}
                date={d.date}
                context={d.CONTEXT}
                userComment={d.USER_COMMENT}
              />
            );
          })}
      </ScrollView>
    </>
  );
};

const SelectSymptom = ({ value, placeholder, options = [], onChange = () => {}, onOpen = () => {} }) => {
  const getTitle = (cat) => {
    const category = displayedCategories[cat] || cat;
    const [categoryName, suffix] = category.split("_");
    if (suffix && suffix === "FREQUENCE") {
      return categoryName;
    }
    return category;
  };

  return (
    <RNPickerSelect
      value={value}
      useNativeAndroidPickerStyle={false}
      onValueChange={onChange}
      onOpen={onOpen}
      placeholder={{ label: placeholder, value: null, color: "grey", inputLabel: placeholder }}
      items={options.map((o) => ({ label: getTitle(o), value: o })) || []}
      style={pickerSelectStyles}
      Icon={() => <Icon icon="ArrowUpSvg" color={colors.DARK_BLUE} width={13} height={13} />}
    />
  );
};

const SelectEvent = ({ value, placeholder, onChange = () => {} }) => {
  return (
    <RNPickerSelect
      value={value}
      useNativeAndroidPickerStyle={false}
      onValueChange={onChange}
      placeholder={{ label: placeholder, value: null }}
      items={[
        { label: "Tous les évènement", value: "ALL" },
        { label: "Contexte de la journée", value: "CONTEXT" },
        { label: "Précisions élément", value: "USER_COMMENT" },
        { label: "Traitements", value: "POSOLOGY" },
        { label: "Substances", value: "TOXIC" },
      ]}
      style={pickerSelectStyles}
      Icon={() => <Icon icon="ArrowUpSvg" color={colors.DARK_BLUE} width={13} height={13} />}
    />
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontFamily: "Karla",
    paddingVertical: 8,
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingRight: 40,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    fontSize: 16,
    color: colors.DARK_BLUE,
    // minWidth: "100%",
    // width: "100%",
    textAlign: "left",
    // padding: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontFamily: "Karla",
    paddingVertical: 8,
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingRight: 40,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    fontSize: 16,
    color: colors.DARK_BLUE,
    // minWidth: "100%",
    // width: "100%",
    textAlign: "left",
  },
  iconContainer: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    marginHorizontal: 8,
    transform: [{ rotate: "180deg" }],
  },
});

const styles = StyleSheet.create({
  containerScorePickerFrise: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  filterContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  filterItemContainer: {
    flexDirection: "row",
    margin: 6,
    justifyContent: "center",
  },
  text: {
    flex: 1,
    color: colors.DARK_BLUE,
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingTop: 30,
    paddingHorizontal: 15,
    paddingBottom: 150,
  },
  noDataMessage: {
    color: "#111",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Events;
