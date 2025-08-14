import React from "react";
import {
  Dimensions,
  Modal,
  Platform,
  AppState,
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
import Notifications from "../notifications";
import { sendMail } from "../mail";
import { colors } from "../../utils/colors";
import Matomo from "../matomo";
import logEvents from "../logEvents";
import localStorage from "../../utils/localStorage";
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

const NPSTimeoutMS = __DEV__ ? 1000 * 3 : 1000 * 60 * 60 * 24 * 10;
const emailFormat = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(email);

const STORE_KEYS = {
  NPS_DONE: "@NPSDone",
  INITIAL_OPENING: "@NPSInitialOpening",
};

class NPS extends React.Component {
  state = {
    visible: false,
    useful: null,
    reco: null,
    feedback: "",
    contact: "",
    sendButton: getCaption("post"),
    NPSKey: 0,
    page: 2,
  };

  async componentDidMount() {
    if (__DEV__) {
      this.reset();
    }
    this.NPSListener = AppState.addEventListener("change", this.handleAppStateChange);
    if (!__DEV__) {
      this.notificationsListener = Notifications.listen(this.handleNotification, "NPS");
    }
    this.checkNeedNPS();
  }

  componentWillUnmount() {
    this.NPSListener?.remove();
    Notifications.remove(this.notificationsListener);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.NPSKey && this.state.NPSKey) {
      this.checkNeedNPS();
    }
    if (!prevProps.forceView && this.props.forceView && !this.state.visible) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ visible: true });
    }
    if (prevState.visible && !this.state.visible) {
      if (this.props.close) {
        this.props.close();
      }
      this.npsSent = false;
    }
  }

  handleNotification = (notification) => {
    if (notification.title === getCaption("notifTitle") && notification.userInteraction === true) {
      this.setState({ visible: true });
    }
  };

  reset = async () => {
    await AsyncStorage.removeItem(STORE_KEYS.NPS_DONE);
    await AsyncStorage.removeItem(STORE_KEYS.INITIAL_OPENING);
  };

  checkNeedNPS = async () => {
    const NPSDone = await AsyncStorage.getItem(STORE_KEYS.NPS_DONE);
    if (NPSDone) {
      return;
    }

    const appFirstOpening = await AsyncStorage.getItem(STORE_KEYS.INITIAL_OPENING);
    if (__DEV__) return;
    if (!appFirstOpening && !__DEV__) {
      await AsyncStorage.setItem(STORE_KEYS.INITIAL_OPENING, new Date().toISOString());
      Notifications.scheduleNotification({
        date: new Date(Date.now() + NPSTimeoutMS),
        title: getCaption("notifTitle"),
        message: getCaption("notifMessage"),
      });
      return;
    }
    const opening = await AsyncStorage.getItem(STORE_KEYS.INITIAL_OPENING);
    const timeForNPS = Date.now() - Date.parse(new Date(opening)) > NPSTimeoutMS;
    if (!timeForNPS) {
      return;
    }
    logEvents.logNPSOpen();
    await AsyncStorage.setItem(STORE_KEYS.NPS_DONE, "true");
    this.setState({ visible: true });
  };

  handleAppStateChange = (newState) => {
    const { NPSKey } = this.state;
    if (newState === "active" && !NPSKey) {
      this.setState({ NPSKey: 1 });
    }
    if (newState.match(/inactive|background/) && Boolean(NPSKey)) {
      this.setState({ NPSKey: 0 });
    }
  };

  setUseful = (useful) => this.setState({ useful });
  setReco = (reco) => this.setState({ reco });
  setFeedback = (feedback) => this.setState({ feedback });
  setSendButton = (sendButton) => this.setState({ sendButton });
  setContact = (contact) => this.setState({ contact });

  onClose = async () => {
    const { useful, reco } = this.state;
    if ((useful !== null || reco !== null) && !this.npsSent) {
      await this.sendNPS();
    }
    this.setState({ visible: false });
  };

  nextPage = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  sendNPS = async () => {
    if (this.npsSent) {
      return;
    }
    const { useful, feedback, contact } = this.state;
    this.setSendButton("Merci !");
    logEvents.logNPSUsefulSend(useful);
    const userId = Matomo.userId;
    const supported = await localStorage.getSupported();
    const startDate = await AsyncStorage.getItem("@SURVEY_DATE");
    sendMail({
      subject: "Jardin Mental - NPS",
      text: formatText({ useful, feedback, userId, contact, supported, startDate }),
    });
    this.npsSent = true;
    this.setState({ visible: false, useful: null, reco: null });
  };

  renderFirstPage() {
    const { useful, reco, sendButton } = this.state;
    return (
      <>
        <Text style={styles.topTitle}>{getCaption("feedback.rate-app.title")}</Text>
        <Text style={styles.topSubTitle}>{getCaption("feedback.rate-app.useful")}</Text>
        <Mark
          selected={useful}
          onPress={this.setUseful}
          bad={getCaption("feedback.rate-app.useful.not")}
          good={getCaption("feedback.rate-app.useful.extremely")}
        />
        <Text style={styles.topSubTitle}>{getCaption("feedback.rate-app.probable")}</Text>
        <Mark
          selected={reco}
          onPress={this.setReco}
          bad={getCaption("feedback.rate-app.probable.not")}
          good={getCaption("feedback.rate-app.probable.extremely")}
        />
        <TouchableOpacity style={styles.buttonContainer} disabled={!useful || !reco} onPress={this.nextPage}>
          <Text style={styles.buttonText}>{sendButton}</Text>
        </TouchableOpacity>
      </>
    );
  }

  renderSecondPage() {
    const { feedback, sendButton, contact, useful, reco } = this.state;
    return (
      <>
        <Text style={styles.topSubTitle}>{getCaption("feedback.rate-app.useful")}</Text>
        <Mark
          selected={useful}
          onPress={this.setUseful}
          bad={getCaption("feedback.rate-app.useful.not")}
          good={getCaption("feedback.rate-app.useful.extremely")}
        />
        <Text style={styles.topSubTitle}>{getCaption("feedback.improvements.question")}</Text>
        <TextInput
          style={styles.feedback}
          onChangeText={this.setFeedback}
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
          onChangeText={this.setContact}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="go"
          onSubmitEditing={this.sendNPS}
        />
        <TouchableOpacity style={styles.buttonContainer} disabled={sendButton === "Merci !"} onPress={this.sendNPS}>
          <Text style={styles.buttonText}>{sendButton}</Text>
        </TouchableOpacity>
      </>
    );
  }

  render() {
    const { visible, page } = this.state;
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onDismiss={this.onClose}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.select({ ios: "padding", android: null })}>
            <View style={styles.backContainer}>
              <TouchableOpacity onPress={this.onClose}>
                <Text style={styles.backText}>{getCaption("back")}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView} keyboardDismissMode="on-drag" onScrollBeginDrag={Keyboard.dismiss}>
              {page === 1 && this.renderFirstPage()}
              {page === 2 && this.renderSecondPage()}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
}

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
  notifTitle: "Vos retours sont importants pour nous",
  notifMessage: "Avez-vous quelques secondes pour donner votre avis ?",
  post: "Envoyer",
  back: "Retour",
  "feedback.rate-app.title": "5 secondes pour nous aider\u00A0?\u000AVos retours sont importants pour nous.",
  "feedback.rate-app.useful": "Ce service vous a-t-il été utile\u00A0?",
  "feedback.rate-app.useful.not": "Pas utile du tout",
  "feedback.rate-app.useful.extremely": "Extrêmement utile",
  "feedback.rate-app.probable": "Quelle est la probabilité que vous recommandiez ce service à un ami ou un proche\u00A0?",
  "feedback.rate-app.probable.not": "Pas du tout probable",
  "feedback.rate-app.probable.extremely": "Très probable",
  "feedback.improvements.question": "Pour améliorer notre service, avez-vous quelques recommandations à nous faire\u00A0?",
  // 'feedback.improvements.question':
  //   'Comment pouvons-nous vous être encore plus utile\u00A0? Comment pouvons-nous améliorer ce service\u00A0?',
  "feedback.improvements.legal-message":
    "Merci de ne mentionner aucune information personnelle qui permettrait de vous identifier (nom, prénom, adresse mail, n° de téléphone, toute information sur votre état de santé)",
  "feedback.improvements.placeholder": "Idées d'améliorations (facultatif)",
  "feedback.contact.description":
    "Echanger avec vous serait précieux pour améliorer notre service, laissez-nous votre adresse mail si vous le souhaitez.",
  "feedback.contact": "Adresse mail (facultatif)",
};

// in case of i18n, we need to get the caption with a function
// if not, if language changes, it's not repercuted
const getCaption = (key) => captions[key];

export default NPS;
