import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button2 } from "../../../components/Button2";
import { InputLabel } from "../../../components/InputLabel";
import { InputText } from "../../../components/InputText";
import { Screen } from "../../../components/Screen";
import { setGoalTracked } from "../../../utils/localStorage/goals";

export const GoalsCreateForm = ({ navigation }) => {
  const [goalName, setGoalName] = useState("");

  const onValidate = () => {
    setGoalTracked({ label: goalName });
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
        placeholder="Entrez le nom de votre indicateur"
        containerStyle={styles.spacing}
        autoFocus
        value={goalName}
        onChangeText={setGoalName}
      />
      <Button2
        fill
        title="Valider"
        containerStyle={styles.spacing}
        onPress={onValidate}
        disabled={!(goalName?.length > 0)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
});
