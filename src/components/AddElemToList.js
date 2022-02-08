import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import {colors} from '../utils/colors';
import CircledIcon from './CircledIcon';

export default ({
  onChange = console.log,
  placeholder = 'Ajouter...',
  styleContainer,
  onChangeText = console.log,
  testID
}) => {
  const [value, setValue] = useState();

  return (
    <View style={[styles.container, styleContainer]}>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(e) => {
            setValue(e);
            onChangeText(e);
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="lightgrey"
          style={styles.text}
          testID={testID ? testID+'-input' : undefined}
        />
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          disabled={!value}
          onPress={() => {
            Keyboard.dismiss();
            onChange(value);
            setValue('');
            onChangeText('');
          }}
          testID={testID ? testID+'-add-button' : undefined}>
          <CircledIcon
            icon="PlusSvg"
            color={colors.LIGHT_BLUE}
            borderColor="#fff"
            iconColor="#fff"
            width={13}
            height={13}
            opacity={value ? 1 : 0.38}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: 8,
    transform: [{rotate: '180deg'}],
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#D4F0F2',
    backgroundColor: '#F4FCFD',
    borderRadius: 8,
    color: colors.DARK_BLUE,
  },
  container: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    textAlign: 'left',
    color: colors.DARK_BLUE,
    flex: 1,
  },
});
