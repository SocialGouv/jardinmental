import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Keyboard, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

import { INDICATORS, NEW_INDICATORS_CATEGORIES } from '../../../utils/liste_indicateurs.1';
import BackButton from '../../../components/BackButton';
import { colors } from '../../../utils/colors';
import { INDICATEURS } from '../../../utils/liste_indicateurs.1';
import Button from '../../../components/Button';
import Text from '../../../components/MyText';
import localStorage from '../../../utils/localStorage';
import logEvents from '../../../services/logEvents';
import { useFocusEffect } from '@react-navigation/native';
import { INDICATOR_CATEGORIES_DATA } from '@/scenes/onboarding-v2/data/helperData';
import JMButton from '@/components/JMButton';

const CATEGORY_OPTIONS = Object.values(NEW_INDICATORS_CATEGORIES);
// Convert enum to picker items
const categoryOptions = Object.values(NEW_INDICATORS_CATEGORIES).map((value) => ({
  label: INDICATOR_CATEGORIES_DATA[value].label, // You can also make it prettier here
  value,
}));

const CreateIndicator = ({ navigation, route }) => {
  const [nameNewIndicator, setNameNewIndicator] = useState("");
  const [userIndicateurs, setUserIndicateurs] = useState();
  const [error, setError] = useState();
  const [selectedCategory, setSelectedCategory] = useState(NEW_INDICATORS_CATEGORIES.SLEEP);

  const handleAddNewIndicator = async () => {
    const _value = nameNewIndicator?.trim();
    if (!_value) return;
    if (_value?.length === 0) {
      return;
    }

    if (userIndicateurs && userIndicateurs.some((indicateur) => indicateur.name?.toLowerCase() === _value?.toLowerCase())) return setError(true);

    if (INDICATORS.some(indicateur => indicateur.name?.toLowerCase() === _value?.toLowerCase())) return setError(true);

    // await localStorage.addCustomSymptoms(value);
    logEvents.logCustomSymptomAdd();
    navigation.push('CHOOSE_INDICATOR_TYPE', {
      nameNewIndicator: _value,
      indicatorCategory: selectedCategory
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user_indicateurs = await localStorage.getIndicateurs();
        if (user_indicateurs) {
          setUserIndicateurs(user_indicateurs);
        }
      })();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <BackButton style={styles.headerBackButton} onPress={navigation.goBack} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Créer un indicateur</Text>
        </View>
      </View>

      <View className="flex-1" style={styles.container}>
        <View className="flex-1">
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

          <View>
            <Text style={styles.label}>Selectionnez une catégorie </Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCategory(value)}
              items={categoryOptions}
              placeholder={{ label: 'Choisir une categorie', value: null }}
              value={selectedCategory}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>
        <JMButton
          disabled={!nameNewIndicator || !selectedCategory}
          buttonStyle={{ backgroundColor: colors.LIGHT_BLUE, marginBottom: 20 }}
          textStyle={{ color: 'white', textAlign: 'center' }}
          onPress={() => {
            handleAddNewIndicator();
          }}
          title="Valider"
          className='mb-5'
        />
      </View>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginTop: 25,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.BLUE,
    borderRadius: 8,
    padding: 16,
    marginVertical: 25,
  },

  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },

  headerText: {
    color: colors.BLUE,
    fontSize: 19,
    fontWeight: "700",
  },
  header: {
    height: 60,
  },
  headerBackButton: {
    position: "absolute",
    zIndex: 1,
  },
  headerTextContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  personnalizeContainer: {
    backgroundColor: "rgba(31,198,213,0.2)",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 0.5,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontWeight: "700",
    flex: 1,
    marginBottom: 5,
  },
  personnalizeText: {
    color: colors.BLUE,
    fontSize: 14,
    flex: 1,
  },

  sectionRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 30,
  },
  circleNumber: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 999,
    width: 35,
    height: 35,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  indicatorItem: {
    width: "100%",
    backgroundColor: "#F8F9FB",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E7EAF1",
    padding: 20,
    marginBottom: 12,
  },

  bottomButtonsContainer: {
    backgroundColor: "#fff",
    padding: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
  },
});
export default CreateIndicator;
