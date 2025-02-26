import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Keyboard, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import BackButton from '../../../components/BackButton';
import {colors} from '../../../utils/colors';
import {INDICATEURS} from '../../../utils/liste_indicateurs.1.js';
import Button from '../../../components/Button';
import Text from '../../../components/MyText';
import localStorage from '../../../utils/localStorage';
import logEvents from '../../../services/logEvents';
import {useFocusEffect} from '@react-navigation/native';

const CreateIndicator = ({navigation, route}) => {
  const [nameNewIndicator, setNameNewIndicator] = useState('');
  const [userIndicateurs, setUserIndicateurs] = useState();
  const [error, setError] = useState();

  const handleAddNewIndicator = async () => {
    const _value = nameNewIndicator?.trim();
    if (!_value) return;
    if (_value?.length === 0) {
      return;
    }

    if (userIndicateurs && userIndicateurs.some(indicateur => indicateur.name?.toLowerCase() === _value?.toLowerCase())) return setError(true);

    if (INDICATEURS.some(indicateur => indicateur.name?.toLowerCase() === _value?.toLowerCase())) return setError(true);

    // await localStorage.addCustomSymptoms(value);
    logEvents.logCustomSymptomAdd();
    navigation.push('CHOOSE_INDICATOR_TYPE', {nameNewIndicator: _value});
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton style={styles.headerBackButton} onPress={navigation.goBack} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Créer un indicateur</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Comment souhaitez-vous appeler votre nouvel indicateur ?</Text>

        <TextInput
          onChangeText={e => {
            setNameNewIndicator(e);
            setError(false);
          }}
          autoFocus={true}
          value={nameNewIndicator}
          placeholder={'Entrez le nom de votre indicateur'}
          placeholderTextColor="lightgrey"
          style={styles.textInput}
        />

        {error ? (
          <View className="border border-red-400 bg-red-50 rounded-lg px-3 py-2 mb-5">
            <Text className="text-gray-900">Il existe déjà un indicateur qui porte le nom "{nameNewIndicator?.trim()}".</Text>
            <Text className="text-gray-900">S'il est inactif, vous pouvez le réactiver dans la liste des "anciens indicateurs" ou depuis la liste d&apos;exemples.</Text>
          </View>
        ) : null}

        {nameNewIndicator.length > 0 && (
          <Button
            buttonStyle={{backgroundColor: '#1FC6D5', marginBottom: 20}}
            textStyle={{color: 'white', textAlign: 'center'}}
            onPress={() => {
              handleAddNewIndicator();
            }}
            title="Valider"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginTop: 25,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#26387C',
    borderRadius: 8,
    padding: 16,
    marginVertical: 25,
  },

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
    backgroundColor: '#1FC6D5',
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
export default CreateIndicator;
