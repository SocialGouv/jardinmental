import React from "react";
import { StyleSheet } from "react-native";
import { Button2 } from "../../../components/Button2";
import { InputLabel } from "../../../components/InputLabel";
import { InputText } from "../../../components/InputText";
import { Screen } from "../../../components/Screen";

export const GoalsCreateForm = ({ navigation }) => {
  const onValidate = () => {};

  return (
    <Screen
      header={{
        title: "Créer un objectif",
      }}
    >
      <InputLabel style={styles.spacing}>Comment souhaitez-vous appeler votre nouvel objectif ?</InputLabel>
      <InputText fill placeholder="Entrez le nom de votre indicateur" containerStyle={styles.spacing} />
      <Button2 fill title="Valider" containerStyle={styles.spacing} onPress={onValidate} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
});
