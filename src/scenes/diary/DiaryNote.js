import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {makeSureDate} from '../../utils/date/helpers';
import Button from './Button';

const MAX_SIZE = 80;

const DiaryNote = ({note}) => {
  const [toggled, setToggled] = useState(false);
  const [buffer, setBuffer] = useState(note?.value);
  // const [valueDisplayed, setValueDisplayed] = useState('');
  const [initialValue, setInitialValue] = useState(note?.value);
  const [editMode, setEditMode] = useState(false);

  const lines = note?.value?.split(/\r\n|\r|\n/);
  const textIsLong = note?.value.length > MAX_SIZE || lines.length >= 3;

  const getValue = (v) => {
    if (editMode) return buffer;
    else if (!toggled)
      return initialValue
        ?.substring(0, MAX_SIZE)
        ?.split(/\r\n|\r|\n/)
        ?.slice(0, 3)
        ?.join('\n')
        ?.concat(textIsLong ? '...' : '');
    else return initialValue;
  };

  // useEffect(() => {
  //   toggled || editMode
  //     ? setValue(note?.value)
  //     : setValue(
  //         note?.value
  //           ?.substring(0, MAX_SIZE)
  //           ?.split(/\r\n|\r|\n/)
  //           ?.slice(0, 3)
  //           .join('\n'),
  //       );
  // }, [toggled, note?.value, editMode]);

  if (!note?.value) return null;

  return (
    <>
      <View
        key={note.id}
        style={[styles.item, editMode ? {backgroundColor: '#F4FCFD'} : {}]}>
        <View>
          <View style={styles.container}>
            <TextInput
              multiline={true}
              onChangeText={(e) => {
                setBuffer(e);
              }}
              value={getValue()}
              placeholder="Saisir ma nouvelle note"
              style={styles.label}
              textAlignVertical={'top'}
              editable={editMode}
            />
            <Text style={styles.timestamp}>
              {makeSureDate(note?.timestamp).getLocaleTime('fr')}
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              icon="pencil"
              visible={!editMode}
              onPress={() => setEditMode((e) => !e)}
            />
            <Button
              icon="toggle"
              visible={textIsLong && !editMode}
              onPress={() => setToggled((e) => !e)}
              isToggled={toggled}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomButtonsContainer}>
        {/* <Button icon="bin" visible={editMode} /> */}
        <Button
          icon="cancel"
          visible={editMode}
          onPress={() => {
            //restor initial value of the text
            setBuffer(initialValue);
            setEditMode(false);
            setToggled(false);
          }}
        />
        <Button
          icon="validate"
          visible={editMode}
          onPress={() => {
            setInitialValue(buffer);
            //todo save in context
            setEditMode(false);
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    display: 'flex',
    position: 'absolute',
    right: 0,
    bottom: -25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  item: {
    marginVertical: 10,
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    paddingVertical: 10,
  },
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
  timestamp: {
    marginTop: -8,
    fontSize: 11,
    color: colors.DARK_BLUE,
    fontStyle: 'italic',
  },
});

export default DiaryNote;
