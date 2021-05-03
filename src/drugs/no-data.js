import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import Button from '../common/button';
import localStorage from '../utils/localStorage';
import Icon from '../common/icon';

export default ({navigation, route}) => {
  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    navigation.navigate('tabs');
  };

  return (
    <View>
      <View style={styles.card}>
        <Icon icon="DrugsSvg" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Vous n'avez pas encore précisé de traitement
          </Text>
          <Text style={styles.cardSubTitle}>
            Ajoutez vos médicaments pour suivre vos prises
          </Text>
          <Button
            onPress={() => navigation.navigate('drugs-list')}
            title="Ajouter un médicament"
            style={styles.button}
          />
        </View>
      </View>
      <View style={styles.separator}>
        <Text style={styles.separatorText}>ou</Text>
      </View>
      <Text style={styles.noTreatment} onPress={handleNoTreatment}>
        Je n'ai aucun traitment médical
      </Text>
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
    padding: 10,
  },
  cardContent: {flex: 1},
  button: {width: '90%'},
  cardTitle: {
    fontSize: 15,
    color: colors.DARK_BLUE,
    fontWeight: '500',
    marginBottom: 10,
  },
  cardSubTitle: {
    fontSize: 14,
    color: colors.DARK_BLUE,
    fontWeight: '300',
    marginBottom: 10,
  },
});
