import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  View,
  Alert,
  AlertButton,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import {availableData, buildSurveyData} from '../survey/survey-data';
import {categories} from '../common/constants';
import {DiaryDataContext} from '../context';
import {isYesterday, isToday, parseISO} from 'date-fns';
import Button from '../common/button';
import logEvents from '../services/logEvents';
import {beforeToday, formatDay} from '../services/date/helpers';
import BackButton from '../components/BackButton';
import localStorage from '../utils/localStorage';
import NoData from './no-data';
import {DRUG_LIST} from '../common/drugs-list';
import RNPickerSelect from 'react-native-picker-select';
import Icon from '../common/icon';

export default ({drug, navigation, route, onChange, showPosology}) => {
  const [showFreeText, setShowFreeText] = useState(false);
  const [ƒreeText, setFreeText] = useState('');

  const handleChangeFreeText = (value) => {
    setFreeText(value);
    onChange(drug, value);
  };

  const render = () => {
    return (
      <View style={styles.posologyItem}>
        <View style={styles.left}>
          <Icon icon="DrugsSvg" />
          <View style={styles.posologyName}>
            <Text style={styles.text1}>{drug.name1}</Text>
            {drug.name2 ? <Text style={styles.text2}>{drug.name2}</Text> : null}
          </View>
        </View>
        {showPosology ? (
          showFreeText ? (
            <>
              <TextInput
                autoCapitalize="none"
                onChangeText={handleChangeFreeText}
                value={ƒreeText}
                placeholder="5 ml, 3 gouttes, ..."
                style={styles.freeText}
              />
              <Text onPress={() => setShowFreeText(false)}>x</Text>
            </>
          ) : (
            <RNPickerSelect
              onValueChange={(value) => {
                if (value === 'FREE_TEXT') return setShowFreeText(true);
                onChange(drug, value);
              }}
              placeholder={{label: 'Choisir', value: null}}
              items={[{label: 'Entrer une valeur', value: 'FREE_TEXT'}].concat(
                drug?.values.map((v) => ({label: v, value: v})),
              )}
              style={pickerSelectStyles}
            />
          )
        ) : null}
      </View>
    );
  };

  return render();
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: '#F4FCFD',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: '#F4FCFD',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  posologyItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flex: 1,
  },
  posologyName: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  text1: {
    fontSize: 15,
    color: '#000',
  },
  text2: {
    fontSize: 13,
    color: colors.DARK_BLUE,
    fontStyle: 'italic',
  },
  posologyInput: {
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: '#f00',
  },
  freeText: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: '#F4FCFD',
    borderRadius: 4,
    color: 'black',
    maxWidth: 150,
  },

  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  question: {
    color: colors.BLUE,
    fontSize: 22,
    marginBottom: 26,
    fontWeight: '700',
  },
  title: {
    color: colors.DARK_BLUE,
    fontSize: 18,
    marginBottom: 15,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  textArea: {
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});
