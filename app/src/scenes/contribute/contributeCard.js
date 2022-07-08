import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";

const ContributeItem = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>Contribuer à Ma Tête et Moi</Text>
        <Text style={styles.message}>
          Dites-nous comment améliorer l'application{"\n"}
          <Text style={styles.muted}>Nous lisons tous les messages</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

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
    marginVertical: 10,
    color: colors.BLUE,
    fontSize: 16,
  },
  muted: {
    fontSize: 12,
    fontStyle: "italic",
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default ContributeItem;
