import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

const Calendar = () => (
  <ScrollView style={styles.container}>
    <Text>Calendrier</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
});

export default Calendar;
