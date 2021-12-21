import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '../MyText';

const LegalItem = ({title, navigation, path = 'tabs', onClick}) => {
  const handleClick = () => {
    onClick();
    navigation && navigation.navigate(path);
  };
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.container}>
        <View style={styles.answer}>
          <Text style={styles.label}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ccc',
    flex: 1,
    textDecorationLine: 'underline',
  },
  answer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LegalItem;
