import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';
import Icon from '../common/icon';
import ArrowRightSvg from '../../assets/svg/arrow-right.svg';

export const SettingItem = ({
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
        <View style={styles.answer}>
          {icon && <Icon icon={icon} color={color} width={30} height={30} />}
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
    padding: 20,
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

export default SettingItem;
