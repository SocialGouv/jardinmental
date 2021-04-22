import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../components/MyText';
import CircledIcon from '../common/circled-icon';
import NoNote from './no-notes';
import {isToday, isYesterday, parseISO} from 'date-fns';

const Notes = ({notes, date, onPress}) => {
  if (
    !notes ||
    (typeof notes === 'string' && !notes) || //retro compatibility
    (typeof notes === 'object' &&
      !notes?.notesEvents &&
      !notes?.notesSymptoms &&
      !notes?.notesToxic)
  ) {
    if (isToday(parseISO(date)) || isYesterday(parseISO(date))) {
      return <NoNote onPress={onPress} />;
    } else {
      return null;
    }
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
      return (
        <View style={styles.textContainer}>
          {renderNote('Évènement', notes.notesEvents)}
          {renderNote('Symptôme', notes.notesSymptoms)}
          {renderNote('Toxique', notes.notesToxic)}
        </View>
      );
    }
  };

  const canEdit = isToday(parseISO(date)) || isYesterday(parseISO(date));

  return (
    <View>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[
          styles.container,
          canEdit && {
            borderRadius: 10,
            backgroundColor: 'rgba(31, 198, 213, 0.2)',
          },
        ]}
        onPress={onPress}
        disabled={!canEdit}>
        <CircledIcon
          borderColor="#58C8D2"
          color="rgba(34,192,207, .1)"
          icon="NotesSvg"
        />
        {renderNotes()}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,183,200, .09)',
    marginTop: 12,
    width: '80%',
    alignSelf: 'center',
  },
});

export default Notes;
