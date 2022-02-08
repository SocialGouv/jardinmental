import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Text from './MyText';

const styles = StyleSheet.create({
  button: {
    minWidth: '70%',
    minHeight: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#0A215C',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 19,
  },
});

const Button = ({
  title,
  buttonColor,
  textColor,
  onPress = () => null,
  disabled = false,
  buttonStyle,
  textStyle,
}) => {
  const color = disabled ? 'lightgrey' : buttonColor;
  return (
    <TouchableOpacity
      style={[
        {...styles.button, backgroundColor: color || '#1FC6D5'},
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[{...styles.text, color: textColor || 'white'}, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
