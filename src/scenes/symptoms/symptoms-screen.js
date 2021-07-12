import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import Text from '../../components/MyText';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../../utils/colors';
import {buildSurveyData} from '../survey/survey-data';
import SymptomsExplanation from '../symptoms/symptoms-explanation';
import {displayedCategories} from '../../utils/constants';
import localStorage from '../../utils/localStorage';
import logEvents from '../../services/logEvents';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import AddElemToList from '../../components/AddElemToList';

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

  useEffect(() => {
    (async () => {
      const symptoms = await localStorage.getSymptoms();
      if (symptoms) {
        setChosenCategories(symptoms);
        setInitialCategories(symptoms);
      } else {
        checkAll();
      }
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

  const handleAddNewSymptom = async (value) => {
    if (!value) return;
    if (value in chosenCategories) return;
    await localStorage.addCustomSymptoms(value);
    setChosenCategories({[value]: true, ...chosenCategories});
    logEvents.logCustomSymptomAdd();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={() => navigation.navigate('tabs')} />
        <TouchableOpacity onPress={submitNewCategories}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          Sélectionner les symptômes
          {showExplanation ? ' que vous souhaitez suivre' : ''}
        </Text>
        <AddElemToList onChange={handleAddNewSymptom} />
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
        <View style={styles.buttonWrapper}>
          <Button
            title="Valider"
            onPress={submitNewCategories}
            disabled={noneSelected()}
          />
        </View>
      </ScrollView>
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
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 35,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingBottom: 80,
  },

  ValidationButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
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
    borderWidth: 0.5,
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
    fontSize: 17,
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
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    backgroundColor: 'white',
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
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
  },
  okButtonText: {
    marginTop: 20,
    marginRight: 20,
    fontWeight: 'bold',
    color: colors.BLUE,
  },
});

export default SymptomScreen;
