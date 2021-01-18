import React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Button from '../common/button';
import {colors} from '../common/colors';
import {formatDay} from '../services/date/helpers';
import matomo from '../services/matomo';
import localStorage from '../utils/localStorage';

const ContributeItem = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>Contribuer à Mon Suivi Psy</Text>
        <Text style={styles.message}>
          Partagez-nous comment améliorer l'application{' '}
          <Text style={styles.muted}>(Nous lisons tous les messages)</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(31, 198, 213, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F4FCFD',
    marginBottom: 20,
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    color: colors.BLUE,
  },
  message: {
    marginVertical: 10,
    color: colors.BLUE,
  },
  muted: {
    fontSize: 12,
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default ContributeItem;
