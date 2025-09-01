import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import Button from "../../components/Button";
import localStorage from "../../utils/localStorage";
import Matomo from "../../services/matomo";
import logEvents from "../../services/logEvents";
import { sendMail } from "../../services/mail";

export default ({ navigation, searchedValue }) => {
  const [drugNotFound, setDrugNotFound] = useState();
  const [npsSent, setNpsSent] = useState(false);

  useEffect(() => {
    setDrugNotFound(`Je ne trouve pas mon traitement, Je souhaiterais ajouter "${searchedValue}"`);
  }, [searchedValue]);

  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    await localStorage.setHasTreatment(false);
    navigation.navigate("tabs");
  };

  const formatText = ({ drugNotFound, userId }) => {
    let text = `User: ${userId}\n`;
    text += `Indiquez nous, si vous le souhaitez, le traitement que vous souhaiteriez suivre: ${drugNotFound}\n`;
    return text;
  };

  const sendNPS = async () => {
    if (npsSent) {
      return;
    }
    logEvents.logTreatmentNotFound(searchedValue);
    const userId = Matomo.userId;
    await sendMail({
      subject: "Jardin Mental - NPS",
      text: formatText({ drugNotFound, userId }),
    });
    setNpsSent(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.notFound} onPress={handleNoTreatment}>
        {`Aucun résultat ne correspond à cette recherche : "${searchedValue}"`}
      </Text>
      {npsSent ? (
        <Text style={styles.topSubTitle}>Merci, nous avons bien pris en compte votre retour !</Text>
      ) : (
        <>
          <Text style={styles.topSubTitle}>Indiquez nous, si vous le souhaitez, le traitement que vous souhaiteriez suivre.</Text>
          <TextInput
            style={styles.feedback}
            onChangeText={setDrugNotFound}
            placeholder="Votre message..."
            value={drugNotFound}
            multiline
            textAlignVertical="top"
            returnKeyType="next"
          />
          <View style={styles.buttonWrapper}>
            <Button onPress={sendNPS} title="Envoyer" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
