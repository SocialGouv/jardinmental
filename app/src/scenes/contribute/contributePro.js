import React, { useState } from "react";
import { StyleSheet, View, TextInput, SafeAreaView, ScrollView, Keyboard } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import Button from "../../components/Button";
import Matomo from "../../services/matomo";
import logEvents from "../../services/logEvents";
import { sendTipimail } from "../../services/sendTipimail";
import BackButton from "../../components/BackButton";

export default ({ navigation, searchedValue }) => {
  const [value, setValue] = useState();
  const [npsSent, setNpsSent] = useState(false);

  const formatText = ({ value, userId }) => {
    let text = `User: ${userId}\n`;
    text += `Retour professionnel de santé : ${value}\n`;
    return text;
  };

  const sendNPS = async () => {
    if (npsSent) {
      return;
    }
    logEvents.logProNPSSend();
    const userId = Matomo.userId;
    await sendTipimail(
      {
        from: {
          address: "contact@monsuivipsy.fr",
          personalName: " - Application",
        },
        subject: "Ma Tête et Moi - NPS",
        text: formatText({ value, userId }),
      },
      __DEV__ ? "tangimds@gmail.com" : "mateteetmoi@fabrique.social.gouv.fr"
    );
    setNpsSent(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        {npsSent ? (
          <Text style={styles.topSubTitle}>Merci, nous avons bien pris en compte votre retour !</Text>
        ) : (
          <>
            <Text style={styles.topTitle}>Vos retours sont précieux !</Text>
            <Text style={styles.topSubTitle}>
              Ce service est en amélioration continue grâce à vos retours. Pour le rendre encore plus utile,
              nous aimerions échanger avec vous.
              {"\n"}
              Indiquez-nous votre mail pour que nous puissions vous contacter si cela vous intéresse.
            </Text>
            <TextInput
              style={styles.feedback}
              onChangeText={setValue}
              placeholder="exemple@mail.com"
              value={value}
              multiline
              textAlignVertical="top"
              returnKeyType="next"
            />
            <View style={styles.buttonWrapper}>
              <Button onPress={sendNPS} title="Envoyer" />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 150,
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

  topTitle: {
    fontSize: 18,
    textAlign: "center",
    width: "95%",
    flexShrink: 0,
    marginTop: 10,
    color: colors.BLUE,
    fontWeight: "bold",
  },
  topSubTitle: {
    width: "95%",
    flexShrink: 0,
    marginTop: 35,
    color: "#444",
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

  notFound: {
    color: "#444",
    fontStyle: "italic",
    fontWeight: "600",
    padding: 30,
  },

  separator: {
    borderTopWidth: 1,
    borderColor: "#EDEDED",
    marginVertical: 30,
    alignItems: "center",
  },
  separatorText: {
    top: -10,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    color: "#8F8F8F",
    fontStyle: "italic",
    fontWeight: "600",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#F4FCFD",
    borderColor: "#d4f0f2",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  cardContent: { flex: 1 },
  button: { width: "90%" },
  cardTitle: {
    fontSize: 15,
    color: colors.DARK_BLUE,
    fontWeight: "500",
    marginBottom: 10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: colors.DARK_BLUE,
    fontWeight: "300",
    marginBottom: 10,
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
});
