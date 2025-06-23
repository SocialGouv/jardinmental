import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import BackButton from '../../../components/BackButton';
import {colors} from '../../../utils/colors';
import localStorage from '../../../utils/localStorage';
import {displayedCategories} from '../../../utils/constants';
import Button from '../../../components/Button';
import Text from '../../../components/MyText';
import Plus from '../../../../assets/svg/Plus';
import ArrowUpSvg from '../../../../assets/svg/arrow-up.svg';
import {INDICATEURS, INDICATEURS_LES_PLUS_COURANTS} from '../../../utils/liste_indicateurs.1';
import {toggleState} from '../../../utils';
import DangerIcon from '../../../../assets/svg/DangerIcon';
import CategorieElements from '../CategorieElements';
import {useFocusEffect} from '@react-navigation/native';
import logEvents from '../../../services/logEvents';
import TextTag from '../../../components/TextTag';
import { Button2 } from '../../../components/Button2';
import { StickyButtonContainer } from '../../onboarding/StickyButton';


const areIdenticals = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false;

  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();

  return sorted1.every((value, index) => value === sorted2[index]);
}

const EditIndicateurs = ({navigation, route}) => {
  const [exemplesVisible, setExemplesVisible] = useState(false);
  const [existingIndicatorsVisible, setExistingIndicatorsVisible] = useState(false);
  const [userIndicateurs, setUserIndicateurs] = useState([]);
  const [isChanged, setIsChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const indicateursByCategory = INDICATEURS.reduce((prev, curr) => {
    if (!prev[curr.category]) {
      prev[curr.category] = [];
    }
    prev[curr.category].push(curr);
    return prev;
  }, {});

  useEffect(() => {
    const handleIndicatorsChange = async () => {
      const savedUserIndicateurs = await localStorage.getIndicateurs();
      if (areIdenticals(savedUserIndicateurs.filter(i => i.active)
        .map(i => i.uuid), userIndicateurs.filter(i => i.active).map(i => i.uuid)
      )) {
        setIsChanged(false)
      } else {
        setIsChanged(true)
      }
    }
    handleIndicatorsChange()
    return 
  }, [userIndicateurs])

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

  const onValidate = async () => {
    setIsLoading(true)
    await localStorage.setIndicateurs(userIndicateurs);
    setIsLoading(false)
    navigation.goBack();
  }

  const reactivateIndicateur = async _indicateur => {
    const _userIndicateurs = userIndicateurs.map(indicateur => {
      if (indicateur.uuid === _indicateur.uuid) {
        indicateur.active = true;
      }
      return indicateur;
    });
    setUserIndicateurs(_userIndicateurs);
    // await localStorage.setIndicateurs(_userIndicateurs);
  };

  const handleAddNewIndicateur = async _indicateur => {
    if (!_indicateur) return;
    const _userIndicateurs = [...userIndicateurs, _indicateur];
    setUserIndicateurs(_userIndicateurs);
    logEvents.logCustomSymptomAdd();
  };

  const setToggleIndicateur = async _indicateur => {
    if (userIndicateurs.find(e => e.uuid === _indicateur.uuid)) {
      const _userIndicateurs = userIndicateurs.map(indicateur => {
        if (indicateur.uuid === _indicateur.uuid) {
          indicateur.active = !indicateur.active;
        }
        return indicateur;
      });
      setUserIndicateurs(_userIndicateurs);
    } else {
      handleAddNewIndicateur({..._indicateur, version: 1, active: true});
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton style={styles.headerBackButton} onPress={navigation.goBack} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Ajouter un indicateur</Text>
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container} keyboardDismissMode="on-drag" onScrollBeginDrag={Keyboard.dismiss}>
        <View style={styles.personnalizeContainer}>
          <View style={styles.personnalizeTextContainer}>
            <Text style={styles.personnalizeTitle}>Créez votre indicateur personnalisé</Text>
            <Text style={styles.personnalizeText}>Vous pouvez choisir la manière dont vous souhaitez l’évaluer</Text>
            <Button
              buttonStyle={{
                marginTop: 20,
                backgroundColor: 'white',
                borderColor: '#26387C',
                borderWidth: 1,
              }}
              textStyle={{color: '#26387C', textAlign: 'center'}}
              onPress={() => {
                navigation.push('CREATE_INDICATOR');
              }}
              title="Créer un indicateur"
              Icon={<Plus style={styles.plusButton} opacity={1} color={'#000'} width={19} height={19} />}
            />
          </View>
        </View>

        {exemplesVisible && (
          <View style={styles.warningContainer}>
            <DangerIcon />
            <Text style={styles.warningText}>
              Essayez de ne pas sélectionner plus de <Text style={[styles.bold, styles.warningText]}>8</Text> indicateurs{' '}
              <Text style={[styles.bold, styles.warningText]}>au total</Text>
            </Text>
          </View>
        )}

        <View
          style={{
            height: 40,
          }}
        />
        <View style={styles.divider} />

        <TouchableOpacity onPress={() => toggleState(exemplesVisible, setExemplesVisible)} style={styles.toggleContainer}>
          <Text style={styles.bold}>Choisir parmi des exemples</Text>
          {exemplesVisible ? (
            <ArrowUpSvg color={colors.BLUE} />
          ) : (
            <ArrowUpSvg
              style={{
                transform: [{rotateX: '180deg'}],
              }}
              color={colors.BLUE}
            />
          )}
        </TouchableOpacity>
        {exemplesVisible && (
          <>
            <CategorieElements title="Les plus courants" options={INDICATEURS_LES_PLUS_COURANTS} onClick={value => setToggleIndicateur(value)} userIndicateurs={userIndicateurs} />
            {Object.keys(indicateursByCategory).map(_category => {
              const _indicateurs = indicateursByCategory[_category];
              return <CategorieElements key={_category} title={_category} options={_indicateurs} onClick={value => setToggleIndicateur(value)} userIndicateurs={userIndicateurs} />;
            })}
          </>
        )}

        <View
          style={{
            height: 15,
          }}
        />
        <View style={styles.divider} />

        <TouchableOpacity onPress={() => toggleState(existingIndicatorsVisible, setExistingIndicatorsVisible)} style={styles.toggleContainer}>
          <Text style={styles.bold}>Réactiver un ancien indicateur</Text>
          {existingIndicatorsVisible ? (
            <ArrowUpSvg color={colors.BLUE} />
          ) : (
            <ArrowUpSvg
              style={{
                transform: [{rotateX: '180deg'}],
              }}
              color={colors.BLUE}
            />
          )}
        </TouchableOpacity>
        {existingIndicatorsVisible && (
          <>
            <View
              style={{
                height: 10,
              }}
            />
            <View style={styles.listContainer}>
              {userIndicateurs
                .filter(_indicateur => !_indicateur.active)
                .map((_indicateur, i) => {
                  return (
                    <TextTag
                      key={i}
                      value={_indicateur.name}
                      selected={false}
                      color="#D4F0F2"
                      onPress={() => reactivateIndicateur(_indicateur)}
                      enableAdd
                      onAdd={() => reactivateIndicateur(_indicateur)}
                    />
                  );
                })}
            </View>
          </>
        )}

        <View
          style={{
            height: 15,
          }}
        />
        <View style={styles.divider} />
        <View
          style={{
            height: 50,
          }}
        />
      </ScrollView>
      <StickyButtonContainer>
        <Button2 style={{ padding: 20 }} fill title="Enregistrer" onPress={onValidate} loading={isLoading} disabled={!isChanged} />
      </StickyButtonContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: '700',
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
    buttonContainer: {
    width: '100%',
    paddingHorizontal: 19,
    height: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
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
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  plusButton: {
    marginRight: 10,
  },

  warningContainer: {
    backgroundColor: 'rgba(254,170,90,0.1)',
    borderColor: '#FEAA5B',
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 20,
    marginTop: 20,
  },
  warningText: {
    color: colors.BLUE,
    fontSize: 17,
    flex: 1,
    marginLeft: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingEnd: 5,
    paddingBottom: 15,
    paddingTop: 15,
  },
  bottomButtonsContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
});
export default EditIndicateurs;
