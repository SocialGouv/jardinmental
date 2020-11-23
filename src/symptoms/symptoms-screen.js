import React, {useContext, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../common/colors';
import CircledIcon from '../common/circled-icon';
import {buildSurveyData} from '../survey/survey-data';
import SymptomsExplanation from '../symptoms/symptoms-explanation';
import {DiaryDataContext} from '../context';
import {beforeToday, formatDay} from '../services/date/helpers';
import {isYesterday, parseISO} from 'date-fns';
import {displayedCategories, categories, icons} from '../common/constants';
import localStorage from '../utils/localStorage';

const SymptomScreen = ({navigation, route}) => {
  const explanation =
    'A tout moment, vous pourrez modifier la liste des symptômes que vous souhaitez suivre via l’onglet “Réglages” situé en haut à droite du journal';
  const [chosenCategories, setChosenCategories] = useState({});

  useEffect(() => {
    (async () => {
      const symptoms = await localStorage.getSymptoms();
      if (symptoms) setChosenCategories(symptoms);
      else checkAll();
    })();
  }, []);

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
  };

  const noneSelected = () => {
    let empty = true;
    Object.keys(chosenCategories).forEach((cat) => {
      chosenCategories[cat] && (empty = false);
    });
    return empty;
  };

  const submitNewCategories = async () => {
    if (noneSelected()) return;
    await localStorage.setSymptoms(chosenCategories);
    const questions = await buildSurveyData();
    const index = questions[1];
    let redirection = 'tabs';
    let params = {};

    if (route.params?.redirect === '0') {
      redirection = 'question-0';
    } else if (route.params?.redirect) {
      redirection = `question-${index}`;
      params = {
        currentSurvey: {
          date: route.params?.date,
          answers: {},
        },
      };
    }

    navigation.navigate(redirection, params);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {!showExplanation && (
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.navigate('tabs')}>
          <Text style={styles.backButton}>Retour</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={[styles.container, {flex: 1}]}>
        <Text style={styles.title}>
          Sélectionner les symptômes
          {showExplanation ? ' que vous souhaitez suivre' : ''}
        </Text>
        {chosenCategories &&
          Object.keys(chosenCategories).map((cat, index) => (
            <View key={index} style={styles.categories}>
              <Text style={styles.label}>{displayedCategories[cat]}</Text>
              <CheckBox
                animationDuration={0.2}
                boxType="square"
                style={styles.checkbox}
                value={chosenCategories[cat]}
                onValueChange={(newValue) => setToogleCheckbox(cat, newValue)}
              />
            </View>
          ))}
        {showExplanation && (
          <TouchableOpacity>
            <Text
              style={styles.backButton}
              onPress={() => navigation.navigate('tabs')}>
              Retour
            </Text>
          </TouchableOpacity>
        )}
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
  textInput: {
    fontSize: 20,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});

export default SymptomScreen;
