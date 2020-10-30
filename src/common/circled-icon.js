import React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
});

const CircledIcon = ({Icon, color}) => {
  return (
    <View
      style={{
        ...styles.iconContainer,
        backgroundColor: color,
      }}>
      <Icon width={20} height={20} color="black" />
    </View>
  );
};

export default CircledIcon;
