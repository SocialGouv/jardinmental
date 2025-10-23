import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Alert,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Text from "../../components/MyText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Mark from "./Mark";
import { sendMail } from "../mail";
import { colors } from "../../utils/colors";
import Matomo from "../matomo";
import logEvents from "../logEvents";
import localStorage from "../../utils/localStorage";
import NPSManager from "./NPSManager";
import pck from "../../../package.json";

// just to make sure nothing goes the bad way in production, debug is always false

const lookUpSupported = {
  YES: "Je suis suivi, j’ai téléchargé l’application sur recommandation du professionnel qui me suit",
  YES_SOLO: "Je suis suivi, j’ai téléchargé l’application de moi-même",
  NOT_YET: "Je ne suis pas suivi mais je le souhaite",
  NO: "Je ne suis pas suivi",
  PRO: "Je suis professionnel de santé",
};

const formatText = ({ useful, feedback, userId, contact, supported, startDate }) =>
  `
User: ${userId}
Version: ${pck.version}
OS: ${Platform.OS}
Date de téléchargement: ${startDate}
Comment pouvons-nous vous être encore plus utile: ${feedback}
Ce service vous a-t-il été utile: ${useful}
contact: ${contact}
profil: ${lookUpSupported[supported]}
`;

const NPS = () => {
  const [visible, setVisible] = useState(false);
  const [useful, setUseful] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [contact, setContact] = useState("");
  const [sendButton, setSendButton] = useState(getCaption("post"));
  const npsSentRef = useRef(false);
  const prevVisibleRef = useRef(false);

  useEffect(() => {
    // Listen to NPSManager state changes
    const unsubscribeFromNPSManager = NPSManager.addListener((shouldShow) => {
      setVisible(shouldShow);
    });

    // Check initial state
    if (NPSManager.getShouldShowNPS()) {
      setVisible(true);
    }

    return () => {
      if (unsubscribeFromNPSManager) {
        unsubscribeFromNPSManager();
      }
    };
  }, []);

  useEffect(() => {
    if (!prevVisibleRef.current && visible) {
      // Log when NPS modal opens
      logEvents.logNPSOpen();
    }
    if (prevVisibleRef.current && !visible) {
      npsSentRef.current = false;
    }
    prevVisibleRef.current = visible;
  }, [visible]);

  const onClose = async () => {
    if (useful !== null && !npsSentRef.current) {
      await sendNPS();
    }
    NPSManager.hideNPS();
  };

  const sendNPS = async () => {
    if (npsSentRef.current) {
      return;
    }
    // Log when NPS form is sent
    logEvents.logNPSFormSent();

    setSendButton("Merci !");
    // logEvents._deprecatedLogNPSUsefulSend(useful);
    const userId = Matomo.userId;
    const supported = await localStorage.getSupported();
    const startDate = await AsyncStorage.getItem("@SURVEY_DATE");
    sendMail({
      subject: "Jardin Mental - NPS",
      text: formatText({ useful, feedback, userId, contact, supported, startDate }),
    });
    npsSentRef.current = true;

    // Show thank you message
    setTimeout(() => {
      Alert.alert("Merci pour votre retour !");
    }, 300);

    NPSManager.hideNPS();
    setUseful(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onDismiss={onClose}>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.select({ ios: "padding", android: null })}>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.backText}>{getCaption("back")}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView} keyboardDismissMode="on-drag" onScrollBeginDrag={Keyboard.dismiss}>
            <Text style={styles.topSubTitle}>{getCaption("feedback.rate-app.useful")}</Text>
            <Mark
              selected={useful}
              onPress={setUseful}
              bad={getCaption("feedback.rate-app.useful.not")}
              good={getCaption("feedback.rate-app.useful.extremely")}
            />
            <Text style={styles.topSubTitle}>{getCaption("feedback.improvements.question")}</Text>
            <TextInput
              style={styles.feedback}
              onChangeText={setFeedback}
              placeholder={getCaption("feedback.improvements.placeholder")}
              value={feedback}
              multiline
              textAlignVertical="top"
              returnKeyType="next"
            />
            {/* <Text style={styles.topSubTitle}>{getCaption("feedback.rate-app.probable")}</Text>
              <Mark
                selected={reco}
                onPress={this.setReco}
                bad={getCaption("feedback.rate-app.probable.not")}
                good={getCaption("feedback.rate-app.probable.extremely")}
              /> */}
            <Text style={styles.topSubTitle}>{getCaption("feedback.contact.description")}</Text>
            <TextInput
              style={styles.contact}
              value={contact}
              placeholder={getCaption("feedback.contact")}
              onChangeText={setContact}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={sendNPS}
            />
            <TouchableOpacity style={styles.buttonContainer} disabled={sendButton === "Merci !"} onPress={sendNPS}>
              <Text style={styles.buttonText}>{sendButton}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: Dimensions.get("window").width,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    flex: 1,
    flexBasis: "100%",
    minHeight: "100%",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
    minHeight: "100%",
  },
  topTitle: {
    width: "95%",
    flexShrink: 0,
    marginTop: 10,
    color: colors.BLUE,
  },
  topSubTitle: {
    width: "95%",
    flexShrink: 0,
    marginTop: 35,
    color: "#191919",
  },
  feedback: {
    width: "100%",
    height: 100,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#dbdbe9",
    backgroundColor: "#f3f3f6",
    padding: 15,
    marginTop: 15,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: "flex-start",
    alignSelf: "center",
    flexGrow: 0,
    marginBottom: 150,
    backgroundColor: colors.BLUE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: "#dbdbe9",
  },
  contact: {
    width: "100%",
    height: 50,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#dbdbe9",
    backgroundColor: "#f3f3f6",
    paddingLeft: 15,
    marginTop: 15,
    marginBottom: 10,
    justifyContent: "center",
    color: colors.BLUE,
  },
  backContainer: {
    backgroundColor: "#f9f9f9",
    marginVertical: 15,
    paddingHorizontal: 30,
    alignItems: "flex-start",
  },
  backText: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: colors.BLUE,
  },
  legalMessage: {
    fontSize: 12,
    width: "95%",
    flexShrink: 0,
    marginTop: 15,
    color: "#666",
  },
});

const captions = {
  post: "Envoyer",
  back: "Retour",
  "feedback.rate-app.useful": "Ce service vous a-t-il été utile\u00A0?",
  "feedback.rate-app.useful.not": "Pas utile du tout",
  "feedback.rate-app.useful.extremely": "Extrêmement utile",
  "feedback.improvements.question": "Pour améliorer notre service, avez-vous quelques recommandations à nous faire\u00A0?",
  "feedback.improvements.placeholder": "Idées d'améliorations (facultatif)",
  "feedback.contact.description":
    "Echanger avec vous serait précieux pour améliorer notre service, laissez-nous votre adresse mail si vous le souhaitez.",
  "feedback.contact": "Adresse mail (facultatif)",
};

// in case of i18n, we need to get the caption with a function
// if not, if language changes, it's not repercuted
const getCaption = (key) => captions[key];

export default NPS;
