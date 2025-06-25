import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';

import styleBeck from '../../styles/beck';
import Text from '../../components/MyText';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import DiscretSlider from '../../components/DiscretSlider';
import logEvents from '../../services/logEvents';

export default ({ onChange, onSubmit, data }) => {
  const numberOfLines = 8;
  const [trustInThoughsThenSelected, setTrustInThoughsThenSelected] = useState(
    data?.trustInThoughsThen,
  );
  const [
    thoughtsBeforeMainEmotionSelected,
    setThoughtsBeforeMainEmotionSelected,
  ] = useState(data?.thoughtsBeforeMainEmotion);
  const [memoriesSelected, setMemoriesSelected] = useState(data?.memories);

  useEffect(() => {
    logEvents.logBeckStepOpen(3);
  }, []);

  return (
    <View style={styles.safe}>
      <Text style={styleBeck.title}>
        Quelle pensée a traversé votre esprit ?
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
        minHeight={Platform.OS === 'ios' ? 20 * numberOfLines : null}
        onChangeText={(thoughtsBeforeMainEmotion) => {
          setThoughtsBeforeMainEmotionSelected(thoughtsBeforeMainEmotion);
          onChange({ thoughtsBeforeMainEmotion });
        }}
        value={thoughtsBeforeMainEmotionSelected}
        placeholder="Mes pensées..."
        style={styleBeck.textArea}
        textAlignVertical={'top'}
      />
      <Separator style={styleBeck.separator} />
      <Text style={styleBeck.title}>
        Sur le moment, à quel point cette pensée vous a semblé juste ?
      </Text>
      <DiscretSlider
        step={trustInThoughsThenSelected}
        onChange={(trustInThoughsThen) => {
          setTrustInThoughsThenSelected(trustInThoughsThen);
          onChange({ trustInThoughsThen });
        }}
      />
      <Separator style={styleBeck.separator} />
      <Text style={styleBeck.title}>
        Quelles images ou souvenirs vous ont traversé l’esprit ?
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
        minHeight={Platform.OS === 'ios' ? 20 * numberOfLines : null}
        onChangeText={(memories) => {
          setMemoriesSelected(memories);
          onChange({ memories });
        }}
        value={memoriesSelected}
        placeholder="Message..."
        style={styleBeck.textArea}
        textAlignVertical={'top'}
      />
      <JMButton
        title="Continuer"
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
