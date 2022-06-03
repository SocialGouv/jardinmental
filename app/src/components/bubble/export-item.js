import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";

const ExportItem = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <Text style={styles.title}>Envoyer un récapitulatif de mes données</Text>
      <Text style={styles.message}>Recevez vos données des 30 derniers jours par mail</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(31, 198, 213, 0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F4FCFD",
    marginBottom: 20,
    padding: 15,
  },
  title: {
    fontWeight: "bold",
    color: colors.BLUE,
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    marginVertical: 10,
    color: colors.BLUE,
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default ExportItem;
