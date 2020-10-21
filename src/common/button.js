import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: '#1FC6D5',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
});

const Button = ({title}) => {
  return (
    <TouchableHighlight style={styles.button} onPress={() => {}}>
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  );
};

export default Button;
