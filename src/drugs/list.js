import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import Button from '../common/button';
import localStorage from '../utils/localStorage';
import {DRUG_LIST} from '../utils/drugs-list';
import CheckBox from '@react-native-community/checkbox';

const Drugs = ({navigation, route}) => {
  const [treatment, setTreatment] = useState([]);
  const [filter, setFilter] = useState();

  useEffect(() => {
    (async () => {
      const treatmentStorage = await localStorage.getMedicalTreatment();
      if (treatmentStorage) {
        setTreatment(treatmentStorage);
      }
    })();
  }, []);

  const setToogleCheckbox = (d, value) => {
    let t = [...treatment];
    if (!value) {
      const elem = treatment.find((elem) => elem.id === d.id);
      const i = treatment.indexOf(elem);
      t.splice(i, 1);
    } else {
      t.push({id: d.id});
    }
    setTreatment(t);
  };

  const submit = async () => {
    await localStorage.setMedicalTreatment(treatment);
    navigation.navigate('drugs', {treatment});
  };

  const handleFilter = (f) => {
    setFilter(f);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TextInput
        autoCapitalize="none"
        onChangeText={handleFilter}
        value={filter}
        placeholder="Rechercher un traitement"
        style={styles.filter}
      />
      <ScrollView style={styles.container}>
        {DRUG_LIST.sort((a, b) => a.name1 > b.name1)
          .filter((e) => {
            const r = new RegExp(filter, 'gi');
            return r.test(e.id);
          })
          .map((e, index) => (
            <View
              key={index}
              style={[
                styles.drug,
                {
                  backgroundColor: treatment.find((x) => x.id === e.id)
                    ? 'white'
                    : '#26387c12',
                },
              ]}>
              <View style={styles.item}>
                <Text style={styles.text1}>{e.name1}</Text>
                {e.name2 ? <Text style={styles.text2}>({e.name2})</Text> : null}
              </View>
              <CheckBox
                animationDuration={0.2}
                boxType="square"
                style={styles.checkbox}
                value={!!treatment.find((x) => x.id === e.id)}
                onValueChange={(newValue) => setToogleCheckbox(e, newValue)}
              />
            </View>
          ))}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.backButton}
          onPress={navigation.goBack}
          title="Retour"
          buttonColor="#fff"
          textColor={colors.DARK_BLUE}
        />
        <Button onPress={submit} title="Valider" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filter: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    backgroundColor: '#fff',
    color: 'black',
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: 'white',
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    width: '20%',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  drug: {
    backgroundColor: '#26387c12',
    borderColor: '#D4F0F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text1: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  text2: {
    color: colors.BLUE,
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  checkbox: {
    marginHorizontal: 10,
  },
});

export default Drugs;
