import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: '#1FC6D5',
    width: '50%',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
});

const Button = ({title, buttonColor, textColor, onPress}) => {
  return (
    <TouchableOpacity
      style={{...styles.button, backgroundColor: buttonColor || '#1FC6D5'}}
      onPress={onPress || (() => {})}>
      <Text style={{...styles.text, color: textColor || 'white'}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
