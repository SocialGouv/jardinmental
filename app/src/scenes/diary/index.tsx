import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions } from "react-native";
import Text from "../../components/MyText";
import DiaryNotes from "./DiaryNotes";
import DiarySymptoms from "./DiarySymptoms";
import { colors } from "../../utils/colors";
import { DiaryNotesContext } from "../../context/diaryNotes";
import { DiaryDataContext } from "../../context/diaryData";
import localStorage from "../../utils/localStorage";
import ArrowUpSvg from "../../../assets/svg/arrow-up.svg";
import { formatDateThread, makeSureTimestamp } from "../../utils/date/helpers";
import DatePicker from "../../components/DatePicker";
import { VALID_SCREEN_NAMES } from "@/scenes/onboarding-v2/index";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import FileIcon from "@assets/svg/icon/File";

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;
const screenHeight = Dimensions.get("window").height;

const Diary = ({ navigation, hideDeader = false }) => {
  const [diaryNotes] = useContext(DiaryNotesContext);
  const [diaryData] = useContext(DiaryDataContext);
  const [page, setPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [userIndicators, setUserIndicators] = React.useState([]);

  useEffect(() => {
    (async () => {
      const _userIndicators = await localStorage.getIndicateurs();
      if (_userIndicators) {
        setUserIndicators(_userIndicators);
      }
    })();
  }, []);

  useEffect(() => {
    const handleOnboarding = async () => {
      const onboardingStep = await localStorage.getOnboardingStep();
      const onboardingIsDone = await localStorage.getOnboardingDone();

      //if ONBOARDING_DONE is true, do nothing
      if (onboardingIsDone) return;
      else {
        const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
        await localStorage.setIsNewUser(true);
        if (isFirstAppLaunch !== "false") {
          const onboardingStep = await localStorage.getOnboardingStep();
          let state;
          if (onboardingStep && VALID_SCREEN_NAMES.includes(onboardingStep)) {
            const index = VALID_SCREEN_NAMES.indexOf(onboardingStep);
            const routes = VALID_SCREEN_NAMES.slice(0, index + 1).map((name) => ({ name: name, key: name }));
            state = {
              index,
              routes,
            };
          }
          navigation.reset({
            routes: [
              {
                name: "onboarding",
                params: { screen: onboardingStep || "OnboardingPresentation" },
                state,
              },
            ],
          });
        }
      }
    };
    handleOnboarding();
  }, [navigation]);

  const diaryDataWithUserComments = Object.keys(diaryData).reduce((prev, curr) => {
    const n = Object.keys(diaryData[curr] || [])?.some((category) => diaryData[curr][category]?.userComment?.trim());
    return n ? { ...prev, [curr]: diaryData[curr] } : prev;
  }, {});

  const getUserComments = (obj, key) => {
    const userComments = Object.keys(obj[key] || [])
      ?.filter((s) => obj[key][s]?.userComment?.trim())
      .map((e) => ({ id: e, value: obj[key][e].userComment?.trim(), _indicateur: obj[key][e]._indicateur }));
    return userComments;
  };

  return (
    <View style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {Object.keys({ ...diaryNotes, ...diaryDataWithUserComments })
          .sort((a, b) => {
            a = a.split("/").reverse().join("");
            b = b.split("/").reverse().join("");
            return b.localeCompare(a);
          })
          .slice(0, LIMIT_PER_PAGE * page)
          .map((date) => {
            if (!diaryNotes[date] && !getUserComments(diaryData, date)?.length) return null;
            return (
              <View key={date}>
                <Text style={styles.subtitle}>{formatDateThread(date)}</Text>
                {/* DiaryNotes does no seemes used anymore */}
                <DiaryNotes date={date} diaryNote={diaryNotes[date]} navigation={navigation} />
                <DiarySymptoms userIndicators={userIndicators} date={date} values={getUserComments(diaryData, date)} navigation={navigation} />
              </View>
            );
          })}
        <View className="absolute -z-1 w-full items-center">
          <View className={"bg-cnam-primary-100 h-[150] w-[150] rounded-full items-center justify-center"} style={{ top: 20 }}>
            {<FileIcon width={31} height={31} color={"#84BECD"} />}
          </View>
        </View>
        <View className={mergeClassNames("border border-cnam-primary-200 rounded-2xl p-4 py-6 bg-white", "mt-32")} style={{ borderWidth: 0.5 }}>
          <>
            <Text className={mergeClassNames(typography.textMdBold, "text-cnam-primary-800 text-center px-4")}>
              Aucune note rédigée pour le moment.
            </Text>
            <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-800 text-left px-4 mt-4")}>
              Écrivez des notes sur vos observations pour ajouter un contexte ou une pensée : elle apparaîtra ici et dans vos Analyses (onglet
              “Déclencheurs”)
            </Text>
          </>
        </View>
        {Object.keys({ ...diaryNotes, ...diaryDataWithUserComments })?.length > LIMIT_PER_PAGE * page && (
          <TouchableOpacity onPress={() => setPage(page + 1)} style={styles.versionContainer}>
            <Text style={styles.arrowDownLabel}>Voir plus</Text>
            <ArrowUpSvg style={styles.arrowDown} color={colors.BLUE} />
          </TouchableOpacity>
        )}
      </ScrollView>
      <DatePicker
        visible={Boolean(showDatePicker)}
        mode={showDatePicker}
        initDate={timestamp}
        selectDate={(newDate) => {
          if (newDate && showDatePicker === "date") {
            const newDateObject = new Date(newDate);
            const oldDateObject = new Date(timestamp);
            newDate = new Date(
              newDateObject.getFullYear(),
              newDateObject.getMonth(),
              newDateObject.getDate(),
              oldDateObject.getHours(),
              oldDateObject.getMinutes()
            );
          }
          setShowDatePicker(false);
          if (newDate) {
            setTimestamp(makeSureTimestamp(newDate));
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 5,
    paddingBottom: 0,
  },
  arrowDown: {
    transform: [{ rotate: "180deg" }],
  },
  arrowDownLabel: {
    color: colors.BLUE,
  },
  versionContainer: {
    marginTop: 20,
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  subtitle: {
    color: colors.BLUE,
    fontSize: 17,
    textAlign: "center",
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    backgroundColor: "#F2FCFD",
    borderColor: "#D9F5F6",
    borderWidth: 1,
    borderRadius: 10,
    fontWeight: "600",
    overflow: "hidden",
  },
});

export default Diary;
