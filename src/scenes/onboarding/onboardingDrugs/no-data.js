import React from 'react';
import {StyleSheet, View} from 'react-native';

import Text from '../../../components/MyText';
import {colors} from '../../../utils/colors';
import Button from '../../../components/Button';
import localStorage from '../../../utils/localStorage';

export default ({navigation}) => {
  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    navigation.navigate('reminder', {onboarding: true});
  };

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Indiquez ici les traitements médicamenteux que vous prenez
          </Text>
          <Text style={styles.cardSubTitle}>
            Vous pourrez ainsi noter les médicaments pris chaque jour
          </Text>
          <Button
            onPress={() => navigation.navigate('onboarding-drugs-list')}
            title="Ajouter un médicament"
            buttonStyle={styles.button}
            textStyle={{fontSize: 14, fontWeight: 'normal'}}
          />
        </View>
      </View>
      <View style={styles.separator}>
        <Text style={styles.separatorText}>ou</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Je ne prends aucun traitement médicamenteux
          </Text>
          <Button
            onPress={handleNoTreatment}
            title="Continuer"
            buttonStyle={styles.button}
            textStyle={{fontSize: 14, fontWeight: 'normal'}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noTreatment: {
    color: colors.BLUE,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  separator: {
    borderTopWidth: 1,
    borderColor: '#EDEDED',
    marginVertical: 30,
    alignItems: 'center',
  },
  separatorText: {
    top: -10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    color: '#8F8F8F',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F4FCFD',
    borderColor: '#d4f0f2',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
  cardContent: {flex: 1},
  button: {width: '90%', height: 30, alignSelf: 'center'},
  cardTitle: {
    fontSize: 15,
    color: colors.DARK_BLUE,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: colors.DARK_BLUE,
    fontWeight: '300',
    marginBottom: 10,
  },
});
