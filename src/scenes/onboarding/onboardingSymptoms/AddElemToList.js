import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, TextInput} from 'react-native';
import {colors} from '../../utils/colors';
import CircledIcon from '../../components/CircledIcon';

export default ({onChange = console.log, placeholder = 'Ajouter...'}) => {
  const [value, setValue] = useState();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setValue}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="lightgrey"
          style={styles.text}
        />
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => {
            onChange(value);
            setValue('');
          }}>
          <CircledIcon
            icon="PlusSvg"
            color="#F4FCFD"
            borderColor="#D4F0F2"
            iconColor={colors.BLUE}
            width={13}
            height={13}
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
  },
});
