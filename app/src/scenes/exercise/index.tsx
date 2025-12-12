import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, Linking, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";

import { colors } from "@/utils/colors";
import NPSManager from "@/services/NPS/NPSManager";
import Header from "@/components/Header";
import ExerciseItem from "./exercise-item";
import { DiaryDataContext } from "@/context/diaryData";
import { formatDateThread } from "@/utils/date/helpers";
import ContributeCard from "../contribute/contributeCard";
import { STORAGE_KEY_BECK_SHOW_WELCOME, TAB_BAR_HEIGHT, TW_COLORS } from "@/utils/constants";
import ArrowUpSvg from "@assets/svg/arrow-up.svg";
import FloatingPlusButton from "@/components/FloatingPlusButton";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

export default ({ navigation, startSurvey }) => {
  const [diaryData] = useContext(DiaryDataContext);
  const [page, setPage] = useState(1);
  const [showWelcome, setShowWelcome] = useState("true");
  const [showWelcomeDefault, setShowWelcomeDefault] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      setShowWelcome(await AsyncStorage.getItem(STORAGE_KEY_BECK_SHOW_WELCOME));
    })();
  }, []);

  const validateWelcomeMessage = async () => {
    setShowWelcome("false");
    await AsyncStorage.setItem(STORAGE_KEY_BECK_SHOW_WELCOME, `${showWelcomeDefault}`);
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = (event) => {
    "worklet";
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <>
      <View className="flex-1">
        <AnimatedHeaderScrollScreen
          title={"Beck"}
          handlePrevious={() => {
            navigation.goBack();
          }}
          smallHeader={true}
          navigation={navigation}
          showBottomButton={false}
          scrollViewBackground={TW_COLORS.GRAY_50}
        >
          <View className="p-4">
            {showWelcome === "true" || !showWelcome ? (
              <View style={styles.welcomeContainer}>
                <Text style={[styles.welcomeText, styles.boldText]}>
                  Cet exercice nécessite des explications afin de le réaliser. Nous vous recommandons d’en discuter préalablement avec un thérapeute.
                </Text>
                <View style={styles.showWelcomeView}>
                  <CheckBox
                    animationDuration={0.2}
                    boxType="square"
                    style={styles.checkbox}
                    value={!showWelcomeDefault}
                    onValueChange={(value) => setShowWelcomeDefault(!value)}
                    // for android
                    tintColors={{ true: colors.LIGHT_BLUE, false: "#aaa" }}
                    // for ios
                    tintColor="#aaa"
                    onCheckColor={colors.LIGHT_BLUE}
                    onTintColor={colors.LIGHT_BLUE}
                    onAnimationType="bounce"
                    offAnimationType="bounce"
                  />
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setShowWelcomeDefault((e) => !e)}>
                    <Text>Ne plus afficher ce message</Text>
                  </TouchableOpacity>
                </View>
                <JMButton onPress={validateWelcomeMessage} title={"Valider"}></JMButton>
              </View>
            ) : (
              <>
                <JMButton title="Faire le point sur un évènement" onPress={() => navigation.navigate("beck")}></JMButton>
                <View style={styles.divider} />
                {Object.keys(diaryData)
                  .sort((a, b) => {
                    a = a.split("/").reverse().join("");
                    b = b.split("/").reverse().join("");
                    return b.localeCompare(a);
                  })
                  .filter((el) => diaryData[el]?.becks && Object.keys(diaryData[el].becks).length > 0)
                  .slice(0, LIMIT_PER_PAGE * page)
                  .map((date) => (
                    <View key={date}>
                      <Text style={styles.subtitle}>{formatDateThread(date)}</Text>
                      <ExerciseItem patientState={diaryData[date]} date={date} navigation={navigation} />
                    </View>
                  ))}
                <ContributeCard onPress={() => NPSManager.showNPS()} />
                {Object.keys(diaryData)
                  ?.sort((a, b) => {
                    a = a.split("/").reverse().join("");
                    b = b.split("/").reverse().join("");
                    return b.localeCompare(a);
                  })
                  ?.filter((el) => diaryData[el]?.becks && Object.keys(diaryData[el].becks).length > 0)?.length >
                  LIMIT_PER_PAGE * page && (
                  <TouchableOpacity onPress={() => setPage(page + 1)} style={styles.versionContainer}>
                    <Text style={styles.arrowDownLabel}>Voir plus</Text>
                    <ArrowUpSvg style={styles.arrowDown} color={colors.BLUE} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </AnimatedHeaderScrollScreen>
      </View>
      <FloatingPlusButton shadow onPress={startSurvey} plusPosition={0} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 0,
    backgroundColor: colors.LIGHT_BLUE,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.LIGHT_BLUE,
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderColor: "#E7E9F1",
    borderRadius: 10,
    marginBottom: 10,
  },
  welcomeText: { marginBottom: 30 },
  boldText: { fontWeight: "bold" },
  showWelcomeView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  checkbox: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  button: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 45,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 350 ? 19 : 15,
    flexWrap: "wrap",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
    width: "50%",
    alignSelf: "center",
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
  versionContainer: {
    marginTop: 20,
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowDown: {
    transform: [{ rotate: "180deg" }],
  },
  arrowDownLabel: {
    color: colors.BLUE,
  },
  link: {
    color: colors.LIGHT_BLUE,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
