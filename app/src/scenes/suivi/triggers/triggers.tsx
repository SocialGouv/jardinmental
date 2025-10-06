import React from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { isToday, isYesterday, parseISO } from "date-fns";
import { getArrayOfDatesFromTo, formatDay, formatRelativeDate } from "@/utils/date/helpers";
import { DiaryDataContext } from "@/context/diaryData";
import { colors } from "@/utils/colors";
import Icon from "@/components/Icon";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import Card from "./Card";
import { EventFilterHeader } from "./EventFilterHeader";
import JMButton from "@/components/JMButton";
import { getIndicatorKey } from "@/utils/indicatorUtils";
import { TAB_BAR_HEIGHT } from "@/utils/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenHeight = Dimensions.get("window").height;

const Events = ({ navigation, presetDate, setPresetDate, fromDate, setFromDate, toDate, setToDate, onScroll }) => {
  const [diaryData] = React.useContext(DiaryDataContext);
  const [activeCategories, setActiveCategories] = React.useState();
  const [userIndicateurs, setUserIndicateurs] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState();
  const chartDates = getArrayOfDatesFromTo({ fromDate, toDate });
  const [indicateur, setIndicateur] = React.useState();
  const [indicateurId, setIndicateurId] = React.useState();
  const [event, setEvent] = React.useState("ALL");
  const [level, setLevel] = React.useState([5]);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
          setIndicateur(user_indicateurs[0].name);
          setIndicateurId(getIndicatorKey(user_indicateurs[0]));
        }
      })();
    }, [])
  );

  // React.useEffect(() => {
  //   console.log("✍️ ~ indicateur", indicateur);
  // }, getIndicatorKey);

  const memoizedCallback = React.useCallback(() => {
    if (!indicateur) return [];
    if (!indicateurId) return [];
    // console.log("SYMPTOME", indicateur);
    if (!level || !level.length) return [];
    let _targetLevel = level[0];
    // console.log("level", level);
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
      const categoryState = diaryData[date][indicateurId];

      // console.log("✍️ ~ categoryState", categoryState);
      if (!categoryState) {
        // console.log("categoryState");
        return {};
      }

      let targetLevel = _targetLevel;
      if (diaryData[date][indicateurId]?._indicateur?.order === "DESC") targetLevel = 6 - _targetLevel;
      let _value;
      if (diaryData[date][indicateurId]?._indicateur?.type === "smiley") {
        _value = diaryData[date][indicateurId]?.value;
      } else if (diaryData[date][indicateurId]?._indicateur?.type === "boolean") {
        _value = diaryData[date][indicateurId]?.value === true ? 5 : 1;
      } else if (diaryData[date][indicateurId]?._indicateur?.type === "gauge") {
        _value = Math.ceil(diaryData[date][indicateurId]?.value * 5);
      } else {
        _value = 0;
      }

      if (_value !== targetLevel) {
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
      // const [categoryName, suffix] = indicateur.split("_");
      // let categoryStateIntensity = null;
      // if (suffix && suffix === "FREQUENCE") {
      //   // if it's one category with the suffix 'FREQUENCE' :
      //   // add the intensity (default level is 3 - for the frequence 'never')
      //   categoryStateIntensity = diaryData[date][`${categoryName}_INTENSITY`] || { level: 3 };
      //   return { value: categoryState.level + categoryStateIntensity.level - 2 };
      // }
      // return { value: categoryState.level - 1 };
    });
  }, [indicateur, indicateurId, level, event, chartDates, diaryData]);

  const startSurvey = async () => {
    const symptoms = await localStorage.getSymptoms();
    logEvents._deprecatedLogFeelingStart();

    if (!symptoms) {
      navigation.navigate("symptoms", {
        showExplanation: true,
        redirect: "select-day",
      });
    } else {
      navigation.navigate("select-day", {
        origin: "no_data_beck",
      });
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
            Des <Text style={styles.bold}>Évènements</Text> apparaîtront au fur et à mesure de vos saisies quotidiennes.
          </Text>
        </View>
        <JMButton title="Commencer à saisir" onPress={startSurvey} />
      </View>
    );
  }
  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        <EventFilterHeader
          presetDate={presetDate}
          setPresetDate={setPresetDate}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          indicateur={indicateur}
          setIndicateur={(indicatorName) => {
            setIndicateur(indicatorName);
            const _indicator = userIndicateurs.find((ind) => ind.name === indicatorName);
            setIndicateurId(getIndicatorKey(_indicator));
          }}
          level={level}
          setLevel={setLevel}
          userIndicateurs={userIndicateurs.filter(({ active }) => active)}
        />
        <View style={styles.dataContainer}>
          {memoizedCallback()?.filter((x) => x.date)?.length === 0 && (
            <Text style={styles.noDataMessage}>
              Aucun évènement à afficher entre {renderDate(formatDay(fromDate))} et {renderDate(formatDay(toDate))}.
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
              return <Card key={d.date} event={event} date={d.date} context={d.CONTEXT} userComment={d.USER_COMMENT} />;
            })}
        </View>
      </ScrollView>
    </>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontFamily: "SourceSans3",
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
    fontFamily: "SourceSans3",
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
  text: {
    color: colors.DARK_BLUE,
    fontSize: 16,
    textAlign: "left",
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
    paddingTop: 20,
    minHeight: screenHeight * 0.7,
  },
  dataContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  noDataMessage: {
    color: "#111",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Events;
