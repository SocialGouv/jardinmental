import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import DiaryNote from './DiaryNote';
import {displayedCategories} from '../../utils/constants';
import localStorage from '../../utils/localStorage';
import Text from '../../components/MyText';

const DiaryNotes = ({navigation, diaryNote, date}) => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  if (!diaryNote || !diaryNote?.values) return null;
  const handleEdit = (tab) => {};

  const handlePressItem = () => {
    handleEdit('day-survey');
  };

  return (
    <View style={styles.container}>
      {diaryNote?.values
        ?.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
        ?.map((note) => (
          <DiaryNote key={note.id} note={note} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    paddingVertical: 10,
  },
  container: {
    paddingLeft: 15,
    paddingVertical: 10,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: '#00CEF7',
  },
  divider: {
    height: 1,
    backgroundColor: '#6BD1F3',
    marginVertical: 10,
    width: '60%',
    alignSelf: 'center',
  },
});

export default DiaryNotes;
