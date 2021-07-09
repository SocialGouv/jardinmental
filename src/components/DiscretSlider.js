import React from 'react';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
import {colors} from '../utils/colors';
import Text from '../components/MyText';

export default ({
  numberOfSteps = 10,
  step = 0,
  activeColor = colors.LIGHT_BLUE,
  inactiveColor = '#F4FCFD',
  borderColor = '#D4F0F2',
  onChange,
}) => {
  const size = Dimensions.get('window').width / (1.5 * numberOfSteps);
  return (
    <View style={styles.container}>
      {[...Array(numberOfSteps)].map((_, i) => {
        const index = i + 1;
        return (
          <Item
            onPress={() => onChange(index)}
            key={i}
            showText={step === index}
            text={`${(index / numberOfSteps) * 100}%`}
            backgroundColor={step >= index ? activeColor : inactiveColor}
            borderColor={borderColor}
            size={size}
          />
        );
      })}
    </View>
  );
};

const Item = ({
  backgroundColor,
  borderColor,
  onPress,
  showText,
  text,
  size,
}) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor,
            borderColor,
            height: size,
            width: size,
            borderRadius: size / 2,
          },
        ]}
        onPress={onPress}
      />
      {showText ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 6,
    marginRight: 6,
    borderWidth: 1,
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    color: colors.DARK_BLUE,
    fontSize: 11,
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
