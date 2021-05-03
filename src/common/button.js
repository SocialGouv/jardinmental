import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';
import Text from '../components/MyText';

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

const Button = ({
  title,
  buttonColor,
  textColor,
  onPress = () => null,
  disabled = false,
  style,
}) => {
  const color = disabled ? 'lightgrey' : buttonColor;
  return (
    <TouchableOpacity
      style={[{...styles.button, backgroundColor: color || '#1FC6D5'}, style]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={{...styles.text, color: textColor || 'white'}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
