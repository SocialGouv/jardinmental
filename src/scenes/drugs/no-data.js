import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {DiaryDataContext} from '../../context';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import Button from '../../components/Button';
import localStorage from '../../utils/localStorage';
import Icon from '../../components/Icon';
import {alertNoDataYesterday} from '../survey/survey-data';

export default ({navigation, route}) => {
  const [diaryData] = useContext(DiaryDataContext);

  const handleNoTreatment = async () => {
    await localStorage.setMedicalTreatment([]);
    alertNoDataYesterday({
      date: route?.params?.currentSurvey?.date,
      diaryData,
      navigation,
    });
    navigation.navigate('tabs');
  };

  return (
    <View>
      <View style={styles.card}>
        <Icon icon="DrugsSvg" styleContainer={{marginRight: 10}} />
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
            buttonStyle={styles.button}
            textStyle={{fontSize: 14, fontWeight: 'normal'}}
          />
        </View>
      </View>
      <View style={styles.separator}>
        <Text style={styles.separatorText}>ou</Text>
      </View>
      <Text style={styles.noTreatment} onPress={handleNoTreatment}>
        Je n'ai aucun traitement médical
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
  button: {width: '90%', height: 30},
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
