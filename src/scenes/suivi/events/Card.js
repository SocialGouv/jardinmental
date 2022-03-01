import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../../components/MyText";
import { colors } from "../../../utils/colors";
import { getArrayOfDatesFromTo, formatDateThread } from "../../../utils/date/helpers";

const noData = "Non renseigné";
const Card = ({ date, context = noData, userComment = noData }) => {
  if (!date) return null;
  return (
    <View>
      <Text style={styles.title}>{formatDateThread(date)}</Text>
      <View style={styles.container}>
        {context ? (
          <>
            <Text style={styles.sectionTitle}>Contexte de la journée</Text>
            <Text style={styles.message}>{context || noData}</Text>
          </>
        ) : null}
        {userComment ? (
          <>
            <Text style={styles.sectionTitle}>Précisions sur l'élément</Text>
            <Text style={styles.message}>{userComment || noData}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F6F6",
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  title: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    fontWeight: "bold",
    color: colors.BLUE,
    fontSize: 12,
  },
  sectionTitle: {
    marginVertical: 10,
    color: colors.BLUE,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  message: {
    color: "#111",
    fontSize: 14,
  },
  muted: {
    fontSize: 12,
    fontStyle: "italic",
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default Card;
