import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import Swiper from "react-native-swiper";
import localStorage from "../../utils/localStorage";
import logEvents from "../../services/logEvents";
import Button from "../../components/Button";
import ActiveDot from "./ActiveDot";
import BackButton from "../../components/BackButton";
import { Screen0, Screen1, Screen2, Screen3 } from "./screens";
import { ONBOARDING_STEPS } from "../../utils/constants";

const Onboarding = ({ navigation }) => {
  const [isCguChecked, setIsCguChecked] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef();

  useEffect(() => {
    (async () => {
      const onboardingIsDone = await localStorage.getOnboardingDone();
      const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
      setFirstTime(__DEV__ ? true : isFirstAppLaunch !== "false" && !onboardingIsDone);
    })();
  }, [navigation]);

  const validateOnboarding = async () => {
    if (firstTime) {
      navigation.navigate(ONBOARDING_STEPS.STEP_SUPPORTED);
    } else {
      navigation.navigate("tabs");
    }
  };

  const onPressNext = () => swiperRef?.current?.scrollBy(1);

  return (
    <SafeAreaView style={styles.safe}>
      {!firstTime ? <BackButton onPress={navigation.goBack} /> : null}
      {/* <Text style={styles.title}>Jardin Mental m'accompagne entre mes consultations</Text> */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Swiper
          onIndexChanged={(page) => {
            // dirty hack because of this issue
            // https://github.com/leecade/react-native-swiper/issues/1209
            setTimeout(() => {
              setCurrentIndex(page);
              firstTime && logEvents.logOnboardingSwipe(page);
            }, 0);
          }}
          loop={false}
          ref={swiperRef}
          // showsButtons
          activeDot={<ActiveDot />}
        >
          <Screen0 />
          <Screen1 />
          <Screen2 isCguChecked={isCguChecked} setIsCguChecked={setIsCguChecked} navigation={navigation} />
        </Swiper>
      </ScrollView>
      <View style={styles.CTAButtonContainer}>
        {currentIndex === 2 ? (
          firstTime ? (
            <>
              <View style={styles.buttonWrapper}>
                <Button
                  buttonStyle={styles.buttonStyle}
                  onPress={validateOnboarding}
                  title="C'est parti !"
                  disabled={!isCguChecked && firstTime}
                />
              </View>
            </>
          ) : (
            <View style={styles.buttonWrapper}>
              <Button buttonStyle={styles.buttonStyle} title="Terminer" onPress={navigation.goBack} />
            </View>
          )
        ) : (
          <View style={styles.buttonWrapper}>
            <Button buttonStyle={styles.buttonStyle} title="Suivant" onPress={onPressNext} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  CTAButtonContainer: {},
  scrollContainer: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
  },
  label: {
    width: "100%",
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 19,
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    padding: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "flex-end",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
  },
  buttonStyle: {
    width: "100%",
  },
  emphasis: {
    color: "#1FC6D5",
  },
  presentationText: {
    fontSize: 20,
    color: "#0A215C",
  },
  message: {
    fontSize: 22,
    padding: 15,
    color: colors.DARK_BLUE,
  },
});

export default Onboarding;
