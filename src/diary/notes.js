import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import CircledIcon from '../common/circled-icon';

const Notes = ({notes}) => {
  if (!notes) {
    return null;
  }
  return (
    <View>
      <View style={styles.divider} />
      <View style={styles.container}>
        <CircledIcon color="rgba(34,192,207, .1)" icon="NotesSvg" />
        <Text style={styles.text}>{notes}</Text>
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
  text: {
    fontSize: 15,
    width: '75%',
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
