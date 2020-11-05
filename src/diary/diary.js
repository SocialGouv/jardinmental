import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import DiaryItem from './diary-item';
import Header from '../common/header';
import {useDiaryData} from '../hooks/useDiaryData';
import {colors} from '../common/colors';

const Diary = ({navigation}) => {
  const diaryData = useDiaryData();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Header>Mon journal</Header>
          <TouchableOpacity
            onPress={() => navigation.navigate('reminder')}
            // @TODO create settings screen instead of directly go to reminder
          >
            <Text style={styles.settings}>Rappel</Text>
          </TouchableOpacity>
        </View>
        {diaryData.map(({date, patientState}) => (
          <View key={date}>
            <Text style={styles.title}>{date}</Text>
            <DiaryItem patientState={patientState} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
  },
  settings: {
    fontSize: 13,
    color: colors.BLUE,
  },
  title: {
    fontSize: 19,
    paddingBottom: 10,
    color: colors.BLUE,
    fontWeight: '700',
  },
});

export default Diary;
