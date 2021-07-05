import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../utils/colors';
import Text from './MyText';

export default ({
  textColor = colors.DARK_BLUE,
  onPress = () => null,
  disabled = false,
  buttonStyle,
  textStyle,
  value,
  selected,
  color = '#1FC6D5',
}) => {
  let backgroundColor = `${color}66`;
  if (selected) backgroundColor = colors.DARK_BLUE;
  if (disabled) backgroundColor = 'lightgrey';

  let borderColor = color;
  if (selected) borderColor = colors.DARK_BLUE;
  if (disabled) borderColor = 'grey';

  let myTextColor = textColor;
  if (selected) myTextColor = 'white';
  if (disabled) myTextColor = 'grey';
  return (
    <TouchableOpacity
      style={[{...styles.button, backgroundColor, borderColor}, buttonStyle]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[{...styles.text, color: myTextColor}, textStyle]}>
        {value}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    height: 38,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: 10,
    borderWidth: 1,
  },
  text: {
    fontWeight: 'normal',
    fontSize: 15,
  },
});
