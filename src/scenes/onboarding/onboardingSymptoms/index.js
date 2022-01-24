import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import Text from '../../../components/MyText';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../../../utils/colors';
import {displayedCategories, categories} from '../../../utils/constants';
import localStorage from '../../../utils/localStorage';
import logEvents from '../../../services/logEvents';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import AddElemToList from '../../../components/AddElemToList';
import SurveyMenu from '../../../../assets/svg/SurveyMenu';
import Logo from '../../../../assets/svg/symptoms-setting';
import {ONBOARDING_STEPS} from '../../../utils/constants';

const SymptomScreen = ({navigation, route}) => {
  const [chosenCategories, setChosenCategories] = useState({});

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const preselectedCategories = await localStorage.getSymptoms();
      if (
        !preselectedCategories ||
        !Object.keys(preselectedCategories).length
      ) {
        return init();
      }

      const customSymptoms = await localStorage.getCustomSymptoms();
      let selected = {};
      Object.keys(categories)
        .concat(customSymptoms)
        .forEach((cat) => {
          const [categoryName] = cat.split('_');
          if (preselectedCategories[cat] === true) {
            selected[categoryName] = true;
          } else {
            selected[categoryName] = false;
          }
        });
      setChosenCategories(selected);
    })();
  }, []);

  const init = () => {
    let res = {};
    Object.keys(categories).forEach((cat) => {
      res[cat] = false;
    });
    setChosenCategories(res);
  };

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

  const nextOnboardingScreen = async () => {
    if (noneSelected()) {
      return;
    }
    navigation.navigate('onboarding-drugs');
  };

  useEffect(() => {
    (async () => await localStorage.setSymptoms(chosenCategories))();
  }, [chosenCategories]);

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
        <BackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        testID="scroll-view">
        <View style={styles.titleContainer}>
          <SurveyMenu style={styles.image} width={30} height={30} />
          <Text style={styles.title}>
            Qu'est-ce que je souhaite suivre quotidiennement ?
          </Text>
        </View>
        <Text style={styles.subtitle}>
          J'ajoute mes critères{' '}
          <Text style={styles.lightblue}>personnalisés</Text>. Cela peut-être un{' '}
          <Text style={styles.lightblue}>symptôme</Text>, un{' '}
          <Text style={styles.lightblue}>ressenti positif</Text> ou encore une{' '}
          <Text style={styles.lightblue}>activité</Text>
        </Text>

        <AddElemToList
          onChange={handleAddNewSymptom}
          placeholder="Ajouter un ressenti ou une activité"
        />
        <Text style={[styles.subtitle, styles.spaceabove]}>
          Je peux aussi en sélectionner parmi ces exemples :
        </Text>
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
                testID={'check-box-'+cat.toLowerCase()}
              />
            </View>
          ))}
        <View style={styles.buttonWrapper}>
          {noneSelected() ? (
            <Text style={[styles.alert, styles.spaceabove]}>
              Ajouter ou sélectionner au moins 1 élément
            </Text>
          ) : (
            <Text style={[styles.subtitle, styles.spaceabove]}>
              Vous pourrez modifier votre sélection ultérieurement dans les
              réglages
            </Text>
          )}
          <Button
            title="Valider"
            onPress={nextOnboardingScreen}
            disabled={noneSelected()}
            testID="validate-button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },

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
    width: 25,
    height: 25,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    marginBottom: 13,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#181818',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '300',
    textAlign: 'center',
  },
  spaceabove: {
    marginTop: 15,
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
  lightblue: {
    color: colors.LIGHT_BLUE,
  },
});

export default SymptomScreen;
