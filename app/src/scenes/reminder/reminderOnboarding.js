import React, { useEffect, useRef, useState } from "react";
import { Alert, View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { openSettings } from "react-native-permissions";
import dayjs from "dayjs";
import Text from "../../components/MyText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import localStorage from "../../utils/localStorage";
import { ONBOARDING_STEPS } from "../../utils/constants";
import TimePicker from "../../components/timePicker";
import NotificationService from "../../services/notifications";
import { colors } from "../../utils/colors";
import logEvents from "../../services/logEvents";
import BackButton from "../../components/BackButton";
import Rappel from "../onboarding/assets/Rappel";
import Button from "../../components/Button";
import OutlineButton from "../../components/OutlineButton";

const ReminderStorageKey = "@Reminder";

const Reminder = ({
  navigation,
  route,
  notifReminderTitle = "Comment ça va aujourd'hui ?",
  notifReminderMessage = "N'oubliez pas de remplir votre application Jardin Mental",
}) => {
  const [reminder, setReminder] = useState(null);
  const [reminderSetupVisible, setReminderSetupVisible] = useState(false);

  const getReminder = async (showAlert = true) => {
    const isRegistered = await NotificationService.checkPermission();
    let storedReminder = await AsyncStorage.getItem(ReminderStorageKey);
    if (storedReminder) {
      if (!dayjs(storedReminder).isValid()) {
        try {
          storedReminder = JSON.parse(storedReminder);
        } catch (e) {}
      }
    }
    if (Boolean(storedReminder) && !dayjs(storedReminder).isValid()) {
      deleteReminder();
    }
    if (!isRegistered && storedReminder && showAlert) showPermissionsAlert();
    if (!storedReminder && route?.params?.onboarding) {
      setReminder(dayjs().set("hours", 20).set("minutes", 0));
      return;
    }
    const scheduled = await NotificationService.getScheduledLocalNotifications();
    if (!storedReminder) return;
    setReminder(dayjs(storedReminder));
  };

  const handleNotification = (notification) => {
    if (notification.title === notifReminderTitle) {
      navigation.navigate("tabs");
    }
  };

  const notificationListener = useRef();
  useEffect(() => {
    getReminder(false);
    notificationListener.current = NotificationService.listen(handleNotification, "reminder");
    if (route?.params?.onboarding) localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_REMINDER);
    // return () => NotificationService.remove(notificationListener.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleNotification = async (newReminder = new Date(Date.now() + 10 * 1000)) => {
    NotificationService.cancelAll();
    const fireDate = dayjs()
      .set("hours", newReminder.getHours())
      .set("minutes", newReminder.getMinutes())
      .set("seconds", 0)
      .toDate();
    NotificationService.scheduleNotification({
      date: fireDate,
      title: notifReminderTitle,
      message: notifReminderMessage,
      repeatType: "day",
    });
    logEvents.logReminderAdd();
  };

  const showReminderSetup = async () => {
    const isRegistered = await NotificationService.checkAndAskForPermission();
    if (!isRegistered) {
      showPermissionsAlert();
      return;
    }
    setReminderSetupVisible(true);
  };

  const showPermissionsAlert = () => {
    Alert.alert(
      "Vous devez autoriser les notifications pour accéder à ce service",
      "Veuillez cliquer sur Réglages puis Notifications pour activer les notifications",
      [
        {
          text: "Réglages",
          onPress: openSettings,
        },
        {
          text: "Annuler",
          onPress: deleteReminder,
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const setReminderRequest = async (newReminder) => {
    setReminderSetupVisible(false);
    if (!dayjs(newReminder).isValid()) return;
    await scheduleNotification(newReminder);
    setReminder(dayjs(newReminder));
    await AsyncStorage.setItem(ReminderStorageKey, JSON.stringify(dayjs(newReminder)));
    setReminderSetupVisible(false);
    const scheduled = await NotificationService.getScheduledLocalNotifications();
  };

  const deleteReminder = async () => {
    NotificationService.cancelAll();
    setReminder("");
    setReminderSetupVisible(false);
    await AsyncStorage.removeItem(ReminderStorageKey);
  };
  const deleteReminderManually = () => {
    logEvents.logReminderCancel();
    deleteReminder();
  };

  const validateOnboarding = async () => {
    if (!reminder) {
      const date = new Date();
      date.setHours(20, 0, 0, 0);
      setReminderRequest(date);
    }

    await localStorage.setOnboardingDone(true);
    // await localStorage.setOnboardingStep(null);
    navigation.navigate("onboarding-drugs");
  };
  const DesactivateReminder = async () => {
    await localStorage.setOnboardingDone(true);
    // await localStorage.setOnboardingStep(null);
    navigation.navigate("onboarding-drugs");
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton onPress={navigation.goBack} />
      <View style={styles.containerSvg}>
        <Rappel width={100} height={100} />
      </View>
      <View style={styles.description}>
        {reminder ? (
          <>
            <Text style={styles.title}>
              Plus vous remplirez votre questionnaire, plus vous en apprendrez sur vous et votre santé mentale
            </Text>
            <Text style={styles.body}>
              Pour vous aider, je peux vous envoyer une notification de rappel à :
            </Text>
            <TouchableOpacity onPress={showReminderSetup}>
              <Text style={styles.time}>{`${dayjs(reminder).format("HH:mm")}`}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.subtitle}>
            Un rappel permet de remplir plus souvent l’application et obtenir des analyses plus pertinentes
          </Text>
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button onPress={validateOnboarding} title="Suivant" />
        <TouchableOpacity style={stylesButton.button} onPress={DesactivateReminder}>
          <Text style={stylesButton.text}>Désactiver le rappel</Text>
        </TouchableOpacity>
      </View>
      <TimePicker visible={reminderSetupVisible} selectDate={setReminderRequest} />
    </SafeAreaView>
  );
};

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 10,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    minWidth: "70%",
    minHeight: 45,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#1f2937",
  },
});

const styles = StyleSheet.create({
  buttonWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    position: "absolute",
    bottom: 0,
    padding: 20,
  },

  containerSvg: {
    alignItems: "center",
    marginVertical: 20,
  },
  ctaContainer: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    margin: 30,
  },
  lightBlue: {
    color: colors.LIGHT_BLUE,
  },
  smallImage: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },
  bigImage: {
    color: "#C3C7D5",
    marginVertical: 0,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 100,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
    height: "100%",
  },
  bigTitle: {
    width: "80%",
    flexShrink: 0,
    textAlign: "center",
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: "700",
    marginTop: "10%",
  },
  smallTitle: {
    width: "80%",
    flexShrink: 0,
    textAlign: "center",
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: "700",
  },
  description: {
    width: "80%",
    marginTop: "10%",
    marginBottom: "20%",
  },
  title: {
    fontSize: 18,
    color: colors.BLUE,
    fontWeight: "700",
  },
  time: {
    borderColor: colors.DARK_BLUE,
    borderRadius: 20,
    borderWidth: 1,
    color: colors.DARK_BLUE,
    fontWeight: "500",
    fontSize: 35,
    textAlign: "center",
    paddingVertical: 10,
  },
  buttons: {
    justifyContent: "space-around",
    marginVertical: 15,
    marginBottom: "20%",
  },
  backButtonContainer: {
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginBottom: "20%",
    marginTop: 20,
  },
  backButton: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
  },
  later: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
  },
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  setupButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  body: {
    color: colors.DARK_BLUE,
    fontSize: 15,
    marginVertical: 10,
    fontWeight: "300",
    textAlign: "left",
  },
  link: {
    color: "#181818",
    textDecorationLine: "underline",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "300",
    textAlign: "center",
  },
  lightblue: {
    color: colors.LIGHT_BLUE,
  },
});

export default Reminder;
