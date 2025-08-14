import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button2 } from "../../../components/Button2";
import { InputLabel } from "../../../components/InputLabel";
import { InputText } from "../../../components/InputText";
import { Screen } from "../../../components/Screen";
import JMButton from "@/components/JMButton";

export const GoalsCreateForm = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [goalName, setGoalName] = useState("");

  const onValidate = async () => {
    if (loading) return;
    navigation.navigate("goal-day-selector", { editing: false, goalLabel: goalName });
  };

  return (
    <Screen
      header={{
        title: "Créer un objectif",
      }}
    >
      <InputLabel style={styles.spacing}>Comment souhaitez-vous appeler votre nouvel objectif ?</InputLabel>
      <InputText
        fill
        placeholder="Entrez le nom de votre objectif"
        containerStyle={styles.spacing}
        autoFocus
        value={goalName}
        onChangeText={setGoalName}
      />
      <JMButton title="Valider" className="my-2" onPress={onValidate} disabled={!(goalName?.length > 0)} loading={loading} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
});
