import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Platform } from "react-native";

import styleBeck from "../../styles/beck";
import Text from "../../components/MyText";
import Button from "../../components/Button";
import logEvents from "../../services/logEvents";
import JMButton from "@/components/JMButton";

export default ({ onChange, onSubmit, data }) => {
  const numberOfLines = 8;
  const [actionsSelected, setActionsSelected] = useState(data?.actions);
  const [consequencesForYouSelected, setConsequencesForYouSelected] = useState(data?.consequencesForYou);
  const [consequencesForRelativesSelected, setConsequencesForRelativesSelected] = useState(data?.consequencesForRelatives);

  useEffect(() => {
    logEvents.logBeckStepOpen(4);
  }, []);

  return (
    <View style={styles.safe}>
      <Text style={styleBeck.title}>Qu'avez-vous fait face à cette situation ?</Text>
      {/* <Text style={styleBeck.subtitle}>
        Face à cette situation, compte tenu de vos pensées et émotions
      </Text> */}
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
        minHeight={Platform.OS === "ios" ? 20 * numberOfLines : null}
        onChangeText={(actions) => {
          setActionsSelected(actions);
          onChange({ actions });
        }}
        value={actionsSelected}
        placeholder="J'ai fait..."
        style={styleBeck.textArea}
        textAlignVertical={"top"}
      />
      <Text style={styleBeck.title}>Quels résultats a eu ce comportement?</Text>
      <Text style={styleBeck.subtitle}>Juste après ce que vous avez fait, que se passe-t-il pour vous ?</Text>
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
        minHeight={Platform.OS === "ios" ? 20 * numberOfLines : null}
        onChangeText={(consequencesForYou) => {
          setConsequencesForYouSelected(consequencesForYou);
          onChange({ consequencesForYou });
        }}
        value={consequencesForYouSelected}
        placeholder="Message..."
        style={styleBeck.textArea}
        textAlignVertical={"top"}
      />
      <Text style={styleBeck.title}>Quelle a été la réaction de votre entourage ?</Text>
      <Text style={styleBeck.subtitle}>Comment ont réagi les personnes présentes ?</Text>
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
        minHeight={Platform.OS === "ios" ? 20 * numberOfLines : null}
        onChangeText={(consequencesForRelatives) => {
          setConsequencesForRelativesSelected(consequencesForRelatives);
          onChange({ consequencesForRelatives });
        }}
        value={consequencesForRelativesSelected}
        placeholder="Message..."
        style={styleBeck.textArea}
        textAlignVertical={"top"}
      />
      <JMButton title="Continuer" onPress={onSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
});
