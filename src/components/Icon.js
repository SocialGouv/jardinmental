import React, {useEffect, useState} from 'react';
import ReminderSettingSvg from '../../assets/svg/reminder-setting.svg';
import ExportDataSettingSvg from '../../assets/svg/export-data-setting.svg';
import ExportDataSvg from '../../assets/svg/export-data.svg';
import SymptomsSetting from '../../assets/svg/symptoms-setting.svg';
import CguSettingSvg from '../../assets/svg/cgu-setting.svg';
import DrugsSvg from '../../assets/svg/drugs.svg';
import InfoSvg from '../../assets/svg/info.svg';
import BurgerSvg from '../../assets/svg/burger.svg';
import PresentationSvg from '../../assets/svg/presentation.svg';
import NewsSvg from '../../assets/svg/news.svg';
import ProtectionSvg from '../../assets/svg/protection.svg';
import GearSvg from '../../assets/svg/gear.svg';
import PlusSvg from '../../assets/svg/plus.svg';
import ClockSvg from '../../assets/svg/clock.svg';
import LightBulbSvg from '../../assets/svg/light-bulb.svg';
import ThoughtsSvg from '../../assets/svg/thoughts.svg';
import CalendarSvg from '../../assets/svg/calendar.svg';
import Text from '../components/MyText';

import {
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';

const mapIconToSvg = (icon) => {
  const iconMap = {
    ReminderSettingSvg,
    ExportDataSettingSvg,
    SymptomsSetting,
    CguSettingSvg,
    DrugsSvg,
    InfoSvg,
    BurgerSvg,
    PresentationSvg,
    NewsSvg,
    ProtectionSvg,
    GearSvg,
    ExportDataSvg,
    PlusSvg,
    ClockSvg,
    LightBulbSvg,
    ThoughtsSvg,
    CalendarSvg,
  };
  return iconMap[icon];
};

const Icon = ({
  icon,
  color,
  styleContainer,
  spin,
  badge = false,
  onPress,
  activeOpacity = 0.4,
  ...props
}) => {
  const [spinFn, setSpinFn] = useState(null);

  useEffect(() => {
    if (spin === undefined) return;

    const spinValue = new Animated.Value(spin ? 0 : 1);

    Animated.timing(spinValue, {
      toValue: spin ? 1 : 0,
      duration: 200,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    }).start();

    setSpinFn(
      spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
      }),
    );
  }, [spin]);

  const Icon = mapIconToSvg(icon);

  const render = () => (
    <Animated.View
      style={[
        styles.iconContainer,
        styleContainer,
        spinFn && {transform: [{rotate: spinFn}]},
      ]}>
      {badge ? (
        <View style={styles.badge}>
          {/* <Text style={styles.badgeText}></Text> */}
        </View>
      ) : null}
      <Icon width={20} height={20} color={color || 'black'} {...props} />
    </Animated.View>
  );

  return onPress ? (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress}>
      {render()}
    </TouchableOpacity>
  ) : (
    render()
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 20,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: '#E46C76',
    borderRadius: 16,
    // paddingHorizontal: 6,
    // paddingVertical: 2,
    zIndex: 2,
    width: 12,
    height: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default Icon;
