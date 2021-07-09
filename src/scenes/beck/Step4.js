import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, Platform} from 'react-native';

import styleBeck from '../../styles/beck';
import Text from '../../components/MyText';
import Button from '../../components/Button';

export default ({onChange, onSubmit, data}) => {
  const numberOfLines = 8;
  const [actionsSelected, setActionsSelected] = useState();
  const [
    consequencesForYouSelected,
    setConsequencesForYouSelected,
  ] = useState();
  const [
    consequencesForRelativesSelected,
    setConsequencesForRelativesSelected,
  ] = useState();

  useEffect(() => {
    setActionsSelected(data?.actions);
    setConsequencesForYouSelected(data?.consequencesForYou);
    setConsequencesForRelativesSelected(data?.consequencesForRelatives);
  }, [data]);
  return (
    <View style={styles.safe}>
      <Text style={styleBeck.title}>
        Qu'avez-vous fait face à cette situation ?
      </Text>
      {/* <Text style={styleBeck.subtitle}>
        Face à cette situation, compte tenu de vos pensées et émotions
      </Text> */}
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
        minHeight={Platform.OS === 'ios' ? 20 * numberOfLines : null}
        onChangeText={(actions) => onChange({actions})}
        value={actionsSelected}
        placeholder="J'ai fait..."
        style={styleBeck.textArea}
      />
      <Text style={styleBeck.title}>Quels résultats a eu ce comportement?</Text>
      <Text style={styleBeck.subtitle}>
        Juste après ce que vous avez fait, que se passe-t-il pour vous ?
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
        minHeight={Platform.OS === 'ios' ? 20 * numberOfLines : null}
        onChangeText={(consequencesForYou) => onChange({consequencesForYou})}
        value={consequencesForYouSelected}
        placeholder="Message..."
        style={styleBeck.textArea}
      />
      <Text style={styleBeck.title}>
        Quelle a été la réaction de votre entourage ?
      </Text>
      <Text style={styleBeck.subtitle}>
        Comment ont réagit les personnes présentes ?
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
        minHeight={Platform.OS === 'ios' ? 20 * numberOfLines : null}
        onChangeText={(consequencesForRelatives) =>
          onChange({consequencesForRelatives})
        }
        value={consequencesForRelativesSelected}
        placeholder="Message..."
        style={styleBeck.textArea}
      />
      <Button
        title="Continuer"
        buttonStyle={styleBeck.submitButton}
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
});
