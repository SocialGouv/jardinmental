import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../components/MyText';
import CircledIcon from '../common/circled-icon';

const Notes = ({notes}) => {
  if (
    (typeof notes === 'string' && !notes) || //retro compatibility
    (typeof notes === 'object' &&
      !notes?.notesEvents &&
      !notes?.notesSymptoms &&
      !notes?.notesToxic)
  ) {
    return null;
  }

  const renderNote = (t, v) => {
    if (!v) return null;
    return (
      <Text style={styles.text}>
        <Text style={styles.boldText}>{t} : </Text>
        {v}
      </Text>
    );
  };

  const renderNotes = () => {
    if (typeof notes === 'string') {
      //retro compatibility
      return <Text style={styles.text}>{notes}</Text>;
    } else {
      console.log('new notes', notes);
      return (
        <View style={styles.textContainer}>
          {renderNote('Évènement', notes.notesEvents)}
          {renderNote('Symptôme', notes.notesSymptoms)}
          {renderNote('Toxique', notes.notesToxic)}
        </View>
      );
    }
  };

  return (
    <View>
      <View style={styles.divider} />
      <View style={styles.container}>
        <CircledIcon color="rgba(34,192,207, .1)" icon="NotesSvg" />
        {renderNotes()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  textContainer: {width: '100%'},
  text: {
    width: '80%',
    fontSize: 15,
    marginBottom: 5,
  },
  boldText: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,183,200, .09)',
    marginTop: 12,
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },
});

export default Notes;
