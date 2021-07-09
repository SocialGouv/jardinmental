import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, Platform} from 'react-native';

import styleBeck from '../../styles/beck';
import Text from '../../components/MyText';
import Button from '../../components/Button';

export default ({onChange, onSubmit, data}) => {
  const numberOfLines = 8;
  const [whatSelected, setWhatSelected] = useState();

  useEffect(() => {
    setWhatSelected(data?.what);
  }, [data]);

  return (
    <View style={styles.safe}>
      <Text style={styleBeck.title}>Que s'est-il passé ?</Text>
      <Text style={styleBeck.subtitle}>
        Avec vos mots, et factuellement, racontez cette situation
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
        minHeight={Platform.OS === 'ios' ? 20 * numberOfLines : null}
        onChangeText={(what) => onChange({what})}
        value={whatSelected}
        placeholder="Je me suis disputé avec un ami..."
        style={styleBeck.textArea}
        textAlignVertical={'top'}
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
