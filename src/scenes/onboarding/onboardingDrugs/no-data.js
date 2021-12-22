import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import Text from '../../../components/MyText';
import {colors} from '../../../utils/colors';
import Button from '../../../components/Button';
import localStorage from '../../../utils/localStorage';

export default ({navigation}) => {
  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    navigation.navigate('reminder', {onboarding: true});
  };
  const handleDrugInformation = async () => {
    navigation.navigate('onboarding-drugs-information', {onboarding: true});
  };

  return (
    <View>
      <Text style={styles.subtitle}>
        Je suis chaque jour mes <Text style={styles.lightblue}>prises</Text> de{' '}
        <Text style={styles.lightblue}>traitement</Text>, cela me permet de{' '}
        <Text style={styles.lightblue}>comprendre</Text> comment il influe mon{' '}
        <Text style={styles.lightblue}>état</Text>
      </Text>
      <Button
        onPress={() => navigation.navigate('onboarding-drugs-list')}
        title="Ajouter un traitement"
        buttonStyle={styles.button}
        textStyle={{fontSize: 14, fontWeight: 'bold'}}
      />
      <TouchableOpacity onPress={handleDrugInformation}>
        <Text style={styles.link}>Informations sur les traitements</Text>
      </TouchableOpacity>

      <Button
        onPress={handleNoTreatment}
        title="Je ne prends pas de traitement"
        buttonStyle={styles.darkButton}
        textStyle={{fontSize: 14, fontWeight: 'bold'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {marginTop: 40, height: 60, alignSelf: 'center'},
  darkButton: {
    marginTop: 40,
    backgroundColor: colors.DARK_BLUE,
    height: 60,
    alignSelf: 'center',
  },
  subtitle: {
    color: colors.DARK_BLUE,
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '300',
    textAlign: 'center',
  },
  link: {
    color: '#181818',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '300',
    textAlign: 'center',
  },
  lightblue: {
    color: colors.LIGHT_BLUE,
  },
});
