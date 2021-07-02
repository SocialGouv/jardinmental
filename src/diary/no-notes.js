import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../components/MyText';
import CircledIcon from '../components/CircledIcon';
import {colors} from '../utils/colors';

const NoNotes = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cta}>
        <View style={styles.divider} />
        <View style={styles.container}>
          <CircledIcon borderColor="#58C8D2" icon="NotesSvg" />
          <Text style={styles.text}>Ajouter une note</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cta: {
    borderRadius: 10,
    backgroundColor: 'rgba(31, 198, 213, 0.2)',
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
    color: colors.DARK_BLUE,
  },
  boldText: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,183,200, .09)',
    width: '80%',
    alignSelf: 'center',
  },
});

export default NoNotes;
