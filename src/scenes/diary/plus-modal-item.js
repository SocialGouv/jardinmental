import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import Icon from '../../components/Icon';

export default ({
  title,
  navigation,
  path = 'tabs',
  icon,
  color = colors.LIGHT_BLUE,
  onClick,
}) => {
  const handleClick = () => {
    onClick();
    navigation.navigate(path);
  };
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {icon && <Icon icon={icon} color={color} width={35} height={35} />}
        </View>
        <Text style={styles.label}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 20,
    // backgroundColor: 'blue',
    // borderColor: 'red',
    // borderWidth: 1,
    minWidth: 120,
    maxWidth: 150,
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
