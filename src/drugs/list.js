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
import logEvents from '../services/logEvents';
import NPS from '../services/NPS/NPS';

const Drugs = ({navigation}) => {
  const [treatment, setTreatment] = useState([]);
  const [filter, setFilter] = useState();
  const [list, setList] = useState(null);
  const [NPSvisible, setNPSvisible] = useState(false);

  useEffect(() => {
    (async () => {
      const treatmentStorage = await localStorage.getMedicalTreatment();
      if (treatmentStorage) {
        setTreatment(treatmentStorage);
      }
    })();
  }, []);

  useEffect(() => {
    setList(
      DRUG_LIST.sort((a, b) => a.name1 > b.name1).filter((e) => {
        const r = new RegExp(filter, 'gi');
        return r.test(e.id);
      }),
    );
  }, [filter]);

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

  const handleFilter = (f) => setFilter(f);
  const onPressContribute = () => setNPSvisible(true);
  const closeNPS = () => setNPSvisible(false);

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={closeNPS} page={3} />
      <TextInput
        autoCapitalize="none"
        onChangeText={handleFilter}
        value={filter}
        placeholder="Rechercher un traitement"
        style={styles.filter}
      />
      <ScrollView style={styles.container}>
        {!list ? <Text>Chargement</Text> : null}
        {list?.map((e, index) => (
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
        {list?.length === 0 ? (
          <Text
            style={styles.notFound}
            onPress={() => {
              logEvents.logTreatmentNotFound(filter);
              onPressContribute();
            }}>
            Je ne trouve pas mon traitement
          </Text>
        ) : null}
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
  notFound: {
    color: colors.BLUE,
    textDecorationLine: 'underline',
    fontWeight: '600',
    padding: 30,
  },
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
