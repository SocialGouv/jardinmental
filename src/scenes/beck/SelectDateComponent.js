import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../utils/colors';
import RNPickerSelect from 'react-native-picker-select';
import Icon from '../../components/Icon';

export default ({
  onChange = console.log,
  placeholder = 'Choisir',
  iconName,
  styleContainer,
  value,
  items,
}) => {
  return (
    <View style={[styles.container, styleContainer]}>
      {iconName ? (
        <View style={styles.iconLeftContainer}>
          <Icon
            icon={iconName}
            color={colors.DARK_BLUE}
            width={25}
            height={25}
          />
        </View>
      ) : null}
      <View style={styles.selectContainer}>
        <RNPickerSelect
          value={value}
          useNativeAndroidPickerStyle={false}
          onValueChange={onChange}
          placeholder={{label: placeholder, value: null}}
          items={items || []}
          style={pickerSelectStyles}
          Icon={() => (
            <Icon
              icon="ArrowUpSvg"
              color={colors.DARK_BLUE}
              width={13}
              height={13}
            />
          )}
        />
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    // borderWidth: 0.5,
    // borderColor: colors.LIGHT_BLUE,
    // backgroundColor: '#f00',
    // borderRadius: 8,
    color: colors.DARK_BLUE,
    minWidth: '100%',
    width: '100%',
    textAlign: 'left',
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
    width: '100%',
    textAlign: 'center',
  },
  iconContainer: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    marginRight: 8,
    transform: [{rotate: '180deg'}],
  },
});

const styles = StyleSheet.create({
  iconLeftContainer: {
    display: 'flex',
    height: '100%',
  },
  selectContainer: {
    display: 'flex',
    height: '100%',
    flex: 1,
  },
  container: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#D4F0F2',
    backgroundColor: '#F4FCFD',
    borderRadius: 8,
  },
});
