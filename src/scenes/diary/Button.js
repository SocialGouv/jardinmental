import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../utils/colors';
import Plus from '../../../assets/svg/Plus';
import Pencil from '../../../assets/svg/Pencil';
import Bin from '../../../assets/svg/Bin';
import ArrowUpSvg from '../../../assets/svg/arrow-up.svg';
import Done from '../../../assets/svg/Done';

export default ({onPress, disabled, visible = false, isToggled, icon}) => {
  if (!visible || !icon) return null;
  const render = () => {
    switch (icon) {
      case 'plus':
        return <Plus color={disabled ? colors.DARK_BLUE_TRANS : colors.BLUE} />;
      case 'pencil':
        return (
          <Pencil color={disabled ? colors.DARK_BLUE_TRANS : colors.BLUE} />
        );
      case 'bin':
        return <Bin color={disabled ? colors.DARK_BLUE_TRANS : colors.BLUE} />;
      case 'cancel':
        return (
          <Plus
            color={disabled ? colors.DARK_BLUE_TRANS : colors.BLUE}
            style={{transform: [{rotate: '45deg'}]}}
          />
        );
      case 'toggle':
        return (
          <ArrowUpSvg
            color={disabled ? colors.DARK_BLUE_TRANS : colors.BLUE}
            style={{transform: [{rotate: isToggled ? '0deg' : '180deg'}]}}
          />
        );
      case 'validate':
        return <Done color={disabled ? colors.DARK_BLUE_TRANS : colors.BLUE} />;
    }
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={styles.backButtonContainer}>
      {render()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    borderColor: '#e1e1e1',
    borderWidth: 1,
    height: 40,
    width: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
