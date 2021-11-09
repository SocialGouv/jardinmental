import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, SafeAreaView} from 'react-native';
import Text from '../../components/MyText';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../../utils/colors';
import SymptomsExplanation from '../symptoms/symptoms-explanation';
import {
  displayedCategories,
  categories,
  reliquatCategories,
} from '../../utils/constants';
import localStorage from '../../utils/localStorage';
import logEvents from '../../services/logEvents';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import AddElemToList from '../../components/AddElemToList';

const SymptomScreen = ({navigation, route}) => {
  const explanation =
    "A tout moment, vous pourrez modifier cette liste d'éléments que vous souhaitez suivre via l’onglet “Réglages” situé en haut à droite du journal";
  const [chosenCategories, setChosenCategories] = useState({});

  useEffect(() => {
    (async () => {
      const preselectedCategories = await localStorage.getSymptoms();
      if (!Object.keys(preselectedCategories).length) {
        return checkAll();
      }

      const customSymptoms = await localStorage.getCustomSymptoms();
      let selected = {};
      Object.keys(categories)
        .concat(...Object.keys(reliquatCategories))
        .concat(customSymptoms)
        .forEach((cat) => {
          const [categoryName] = cat.split('_');
          // select it if we add it to the list (old and new version)
          // cat is the full name (SYMPTOM_FREQUENCE)
          // categoryName is the new format (SYMPTOM)
          selected[categoryName] =
            preselectedCategories[cat] || preselectedCategories[categoryName];
        });
      setChosenCategories(selected);
    })();
  }, []);

  const checkAll = () => {
    let res = {};
    Object.keys(categories).forEach((cat) => {
      res[cat] = true;
    });
    setChosenCategories(res);
  };

  const showExplanation = route.params?.showExplanation || false;

  const setToogleCheckbox = (cat, value) => {
    let res = {...chosenCategories};
    res[cat] = value;
    setChosenCategories(res);
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

  const goToFirstQuestion = async () => {
    if (noneSelected()) {
      return;
    }
    await localStorage.setSymptoms(chosenCategories);
    let redirection = 'tabs';
    let params = {};

    if (route.params?.onboarding) {
      redirection = 'drugs';
      params = {onboarding: true};
    } else if (route.params?.redirect === 'select-day') {
      redirection = 'select-day';
    } else if (route.params?.redirect) {
      redirection = 'day-survey';
      params = {
        currentSurvey: {
          date: route.params?.date,
          answers: {},
        },
      };
    }

    navigation.navigate(redirection, params);
  };

  useEffect(() => {
    // we do not save on the fly if it is the first time the user see the symptoms screen
    if (showExplanation) return;
    (async () => await localStorage.setSymptoms(chosenCategories))();
  }, [chosenCategories, showExplanation]);

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
        <BackButton
          disabled={noneSelected()}
          onPress={() => navigation.navigate('tabs')}
        />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          Que souhaitez-vous suivre quotidiennement ?
        </Text>
        <Text style={styles.subtitle}>
          Cela peut être un ressenti positif ou négatif ou une activité
        </Text>
        {noneSelected() ? (
          <Text style={styles.alert}>
            Ajouter ou sélectionner au moins 1 élément
          </Text>
        ) : null}
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
                // for android
                tintColors={{true: colors.LIGHT_BLUE, false: '#aaa'}}
                // for ios
                tintColor="#aaa"
                onCheckColor={colors.LIGHT_BLUE}
                onTintColor={colors.LIGHT_BLUE}
                onAnimationType="bounce"
                offAnimationType="bounce"
              />
            </View>
          ))}
        {showExplanation ? (
          <View style={styles.buttonWrapper}>
            <Button
              title="Valider"
              onPress={goToFirstQuestion}
              disabled={noneSelected()}
            />
          </View>
        ) : null}
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
    marginBottom: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.LIGHT_BLUE,
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '300',
    textAlign: 'center',
  },
  alert: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '500',
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
