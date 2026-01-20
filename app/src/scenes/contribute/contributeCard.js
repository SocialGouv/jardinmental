import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import JMButton from "@/components/JMButton";
import { TW_COLORS } from "@/utils/constants";
import { SquircleView } from "expo-squircle-view";

const ContributeCard = ({ onPress }) => {
  return (
    <SquircleView cornerSmoothing={100} preserveSmoothing={true} style={styles.container}>
      <View className="flex flex-col gap-4">
        <Text style={styles.title}>Contribuez à Jardin Mental</Text>
        <Text style={styles.message}>Dites-nous comment améliorer l’application, nous lisons tous les messages.</Text>
        <JMButton width="fixed" variant="secondary-blue" title="Donner mon avis" onPress={onPress} />
      </View>
    </SquircleView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: TW_COLORS.CNAM_CYAN_100_LIGHTEN_80, // TODO: trouver où on doit mettre cette couleur
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F4FCFD",
    marginBottom: 20,
    padding: 15,
  },
  title: {
    fontWeight: "bold",
    fontFamily: "SourceSans3-Bold",
    color: colors.BLUE,
    fontSize: 20,
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

export default ContributeCard;
