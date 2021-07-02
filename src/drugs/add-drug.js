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
import {colors} from '../utils/colors';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';
import BackButton from '../components/BackButton';

export default ({navigation, route}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (route?.params?.prefilledValue) setValue(route?.params?.prefilledValue);
  }, [route]);

  const handleSubmit = async () => {
    console.log('add drug', value);
    if (!value) return;

    const drug = {id: value, name1: value, values: []};

    await localStorage.addCustomDrug(drug);
    logEvents.logDrugAdd(value);
    navigation.navigate('drugs-list', {newDrug: drug});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView style={[styles.container, {flex: 1}]}>
        <Text style={styles.title}>
          Noter le traitement que vous souhaitez suivre
        </Text>
        <Text style={styles.subtitle}>
          Vous pouvez ajouter autant de traitements que vous le souhaitez
        </Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setValue}
          value={value}
          placeholder="Renseignez le nouveau symptôme"
          style={styles.input}
        />
      </ScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleSubmit}
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
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginVertical: '10%',
    padding: 10,
    shadowColor: '#0A215C',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
