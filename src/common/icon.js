import React from 'react';
import ReminderSettingSvg from '../../assets/svg/reminder-setting.svg';
import ExportDataSettingSvg from '../../assets/svg/export-data-setting.svg';
import SymptomsSetting from '../../assets/svg/symptoms-setting.svg';
import CguSettingSvg from '../../assets/svg/cgu-setting.svg';

import {StyleSheet, View} from 'react-native';

const mapIconToSvg = (icon) => {
  const iconMap = {
    ReminderSettingSvg,
    ExportDataSettingSvg,
    SymptomsSetting,
    CguSettingSvg,
  };
  return iconMap[icon];
};

const Icon = ({icon, color, ...props}) => {
  const Icon = mapIconToSvg(icon);
  return (
    <View style={styles.iconContainer}>
      <Icon width={20} height={20} color={color || 'black'} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
});

export default Icon;
