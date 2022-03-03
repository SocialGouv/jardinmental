import React from "react";
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

import { getArrayOfDatesFromTo } from "../../../utils/date/helpers";
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

const ChartFrise = ({ navigation, fromDate, toDate, focusedScores }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState();
  const [isEmpty, setIsEmpty] = React.useState();
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });
  const [symptom, setSymptom] = React.useState("ANXIETY");
  const [event, setEvent] = React.useState("CONTEXT");
  const [score, setScore] = React.useState([1]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const q = await buildSurveyData();
        if (q) {
          setActiveCategories(q.map((e) => e.id));
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
      console.log("✍️ ~ date", date);
      const dayData = diaryData[date];
      if (!dayData) {
        console.log("no dayData");
        return {};
      }
      const categoryState = diaryData[date][symptom];
      console.log("✍️ ~ categoryState", categoryState);
      if (!categoryState) {
        console.log("categoryState");
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

      console.log("✍️ ~ infoDate", infoDate);

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
      <View>
        <View style={styles.datesContainer}>
          <Text>Afficher</Text>
          <SelectEvent
            options={activeCategories}
            onChange={setEvent}
            placeholder="Choisir évènement"
            value={event}
          />
        </View>
        <View style={styles.datesContainer}>
          <Text>associé(s)&nbsp;à</Text>
          <SelectSymptom
            options={activeCategories}
            onChange={setSymptom}
            placeholder="Choisir critères"
            value={symptom}
          />
        </View>
        <ScorePicker
          focusedScores={score}
          onPress={(i) => {
            if (score.includes(i)) {
              setScore([]);
            } else {
              setScore((e) => [i]);
            }
          }}
        />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        {memoizedCallback()
          ?.filter((x) => x.date)
          ?.sort((a, b) => {
            const ad = a.date.split("/").reverse().join("");
            const bd = b.date.split("/").reverse().join("");
            return bd.localeCompare(ad);
          })
          ?.map((d) => {
            console.log("🎄", d);
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

const SelectSymptom = ({ value, placeholder, options = [], onChange = () => {} }) => {
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
      placeholder={{ label: placeholder, value: null }}
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
    backgroundColor: "transparent",
    borderColor: colors.DARK_BLUE,
    borderWidth: 1,
    height: 30,
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
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.DARK_BLUE,
    // minWidth: "100%",
    // width: "100%",
    textAlign: "left",
  },
  iconContainer: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    marginRight: 8,
    transform: [{ rotate: "180deg" }],
  },
});

const styles = StyleSheet.create({
  datesContainer: {
    flexDirection: "row",
    margin: 6,
  },

  friseContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  friseTitle: {
    fontSize: 19,
    color: colors.BLUE,
    fontWeight: "600",
  },
  squareContainer: {
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  squareItemContainer: {
    display: "flex",
    flex: 1,
    height: 10,
  },
  square: {
    flex: 1,
    height: 10,
  },
  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendText: {
    fontSize: 12,
    color: colors.BLUE,
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
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  setupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 350 ? 19 : 15,
    flexWrap: "wrap",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
});

export default ChartFrise;
