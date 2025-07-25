import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '../../components/BackButton';
import { colors } from '../../utils/colors';
import localStorage from '../../utils/localStorage';
import logEvents from '../../services/logEvents';
import { ONBOARDING_STEPS, categories, displayedCategories, reliquatCategories } from '../../utils/constants';
import Button from '../../components/Button';
import Text from '../../components/MyText';
import HeartBubble from '../../../assets/svg/HeartBubble';
import { useFocusEffect } from '@react-navigation/native';
import { Button2 } from '../../components/Button2';
import { Card } from '../../components/Card';
import JMButton from '@/components/JMButton'

const CustomSymptomScreen = ({ navigation, route, settings = false }) => {
  const [chosenCategories, setChosenCategories] = useState();
  const [userIndicateurs, setUserIndicateurs] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     const preselectedCategories = await localStorage.getSymptoms();
  //     if (!preselectedCategories || !Object.keys(preselectedCategories).length) {
  //       return;
  //     }

  //     const customSymptoms = await localStorage.getCustomSymptoms();
  //     let selected = {};
  //     Object.keys(categories)
  //       .concat(...Object.keys(reliquatCategories))
  //       .concat(customSymptoms)
  //       .concat(...Object.keys(INDICATEURS))
  //       .forEach((cat) => {
  //         const [categoryName] = cat.split("_");
  //         // select it if we add it to the list (old and new version)
  //         // cat is the full name (SYMPTOM_FREQUENCE)
  //         // categoryName is the new format (SYMPTOM)
  //         if (
  //           Object.keys(preselectedCategories).includes(cat) ||
  //           Object.keys(preselectedCategories).includes(categoryName)
  //         ) {
  //           selected[categoryName] = preselectedCategories[cat] || preselectedCategories[categoryName];
  //         }
  //       });
  //     setChosenCategories(selected);
  //   })();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        // console.log("✍️ ~ user_indicateurs", JSON.stringify(user_indicateurs, null, 2));
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, []),
  );

  useEffect(() => {
    (async () => {
      !settings && (await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS_CUSTOM));
    })();
  }, [settings]);

  useEffect(() => {
    if (!chosenCategories || chosenCategories === undefined) return;
    (async () => {
      const isCustom = e => !displayedCategories[e] && !Object.keys(INDICATEURS).includes(e);
      const isDefault = e => !!displayedCategories[e] || Object.keys(INDICATEURS).includes(e);

      const customSymptomsKeys = Object.keys(chosenCategories).filter(isCustom);
      const defaultSymptomsKeys = Object.keys(chosenCategories).filter(isDefault);

      let customSymptoms = {};
      customSymptomsKeys.forEach(e => (customSymptoms[e] = chosenCategories[e]));
      await localStorage.setCustomSymptoms(customSymptomsKeys);

      let defaultSymptoms = {};
      defaultSymptomsKeys.forEach(e => (defaultSymptoms[e] = chosenCategories[e]));
      await localStorage.setSymptoms(chosenCategories);
    })();
  }, [chosenCategories]);

  const handleAddNewSymptom = async value => {
    if (!value) return;
    await localStorage.addCustomSymptoms(value);
    setChosenCategories(prev => ({ ...prev, [value]: true }));
    logEvents.logCustomSymptomAdd();
  };

  const setToggleIndicateur = ({ indicateur, valeur }) => {
    setChosenCategories(prev => ({ ...prev, [indicateur]: valeur }));
  };

  const removeSymptom = async value => setChosenCategories({ ...chosenCategories, [value]: false });

  const indicators = Object.keys(chosenCategories || {}).filter(e => chosenCategories[e]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton style={styles.headerBackButton} onPress={navigation.goBack} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Mon questionnaire</Text>
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container} keyboardDismissMode="on-drag" onScrollBeginDrag={Keyboard.dismiss}>
        <Card
          title="Personnaliser mon questionnaire"
          text="Gérez vos indicateurs, ajoutez-en de nouveaux et choisissez la manière dont vous les évaluez !"
          image={{ source: require('./../../../assets/imgs/indicateur.png') }}
        />
        <View style={styles.sectionRowContainer}>
          <View>
            <Text style={styles.headerText}>Mes indicateurs</Text>
          </View>
          <View style={styles.circleNumber}>
            <Text style={styles.circleText}>{userIndicateurs.filter(_indicateur => _indicateur.active).length}</Text>
          </View>
        </View>
        <View>
          {userIndicateurs
            .filter(_indicateur => _indicateur.active)
            .map(_indicateur => {
              return (
                <View key={_indicateur.uuid} style={styles.indicatorItem}>
                  <Text>{_indicateur.name}</Text>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View style={styles.bottomButtonsContainer}>
        <JMButton
          variant='primary'
          className='mb-2'
          size="medium"
          onPress={() => navigation.navigate('EDIT_INDICATOR')}
          title="Ajouter un indicateur"
        />
        <JMButton
          variant='outline'
          onPress={() => navigation.navigate('indicators-settings-more')}
          title="Modifier mon questionnaire"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  headerText: {
    color: colors.BLUE,
    fontSize: 19,
    fontWeight: '700',
  },
  header: {
    height: 60,
  },
  headerBackButton: {
    position: 'absolute',
    zIndex: 1,
  },
  headerTextContainer: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personnalizeContainer: {
    backgroundColor: 'rgba(31,198,213,0.2)',
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 0.5,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 20,
  },
  personnalizeTextContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  personnalizeTitle: {
    color: colors.BLUE,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginBottom: 5,
  },
  personnalizeText: {
    color: colors.BLUE,
    fontSize: 14,
    flex: 1,
  },

  sectionRowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 30,
  },
  circleNumber: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 999,
    width: 35,
    height: 35,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  indicatorItem: {
    width: '100%',
    backgroundColor: '#F8F9FB',
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E7EAF1',
    padding: 20,
    marginBottom: 12,
  },

  bottomButtonsContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
});
export default CustomSymptomScreen;
