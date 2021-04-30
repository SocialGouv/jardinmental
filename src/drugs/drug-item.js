import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import RNPickerSelect from 'react-native-picker-select';
import Icon from '../common/icon';

export default ({drug, onChange, showPosology}) => {
  const [showFreeText, setShowFreeText] = useState(false);
  const [ƒreeText, setFreeText] = useState('');

  if (!drug) return null;

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
            <Text style={styles.text1}>{drug?.name1}</Text>
            {drug?.name2 ? (
              <Text style={styles.text2}>{drug?.name2}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.right}>
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
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => {
                  if (value === 'FREE_TEXT') return setShowFreeText(true);
                  onChange(drug, value);
                }}
                placeholder={{label: 'Choisir', value: null}}
                items={[
                  {label: 'Entrer une valeur', value: 'FREE_TEXT'},
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
    borderWidth: 1,
    borderColor: colors.LIGHT_BLUE,
    backgroundColor: '#F4FCFD',
    borderRadius: 4,
    color: 'black',
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
    color: 'black',
    // paddingRight: 30, // to ensure the text is never behind the icon
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
});
