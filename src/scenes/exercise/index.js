import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import { useFocusEffect } from "@react-navigation/native";

import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import NPS from "../../services/NPS/NPS";
import Header from "../../components/Header";
import ExerciseItem from "./exercise-item";
import { DiaryDataContext } from "../../context/diaryData";
import { formatDateThread } from "../../utils/date/helpers";
import ContributeCard from "../contribute/contributeCard";
import { STORAGE_KEY_BECK_SHOW_WELCOME } from "../../utils/constants";
import ArrowUpSvg from "../../../assets/svg/arrow-up.svg";

const LIMIT_PER_PAGE = __DEV__ ? 3 : 30;

export default ({ navigation, setPlusVisible }) => {
  const [NPSvisible, setNPSvisible] = useState(false);
  const [diaryData] = useContext(DiaryDataContext);
  const [page, setPage] = useState(1);
  const [showWelcome, setShowWelcome] = useState("true");
  const [showWelcomeDefault, setShowWelcomeDefault] = useState(true);

  useEffect(() => {
    (async () => {
      setShowWelcome(await AsyncStorage.getItem(STORAGE_KEY_BECK_SHOW_WELCOME));
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setPlusVisible(true);
    }, [setPlusVisible])
  );

  const validateWelcomeMessage = async () => {
    setShowWelcome("false");
    await AsyncStorage.setItem(STORAGE_KEY_BECK_SHOW_WELCOME, `${showWelcomeDefault}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={() => setNPSvisible(false)} />
      <View style={styles.headerContainer}>
        <Header title="Beck" navigation={navigation} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        {showWelcome === "true" || !showWelcome ? (
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, styles.boldText]}>
              Cet exercice nécessite des explications afin de le réaliser. Nous vous recommandons d’en
              discuter préalablement avec un thérapeute.
            </Text>
            <Text style={styles.welcomeText}>
              Voici une vidéo qui vous présente brièvement comment remplir vos fiches :{" "}
              <Text
                style={styles.link}
                onPress={() => {
                  // todo logevent voir video
                  Linking.openURL("https://youtu.be/3U4J-_QsTc0");
                }}
              >
                voir la vidéo
              </Text>
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
            <TouchableOpacity onPress={validateWelcomeMessage} style={styles.button}>
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("beck")} style={styles.button}>
              <Text style={styles.buttonText}>Faire le point sur un évènement</Text>
            </TouchableOpacity>
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
            <ContributeCard onPress={() => setNPSvisible(true)} />
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 5,
    paddingBottom: 0,
  },
  safe: {
    flex: 1,
    backgroundColor: "white",
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
