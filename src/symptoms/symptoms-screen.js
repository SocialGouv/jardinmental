import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../common/colors';
import {buildSurveyData} from '../survey/survey-data';
import SymptomsExplanation from '../symptoms/symptoms-explanation';
import {displayedCategories} from '../common/constants';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';
import BackButton from '../components/BackButton';

const lookUpCategoryMatomo = {
  MOOD: 0,
  ANXIETY_FREQUENCE: 1,
  BADTHOUGHTS_FREQUENCE: 2,
  SLEEP: 3,
  SENSATIONS_FREQUENCE: 4,
};

const SymptomScreen = ({navigation, route}) => {
  const explanation =
    'A tout moment, vous pourrez modifier la liste des symptômes que vous souhaitez suivre via l’onglet “Réglages” situé en haut à droite du journal';
  const [chosenCategories, setChosenCategories] = useState({});
  const [initalCategories, setInitialCategories] = useState({});
  const [customSymptoms, setCustomSymptoms] = useState([]);

  useEffect(() => {
    (async () => {
      const symptoms = await localStorage.getSymptoms();
      if (symptoms) {
        setChosenCategories(symptoms);
        setInitialCategories(symptoms);
      } else {
        checkAll();
      }
      const localCustomSymptoms = await localStorage.getCustomSymptoms();
      if (localCustomSymptoms) setCustomSymptoms(localCustomSymptoms);
    })();
  }, []);

  useEffect(() => {
    const newSymptom = route.params?.newSymptom;
    if (newSymptom) {
      setCustomSymptoms([newSymptom, ...customSymptoms]);
      setChosenCategories({[newSymptom]: true, ...chosenCategories});
    }
  }, [route]);

  const checkAll = () => {
    let categories = {};
    Object.keys(displayedCategories).forEach((cat) => {
      categories[cat] = true;
    });
    setChosenCategories(categories);
  };

  const showExplanation = route.params?.showExplanation || false;

  const setToogleCheckbox = (cat, value) => {
    let categories = {...chosenCategories};
    categories[cat] = value;
    setChosenCategories(categories);
    // if (value) {
    //   logEvents.logSymptomAdd(cat);
    // } else {
    //   logEvents.logSymptomCancel(cat);
    // }
  };

  const noneSelected = () => {
    let empty = true;
    Object.keys(chosenCategories).forEach((cat) => {
      chosenCategories[cat] && (empty = false);
    });
    return empty;
  };

  const submitNewCategories = async () => {
    if (noneSelected()) {
      return;
    }
    await localStorage.setSymptoms(chosenCategories);
    const questions = await buildSurveyData();
    console.log({chosenCategories});
    console.log({initalCategories});
    Object.keys(chosenCategories).forEach((cat) => {
      if (initalCategories[cat] !== chosenCategories[cat]) console.log(cat);
    });
    // console.log(questions);
    // questions.forEach((q) => {
    //   ma;
    // });
    const index = questions[0];
    let redirection = 'tabs';
    let params = {};

    if (route.params?.redirect === '0') {
      redirection = 'question';
      params = {index: 0};
    } else if (route.params?.redirect) {
      redirection = 'question';
      params = {
        currentSurvey: {
          date: route.params?.date,
          answers: {},
        },
        index,
      };
    }

    navigation.navigate(redirection, params);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={() => navigation.navigate('tabs')} />
      <ScrollView style={[styles.container, {flex: 1, paddingBottom: 100}]}>
        <Text style={styles.title}>
          Sélectionner les symptômes
          {showExplanation ? ' que vous souhaitez suivre' : ''}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('add-symptom')}>
          <View style={styles.addSymptom}>
            <Text style={styles.labelAddSymptom}>Ajouter un symptôme</Text>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        </TouchableOpacity>
        {chosenCategories &&
          Object.keys(chosenCategories).map((cat, index) => (
            <View key={index} style={styles.categories}>
              <Text style={styles.label}>
                {displayedCategories[cat] || cat}
              </Text>
              <CheckBox
                animationDuration={0.2}
                boxType="square"
                style={styles.checkbox}
                value={chosenCategories[cat]}
                onValueChange={(newValue) => setToogleCheckbox(cat, newValue)}
              />
            </View>
          ))}
      </ScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={submitNewCategories}
          style={styles.ValidationButton}>
          <Text style={styles.ValidationButtonText}>Valider</Text>
        </TouchableOpacity>
      </View>
      {showExplanation && (
        <SymptomsExplanation
          explanation={explanation}
          category={'Informations'}
        />
      )}
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
    margin: -10,
    marginRight: 10,
  },
  addSymptom: {
    backgroundColor: colors.LIGHT_BLUE,
    color: '#fff',
    marginBottom: 20,
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
});

export default SymptomScreen;
