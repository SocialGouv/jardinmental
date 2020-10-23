import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import DiaryItem from './diary-item';
import {diaryData} from './diary-data';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
  },
});

const Diary = () => {
  return (
    <View style={styles.container}>
      {diaryData.map(({date, patientState}) => (
        <View key={date}>
          <Text style={styles.title}>{date}</Text>
          <DiaryItem patientState={patientState} />
        </View>
      ))}
    </View>
  );
};

export default Diary;
