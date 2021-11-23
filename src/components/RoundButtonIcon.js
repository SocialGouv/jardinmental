import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../utils/colors';
import Plus from '../../assets/svg/Plus';
import Pencil from '../../assets/svg/Pencil';
import Bin from '../../assets/svg/Bin';
import ArrowUpSvg from '../../assets/svg/arrow-up.svg';
import Done from '../../assets/svg/Done';
import ArrowRight from '../../assets/svg/arrow-right';

const RoundButtonIcon = ({
  iconColor = colors.BLUE,
  backgroundColor = '#f1f1f1',
  borderColor = '#e1e1e1',
  onPress,
  disabled,
  visible = false,
  isToggled,
  icon,
}) => {
  if (!visible || !icon) return null;
  const render = () => {
    switch (icon) {
      case 'plus':
        return <Plus opacity={disabled ? 0.5 : 1} color={iconColor} />;
      case 'pencil':
        return <Pencil opacity={disabled ? 0.5 : 1} color={iconColor} />;
      case 'bin':
        return <Bin opacity={disabled ? 0.5 : 1} color={iconColor} />;
      case 'cancel':
        return (
          <Plus
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            style={{transform: [{rotate: '45deg'}]}}
          />
        );
      case 'toggle':
        return (
          <ArrowUpSvg
            opacity={disabled ? 0.5 : 1}
            color={iconColor}
            style={{transform: [{rotate: isToggled ? '0deg' : '180deg'}]}}
          />
        );
      case 'validate':
        return <Done opacity={disabled ? 0.5 : 1} color={iconColor} />;
      case 'arrow-right':
        return <ArrowRight opacity={disabled ? 0.5 : 1} color={iconColor} />;
    }
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.backButtonContainer, {backgroundColor, borderColor}]}>
      {render()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
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

export default RoundButtonIcon;
