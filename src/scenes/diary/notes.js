import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import Icon from '../../components/Icon';
import NoNote from './no-notes';
import {canEdit} from './diary';

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

  return (
    <View>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[
          styles.container,
          canEdit(date) && {
            borderRadius: 10,
            backgroundColor: 'rgba(31, 198, 213, 0.2)',
          },
        ]}
        onPress={onPress}
        disabled={!canEdit(date)}>
        <Icon
          icon="NotesSvg"
          color="#58C8D2"
          width={25}
          height={25}
          styleContainer={styles.icon}
        />
        {renderNotes()}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {marginRight: 20},
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,183,200, .09)',
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
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
});

export default Notes;
