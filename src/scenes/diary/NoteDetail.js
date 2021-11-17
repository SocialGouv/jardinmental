import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {makeSureDate} from '../../utils/date/helpers';
import ToggleButton from './ToggleButton';

const MAX_SIZE = 80;

const NoteDetail = ({note}) => {
  const [toggled, setToggled] = useState(false);
  if (!note?.value) return null;

  const lines = note?.value?.split(/\r\n|\r|\n/);
  const textIsLong = note?.value.length > MAX_SIZE || lines.length >= 3;

  return (
    <>
      <View style={styles.container}>
        {textIsLong && !toggled ? (
          <Text style={styles.label}>
            {note?.value
              ?.substring(0, MAX_SIZE)
              ?.split(/\r\n|\r|\n/)
              ?.slice(0, 3)
              .join('\n')}
            ...
          </Text>
        ) : (
          <Text style={styles.label}>{note?.value}</Text>
        )}
        <Text style={styles.timestamp}>
          {makeSureDate(note?.timestamp).getLocaleTime('fr')}
        </Text>
      </View>
      <ToggleButton
        visible={textIsLong}
        onPress={() => setToggled((e) => !e)}
        isToggled={toggled}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  label: {
    flex: 1,
    fontSize: 15,
  },
  timestamp: {fontSize: 13, color: colors.DARK_BLUE, fontStyle: 'italic'},
});

export default NoteDetail;
