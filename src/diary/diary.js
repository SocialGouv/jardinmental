import React from 'react';
import {StyleSheet, ScrollView, Text, View} from 'react-native';
import DiaryItem from './diary-item';
import {diaryData} from './diary-data';
import {colors} from '../colors';

const Diary = () => (
  <ScrollView style={styles.container}>
    {diaryData.map(({date, patientState}) => (
      <View key={date}>
        <Text style={styles.title}>{date}</Text>
        <DiaryItem patientState={patientState} />
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 19,
    paddingBottom: 10,
    color: colors.BLUE,
    fontWeight: '700',
  },
});

export default Diary;
