import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import Icon from '../../components/Icon';
import {canEdit} from './utils/index.js';
import ArrowRightSvg from '../../../assets/svg/arrow-right.js';

const Notes = ({notes, date, onPress}) => {
  if (
    !notes ||
    (typeof notes === 'string' && !notes) || //retro compatibility
    (typeof notes === 'object' &&
      !notes?.notesEvents &&
      !notes?.notesSymptoms &&
      !notes?.notesToxic)
  ) {
    if (canEdit(date)) {
      return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
          <View style={styles.label}>
            <Icon
              icon="NotesSvg"
              color="#58C8D2"
              width={20}
              height={20}
              styleContainer={styles.icon}
            />
            <Text>Ajouter une note</Text>
          </View>
          <ArrowRightSvg color="#C7CED5" />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  const Note = ({title, text}) => {
    if (!text) return null;

    return (
      <Text>
        <Text style={styles.boldText}>{title} : </Text>
        <Text style={styles.italic}>{text}</Text>
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        canEdit(date) && {
          borderRadius: 10,
        },
      ]}
      onPress={onPress}
      disabled={!canEdit(date)}>
      <Icon
        icon="NotesSvg"
        color="#58C8D2"
        width={20}
        height={20}
        styleContainer={styles.icon}
      />
      {typeof notes === String ? (
        //Retro compatibility
        <Text style={styles.text}>{notes}</Text>
      ) : (
        <View style={styles.textContainer}>
          <Note title="Context" text={notes.notesEvents} />
          <Note title="Symptôme" text={notes.notesSymptoms} />
          <Note title="Toxique" text={notes.notesToxic} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {marginRight: 5},
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {width: '100%'},
  boldText: {fontWeight: '700'},
  italic: {fontStyle: 'italic'},
});

export default Notes;
