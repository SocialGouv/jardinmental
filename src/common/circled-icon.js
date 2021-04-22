import React from 'react';
import VeryGoodSvg from '../../assets/svg/veryGood.svg';
import GoodSvg from '../../assets/svg/good.svg';
import MiddleSvg from '../../assets/svg/middle.svg';
import BadSvg from '../../assets/svg/bad.svg';
import VeryBadSvg from '../../assets/svg/veryBad.svg';
import TodaySvg from '../../assets/svg/today.svg';
import YesterdaySvg from '../../assets/svg/yesterday.svg';
import NotesSvg from '../../assets/svg/notes.svg';

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

const mapIconToSvg = (icon) => {
  const iconMap = {
    VeryGoodSvg,
    GoodSvg,
    MiddleSvg,
    BadSvg,
    VeryBadSvg,
    TodaySvg,
    YesterdaySvg,
    NotesSvg,
  };
  return iconMap[icon];
};

const CircledIcon = ({icon, color, borderColor = 'lightgrey'}) => {
  const Icon = mapIconToSvg(icon);
  return (
    <View
      style={{
        ...styles.iconContainer,
        backgroundColor: color,
        borderColor,
      }}>
      <Icon width={20} height={20} color="black" />
    </View>
  );
};

export default CircledIcon;
