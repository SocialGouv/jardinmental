import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, View, Platform} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../utils/colors';
import RNPickerSelect from 'react-native-picker-select';
import Icon from '../components/Icon';

export default ({drug, onChange, showPosology}) => {
  const [showFreeText, setShowFreeText] = useState(false);
  const [freeText, setFreeText] = useState('');

  if (!drug) return null;
  useEffect(() => {
    setShowFreeText(drug?.isFreeText);
    setFreeText(drug?.value);
  }, [drug]);

  const handleChangeFreeText = (value) => {
    setFreeText(value);
    onChange(drug, value, showFreeText);
  };

  const render = () => {
    return (
      <View style={styles.posologyItem}>
        <View style={styles.left}>
          <Icon icon="DrugsSvg" styleContainer={{marginRight: 10}} />
          <View style={styles.posologyName}>
            <Text style={styles.text1}>{drug?.name1}</Text>
            {drug?.name2 ? (
              <Text style={styles.text2}>{drug?.name2}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.right}>
          {showPosology ? (
            showFreeText ? (
              <View style={styles.freeTextContainer}>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={handleChangeFreeText}
                  value={freeText}
                  placeholder="5 ml, 3 gouttes, ..."
                  style={styles.freeText}
                />
                <Text
                  style={styles.close}
                  onPress={() => setShowFreeText(false)}>
                  X
                </Text>
              </View>
            ) : (
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => {
                  if (value === 'FREE_TEXT') return setShowFreeText(true);
                  onChange(drug, value);
                }}
                placeholder={{label: 'Choisir', value: null}}
                items={[
                  {label: 'Entrer une valeur', value: 'FREE_TEXT'},
                  {label: '0', value: '0'},
                ].concat(drug?.values.map((v) => ({label: v, value: v})))}
                style={pickerSelectStyles}
                value={drug?.value}
              />
            )
          ) : null}
        </View>
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
    borderWidth: 0.5,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: '#F4FCFD',
    borderRadius: 8,
    color: colors.DARK_BLUE,
    minWidth: '100%',
    textAlign: 'center',
    // padding: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: '#F4FCFD',
    borderRadius: 8,
    color: colors.DARK_BLUE,
    minWidth: '100%',
    textAlign: 'center',
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  close: {
    fontSize: 16,
    color: colors.LIGHT_BLUE,
    marginLeft: 5,
    padding: 0,
  },
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
    flex: 1,
  },
  left: {
    flex: 2,
    // paddingRight: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  right: {
    flex: 1,
    // paddingRight: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  freeTextContainer: {
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: '#F4FCFD',
    borderRadius: 8,
    color: colors.DARK_BLUE,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeText: {
    fontSize: 16,
    borderRadius: 4,
    color: colors.DARK_BLUE,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    padding: 0,
  },
});
