import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import Icon from '../../components/Icon';
import ArrowRightSvg from '../../../assets/svg/arrow-right.svg';

export default ({
  title,
  navigation,
  path = 'tabs',
  icon,
  color = colors.LIGHT_BLUE,
  onClick,
  badge = false,
}) => {
  const handleClick = () => {
    onClick();
    navigation && navigation.navigate(path);
  };
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.container}>
        <View style={styles.answer}>
          {icon ? (
            <Icon
              badge={badge}
              icon={icon}
              color={color}
              width={30}
              height={30}
              styleContainer={{marginRight: 20}}
            />
          ) : (
            <View style={{marginHorizontal: 30}}></View>
          )}
          <Text style={styles.label}>{title}</Text>
          <View style={styles.button}>
            <ArrowRightSvg />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.BLUE,
    flex: 1,
  },
  answer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
