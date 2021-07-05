import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../utils/colors';

export default ({
  numberOfSteps,
  step,
  activeColor = colors.DARK_BLUE,
  inactiveColor = '#B6B6B666',
}) => {
  return (
    <View style={styles.container}>
      {[...Array(numberOfSteps)].map((_, i) => (
        <Item
          key={i}
          backgroundColor={step >= i ? activeColor : inactiveColor}
        />
      ))}
    </View>
  );
};

const Item = ({backgroundColor}) => {
  return <View style={[styles.item, {backgroundColor}]} />;
};

const styles = StyleSheet.create({
  item: {
    height: 5,
    width: 15,
    marginRight: 6,
    borderRadius: 4,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
});
