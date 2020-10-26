import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

const Survey = () => (
  <ScrollView style={styles.container}>
    <Text>Questionnaire</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
});

export default Survey;
