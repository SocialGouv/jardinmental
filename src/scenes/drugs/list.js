import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import Button from '../../components/Button';
import localStorage from '../../utils/localStorage';
import {getDrugListWithLocalStorage} from '../../utils/drugs-list';
import CheckBox from '@react-native-community/checkbox';
import NPS from '../../services/NPS/NPS';
import BackButton from '../../components/BackButton';
import AddElemToList from '../../components/AddElemToList';

const Drugs = ({navigation, route}) => {
  const [treatment, setTreatment] = useState([]);
  const [filter, setFilter] = useState();
  const [list, setList] = useState();
  const [filteredList, setFilteredList] = useState();
  const [NPSvisible, setNPSvisible] = useState(false);

  useEffect(() => {
    (async () => {
      const treatmentStorage = await localStorage.getMedicalTreatment();
      if (treatmentStorage) {
        setTreatment(treatmentStorage);
      }
    })();
  }, []);

  const cleanString = (s) => {
    let r = s
      ?.replace(/\s*/g, '')
      .replace(/é/g, 'e')
      .replace(/è/g, 'e')
      .replace(/(\(|\)|\||\^|\$)/g, '\\$1')
      .toLowerCase();
    return r;
  };

  useEffect(() => {
    (async () => {
      const l = await getDrugListWithLocalStorage();
      setList(l);
    })();
  }, []);

  useEffect(() => {
    const newDrug = route?.params?.newDrug;
    if (newDrug) {
      setList((l) => [newDrug, ...l]);
    }
  }, [route]);

  useEffect(() => {
    setFilteredList(filterAndSortList(list));
  }, [filter, list]);

  const filterAndSortList = (list) =>
    list
      ?.sort((a, b) => cleanString(a.name1) > cleanString(b.name1))
      .filter((e) => {
        const r = new RegExp(cleanString(filter), 'gi');
        return r.test(cleanString(e.id));
      });

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

  const handleAdd = async (value) => {
    console.log('add drug', value);
    if (!value) return;
    const drug = {id: value, name1: value, values: []};
    await localStorage.addCustomDrug(drug);
    const drugsAfterAddition = await getDrugListWithLocalStorage();
    setFilteredList(filterAndSortList(drugsAfterAddition));
    setToogleCheckbox(drug, true);
    // logEvents.logDrugAdd(value);
    // navigation.navigate('drugs-list', {newDrug: drug});
  };

  const handleFilter = (f) => setFilter(f);
  const closeNPS = () => setNPSvisible(false);

  return (
    <SafeAreaView style={styles.safe}>
      <NPS forceView={NPSvisible} close={closeNPS} page={3} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <BackButton onPress={navigation.goBack} />
        <TextInput
          autoCapitalize="none"
          onChangeText={handleFilter}
          value={filter}
          placeholder="Rechercher un traitement"
          placeholderTextColor="#a3a3a3"
          style={styles.filter}
        />
      </View>
      <ScrollView style={styles.container}>
        {!filteredList ? (
          <Text>Chargement</Text>
        ) : (
          <>
            <AddElemToList
              onChange={handleAdd}
              onChangeText={handleFilter}
              styleContainer={{marginHorizontal: 10}}
            />
            {filteredList?.map((e, index) => (
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
                  {e.name2 ? (
                    <Text style={styles.text2}>({e.name2})</Text>
                  ) : null}
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
          </>
        )}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button onPress={submit} title="Valider" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  labelAddDrug: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  plusIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    margin: -10,
    marginRight: 10,
  },
  addDrug: {
    backgroundColor: colors.LIGHT_BLUE,
    color: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0A215C',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  filter: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
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
    position: 'absolute',
    bottom: 20,
    left: 10,
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
