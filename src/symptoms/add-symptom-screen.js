import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Text from '../components/MyText';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../utils/colors';
import {buildSurveyData} from '../survey/survey-data';
import SymptomsExplanation from './symptoms-explanation';
import {displayedCategories} from '../utils/constants';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';
import PlusSvg from '../../assets/svg/plus.svg';
import BackButton from '../components/BackButton';

const AddSymptomScreen = ({navigation, route}) => {
  const [value, setValue] = useState('');
  // useEffect(() => {
  //   (async () => {
  //     const symptoms = await localStorage.getSymptoms();
  //     if (symptoms) {
  //       setChosenCategories(symptoms);
  //     } else {
  //       checkAll();
  //     }
  //   })();
  // }, []);

  const handleAddNewSymptom = async () => {
    console.log('add', value);
    if (!value) return;
    await localStorage.addCustomSymptoms(value);
    logEvents.logCustomSymptomAdd();
    navigation.navigate('symptoms', {newSymptom: value});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView style={[styles.container, {flex: 1}]}>
        <Text style={styles.title}>
          Noter le symptôme que vous souhaitez suivre
        </Text>
        <Text style={styles.subtitle}>
          Vous pouvez ajouter autant de symptômes que vous le souhaitez
        </Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setValue}
          value={value}
          placeholder="Renseignez le nouveau symptôme"
          style={styles.inputMail}
        />
      </ScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleAddNewSymptom}
          style={styles.ValidationButton}>
          <Text style={styles.ValidationButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  checkbox: {
    marginHorizontal: 10,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    marginBottom: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.BLUE,
    fontSize: 16,
    marginBottom: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  categories: {
    backgroundColor: '#F4FCFD',
    borderColor: '#D4F0F2',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 20,
    fontWeight: '600',
  },
  labelAddSymptom: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  plusIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
  },
  addSymptom: {
    backgroundColor: colors.LIGHT_BLUE,
    color: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginTop: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  textInput: {
    fontSize: 20,
  },
  inputMail: {
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginVertical: '10%',
    padding: 10,
  },
});

export default AddSymptomScreen;
