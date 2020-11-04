import React from 'react';
import {StyleSheet, ScrollView, Text, View} from 'react-native';
import DiaryItem from './diary-item';
import {colors} from '../colors';
import Header from '../header';
import {useDiaryData} from '../hooks/useDiaryData';

const Diary = () => {
  const diaryData = useDiaryData();
  return (
    <ScrollView style={styles.container}>
      <Header />
      {diaryData.map(({date, patientState}) => (
        <View key={date}>
          <Text style={styles.title}>{date}</Text>
          <DiaryItem patientState={patientState} />
        </View>
      ))}
    </ScrollView>
  );
};

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
